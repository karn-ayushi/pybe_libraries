export interface BugScenario {
  id: string;
  library: 'Pandas' | 'PyTorch' | 'NumPy' | 'FastAPI' | 'Polars' | 'Seaborn';
  title: string;
  ayushiStory: string;
  buggyCode: string;
  errorTraceback: string;
  faultyLineNumber: number; // 1-indexed
  options: {
    id: string;
    label: string;
    fixedCode: string;
    explanation: string;
    isCorrect: boolean;
  }[];
  ayushDebrief: {
    rootCause: string;
    cLevelInsight: string;
    proRuleOfThumb: string;
  };
  outputSuccessSnippet: string;
}

export const BUG_HUNT_SCENARIOS: BugScenario[] = [
  {
    id: 'pandas-setting-with-copy',
    library: 'Pandas',
    title: 'The Infamous SettingWithCopyWarning',
    ayushiStory: "Ayush! I tried giving everyone in our analytics team a bonus, but Pandas printed this huge scary warning in bright red! Did the values even save?!",
    buggyCode: `import pandas as pd

df = pd.DataFrame({
    'name': ['Ayushi', 'Ayush', 'Bob'],
    'team': ['Analytics', 'Analytics', 'DevOps'],
    'salary': [90000, 95000, 85000]
})

# Chained indexing attempt to update salaries
df[df['team'] == 'Analytics']['salary'] = 120000
print(df)`,
    errorTraceback: `SettingWithCopyWarning: 
A value is trying to be set on a copy of a slice from a DataFrame.
Try using .loc[row_indexer, col_indexer] = value instead

See the caveats in the documentation: https://pandas.pydata.org/pandas-docs/stable/...`,
    faultyLineNumber: 10,
    options: [
      {
        id: 'opt-loc',
        label: "Use df.loc[df['team'] == 'Analytics', 'salary'] = 120000",
        fixedCode: `df.loc[df['team'] == 'Analytics', 'salary'] = 120000`,
        explanation: ".loc performs a single index lookup directly on the original DataFrame's memory buffer without creating an intermediate temporary copy.",
        isCorrect: true
      },
      {
        id: 'opt-inplace',
        label: "df[df['team'] == 'Analytics']['salary'].replace(90000, 120000, inplace=True)",
        fixedCode: `df[df['team'] == 'Analytics']['salary'].replace(90000, 120000, inplace=True)`,
        explanation: "Chained indexing with .replace() still operates on an intermediate slice view and will trigger the exact same warning.",
        isCorrect: false
      },
      {
        id: 'opt-loop',
        label: "for idx, row in df.iterrows(): row['salary'] = 120000",
        fixedCode: `for idx, row in df.iterrows(): row['salary'] = 120000`,
        explanation: "iterrows() returns a Series copy for each row; modifying that Series does NOT write back to the DataFrame at all, plus it's 500x slower.",
        isCorrect: false
      }
    ],
    ayushDebrief: {
      rootCause: "Chained indexing `df[mask]['col'] = val` splits the operation into two Python calls: `__getitem__` (which may return a temporary copy) followed by `__setitem__` on that temporary object. Pandas can't guarantee if you're modifying original memory or a throwaway copy.",
      cLevelInsight: "Pandas uses NumPy BlockManager underneath. When you slice rows, Pandas often slices pointers without copying data until write-time (Copy-on-Write). Using `.loc[rows, cols]` ensures a single atomic assignment in C.",
      proRuleOfThumb: "Always use `.loc[rows, cols]` for writing values. Never use back-to-back brackets `[][]` for assignments."
    },
    outputSuccessSnippet: `     name       team  salary
0  Ayushi  Analytics  120000
1   Ayush  Analytics  120000
2     Bob     DevOps   85000

✅ Updated in-place with zero warnings!`
  },
  {
    id: 'pytorch-shape-mismatch',
    library: 'PyTorch',
    title: 'Linear Layer Dimension Collision',
    ayushiStory: "I constructed my first neural network classifier! But as soon as I passed my batch of 64 sample embeddings, PyTorch threw a matrix multiplication size crash!",
    buggyCode: `import torch
import torch.nn as nn

# Input batch: 64 samples, each with 128 embedding features
batch = torch.randn(64, 128)

# Ayushi's classifier layer definition
layer = nn.Linear(in_features=64, out_features=10)

# Forward pass crashes!
output = layer(batch)`,
    errorTraceback: `RuntimeError: mat1 and mat2 shapes cannot be multiplied (64x128 and 64x10)`,
    faultyLineNumber: 8,
    options: [
      {
        id: 'opt-fix-linear',
        label: "Change in_features to 128: nn.Linear(in_features=128, out_features=10)",
        fixedCode: `layer = nn.Linear(in_features=128, out_features=10)`,
        explanation: "In PyTorch, nn.Linear(in_features, out_features) expects the incoming feature dimension (128), NOT the batch size (64). The weight matrix is shape (10, 128) and computes X @ W.T (64, 128) @ (128, 10) = (64, 10).",
        isCorrect: true
      },
      {
        id: 'opt-transpose-batch',
        label: "Transpose the batch before feeding: layer(batch.T)",
        fixedCode: `output = layer(batch.T)`,
        explanation: "Transposing gives shape (128, 64). Feeding this into (64, 10) gives shape (128, 10), which misinterprets features as batch samples and breaks backprop!",
        isCorrect: false
      },
      {
        id: 'opt-flatten',
        label: "Flatten the batch with batch.view(-1)",
        fixedCode: `output = layer(batch.view(-1))`,
        explanation: "Flattening gives a 1D tensor of length 8192, which will still fail because Linear expects a 2D batch tensor with matching inner dimensions.",
        isCorrect: false
      }
    ],
    ayushDebrief: {
      rootCause: "`nn.Linear` applies the transformation $y = xA^T + b$. Matrix multiplication $(N, D_{in}) \\times (D_{in}, D_{out})$ requires the inner dimensions to match. Beginners often mistakenly pass batch size to `in_features`.",
      cLevelInsight: "PyTorch's cuBLAS/BLAS GEMM kernels require continuous stride along the contracted dimension. When dimensions don't line up, the low-level C++ binding immediately aborts to prevent illegal memory addressing.",
      proRuleOfThumb: "`nn.Linear` parameterizes feature space, never batch space. Set `in_features = input.shape[-1]`."
    },
    outputSuccessSnippet: `Output tensor shape: torch.Size([64, 10])
Batch preserved: 64 samples
Classes produced: 10 logits per sample
✅ Forward pass completed cleanly in 0.8ms!`
  },
  {
    id: 'numpy-broadcast-axis',
    library: 'NumPy',
    title: 'Broadcasting Axis Dimensional Trap',
    ayushiStory: "I have a 3x4 matrix and I want to subtract the column means or row means, but NumPy says operands could not be broadcast together!",
    buggyCode: `import numpy as np

# 3 rows, 4 columns
matrix = np.array([
    [10, 20, 30, 40],
    [50, 60, 70, 80],
    [90, 100, 110, 120]
])

# Ayushi calculates the mean across each row -> shape is (3,)
row_means = matrix.mean(axis=1)

# Subtracting row means crashes!
normalized = matrix - row_means`,
    errorTraceback: `ValueError: operands could not be broadcast together with shapes (3,4) (3,)`,
    faultyLineNumber: 14,
    options: [
      {
        id: 'opt-keepdims',
        label: "Add keepdims=True or use matrix.mean(axis=1, keepdims=True)",
        fixedCode: `row_means = matrix.mean(axis=1, keepdims=True)
normalized = matrix - row_means`,
        explanation: "NumPy broadcasting aligns trailing dimensions first! Shape (3,) aligns with column count (4) and fails. keepdims=True keeps shape as (3, 1), allowing it to broadcast across all 4 columns.",
        isCorrect: true
      },
      {
        id: 'opt-change-axis',
        label: "Change axis=1 to axis=0: matrix.mean(axis=0)",
        fixedCode: `col_means = matrix.mean(axis=0)
normalized = matrix - col_means`,
        explanation: "While this runs without crashing (since shape (4,) matches the last dimension of (3,4)), it computes column means instead of the row means Ayushi asked for.",
        isCorrect: false
      },
      {
        id: 'opt-flatten',
        label: "Use matrix.flatten() - row_means.repeat(4)",
        fixedCode: `normalized = (matrix.flatten() - np.repeat(row_means, 4)).reshape(3, 4)`,
        explanation: "While this manually computes the numbers, it creates multiple memory allocations and defeats NumPy's zero-copy broadcasting mechanism.",
        isCorrect: false
      }
    ],
    ayushDebrief: {
      rootCause: "NumPy broadcasting starts comparing shapes from right to left (trailing dimensions). For `(3, 4)` and `(3,)`, it compares `4` and `3`. Neither is `1`, so broadcasting fails immediately.",
      cLevelInsight: "When you use `keepdims=True`, the shape becomes `(3, 1)`. NumPy checks `4` against `1` (which broadcasts to 4), and `3` against `3` (which matches). Stride along dimension 1 is set to 0 bytes—zero memory copied!",
      proRuleOfThumb: "Always pass `keepdims=True` when reducing across an axis if you plan to subtract or divide the result back into the original array."
    },
    outputSuccessSnippet: `Row means shape: (3, 1)
Normalized matrix:
[[-15.  -5.   5.  15.]
 [-15.  -5.   5.  15.]
 [-15.  -5.   5.  15.]]

✅ Broadcasted with stride=0 (zero extra memory allocated)!`
  },
  {
    id: 'fastapi-sync-async-blocking',
    library: 'FastAPI',
    title: 'The Accidental Event Loop Freeze',
    ayushiStory: "I wrote an endpoint with `async def`, but whenever one client calls it, all other users in our company get locked out and the server stalls! What is blocking my server?",
    buggyCode: `from fastapi import FastAPI
import time

app = FastAPI()

# Ayushi's endpoint declared as async
@app.get("/compute-report")
async def compute_heavy_report():
    # Heavy synchronous simulation or slow blocking file I/O
    time.sleep(5)
    return {"status": "success", "rows": 10000}`,
    errorTraceback: `Client Timeout / Latency Spike:
GET /compute-report -> 5002ms
GET /healthcheck -> BLOCKED waiting 4998ms for main async event loop thread!`,
    faultyLineNumber: 9,
    options: [
      {
        id: 'opt-regular-def',
        label: "Change 'async def' to standard 'def' (so FastAPI offloads it to a background threadpool)",
        fixedCode: `@app.get("/compute-report")
def compute_heavy_report():
    time.sleep(5)
    return {"status": "success", "rows": 10000}`,
        explanation: "When an endpoint is declared as regular 'def', FastAPI automatically runs it in Starlette's external threadpool, keeping the main asyncio event loop responsive for other requests!",
        isCorrect: true
      },
      {
        id: 'opt-async-sleep',
        label: "Keep async def but replace time.sleep(5) with await asyncio.sleep(5) if purely non-blocking",
        fixedCode: `import asyncio

@app.get("/compute-report")
async def compute_heavy_report():
    await asyncio.sleep(5)
    return {"status": "success", "rows": 10000}`,
        explanation: "While asyncio.sleep yields the loop, for actual CPU-bound Python work (Pandas/NumPy), you should offload to a worker thread or process, or use standard 'def'.",
        isCorrect: false
      },
      {
        id: 'opt-multi-worker',
        label: "Keep the code unchanged and just launch uvicorn with --workers 64",
        fixedCode: `# CLI: uvicorn app:app --workers 64`,
        explanation: "Spawning 64 heavy OS processes wastes gigabytes of RAM and still freezes when 65 concurrent users request reports.",
        isCorrect: false
      }
    ],
    ayushDebrief: {
      rootCause: "When you mark a route with `async def`, FastAPI executes it directly on Python's single-threaded `asyncio` event loop. Any blocking call like `time.sleep()`, synchronous DB calls, or heavy Pandas computation freezes the entire server thread.",
      cLevelInsight: "FastAPI is uniquely smart: if you write regular `def`, it runs the function inside an `anyio` threadpool executor. If you write `async def`, it assumes you are only awaiting non-blocking coroutines.",
      proRuleOfThumb: "If your code uses synchronous blocking libraries (requests, time.sleep, psycopg2, synchronous Pandas), declare it with regular `def`!"
    },
    outputSuccessSnippet: `Server running on AnyIO ThreadPool:
[Worker 1] /compute-report running in thread-4
[Main Loop] /healthcheck responded in 0.4ms
✅ Event loop kept 100% free and snappy!`
  },
  {
    id: 'polars-schema-strict-cast',
    library: 'Polars',
    title: 'Polars Strict Schema Parsing Panic',
    ayushiStory: "Polars is so fast, but when I tried parsing our date strings, it panicked and crashed with a ComputeError because of one rogue format!",
    buggyCode: `import polars as pl

df = pl.DataFrame({
    'timestamp': ['2024-01-15', '2024-02-20', 'invalid_date', '2024-03-30'],
    'value': [100, 200, 150, 300]
})

# Polars strict type cast crashes on unexpected values
parsed = df.with_columns(
    pl.col('timestamp').str.to_date()
)`,
    errorTraceback: `ComputeError: strict date parsing failed for value 'invalid_date' with format '%Y-%m-%d'.
Consider setting strict=False to turn parse errors into null values.`,
    faultyLineNumber: 10,
    options: [
      {
        id: 'opt-strict-false',
        label: "Use pl.col('timestamp').str.to_date(strict=False)",
        fixedCode: `parsed = df.with_columns(
    pl.col('timestamp').str.to_date(strict=False)
)`,
        explanation: "Polars enforces strict Rust-level safety by default. Setting strict=False safely converts unparseable strings to nulls without crashing the entire batch query.",
        isCorrect: true
      },
      {
        id: 'opt-try-except',
        label: "Wrap it in a Python try/except inside a custom lambda with .map_elements()",
        fixedCode: `df.with_columns(pl.col('timestamp').map_elements(lambda x: try_date(x)))`,
        explanation: "Calling Python lambdas drops out of Rust and eliminates Polars' multi-threaded SIMD execution, slowing queries by up to 80x.",
        isCorrect: false
      },
      {
        id: 'opt-drop-nulls-before',
        label: "Call df.drop_nulls('timestamp') before converting",
        fixedCode: `df.drop_nulls('timestamp').with_columns(pl.col('timestamp').str.to_date())`,
        explanation: "'invalid_date' is a non-null string, so drop_nulls() does nothing to eliminate it.",
        isCorrect: false
      }
    ],
    ayushDebrief: {
      rootCause: "Polars is built in Rust and adheres to strict type semantics. Unlike Pandas which silently coerces or leaves objects as 'object' dtype, Polars refuses to compromise memory layouts unless you explicitly permit nulls.",
      cLevelInsight: "Polars builds Arrow ChunkedArrays. Arrow requires fixed memory bitmasks for validity. Setting `strict=False` writes a 0 to the null bitmask in Rust without allocating garbage string buffers.",
      proRuleOfThumb: "Always use `strict=False` in Polars when ingesting dirty production data, then filter or impute nulls with `.fill_null()`."
    },
    outputSuccessSnippet: `shape: (4, 2)
┌────────────┬───────┐
│ timestamp  ┆ value │
│ ---        ┆ ---   │
│ date       ┆ i64   │
╞════════════╪═══════╡
│ 2024-01-15 ┆ 100   │
│ 2024-02-20 ┆ 200   │
│ null       ┆ 150   │
│ 2024-03-30 ┆ 300   │
└────────────┴───────┘
✅ Unparseable entry safely turned to Arrow null!`
  }
];
