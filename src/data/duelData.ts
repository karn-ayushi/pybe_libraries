export interface DuelScenario {
  id: string;
  title: string;
  category: 'Vectorization' | 'DataFrame' | 'Deep Learning' | 'Web APIs';
  description: string;
  defaultDataSize: number;
  dataSizeOptions: { label: string; count: number }[];
  contenderA: {
    name: string;
    library: string;
    paradigm: string;
    code: string;
    color: string;
    approxMsPer100k: number;
    explanation: string;
  };
  contenderB: {
    name: string;
    library: string;
    paradigm: string;
    code: string;
    color: string;
    approxMsPer100k: number;
    explanation: string;
  };
  ayushiReaction: string;
  ayushExplanation: {
    whyFaster: string;
    hardwareConcept: string;
    memoryEfficiency: string;
  };
}

export const DUEL_SCENARIOS: DuelScenario[] = [
  {
    id: 'numpy-vs-loops',
    title: 'Vectorized NumPy vs Vanilla Python Loops',
    category: 'Vectorization',
    description: 'Squaring and computing Euclidean norm across 100,000 floats. Watch Python bytecode loop overhead collide with C-level SIMD registers.',
    defaultDataSize: 100000,
    dataSizeOptions: [
      { label: '25,000 items', count: 25000 },
      { label: '100,000 items', count: 100000 },
      { label: '500,000 items', count: 500000 }
    ],
    contenderA: {
      name: 'Vanilla Python for-loop',
      library: 'Pure Python',
      paradigm: 'Interpreted Bytecode Loop',
      code: `import math

def compute_norm_loop(numbers):
    total = 0.0
    for x in numbers:
        total += x ** 2
    return math.sqrt(total)`,
      color: '#EA580C',
      approxMsPer100k: 78.4,
      explanation: 'Each loop iteration creates PyObject box wrappers, checks types dynamically, and evaluates bytecode sequentially.'
    },
    contenderB: {
      name: 'NumPy Vectorized ufunc',
      library: 'NumPy (C / AVX-512)',
      paradigm: 'Contiguous C Buffer SIMD',
      code: `import numpy as np

def compute_norm_vectorized(arr):
    # Single C-level BLAS call across contiguous RAM
    return np.linalg.norm(arr)`,
      color: '#0284C7',
      approxMsPer100k: 0.9,
      explanation: 'Allocates raw 64-bit IEEE 754 floats in contiguous RAM; executes AVX vector instructions operating on 8 floats per CPU cycle.'
    },
    ayushiReaction: "Ayush! Over 80x speedup?! I didn't even upgrade my laptop—I literally just removed the word 'for'!",
    ayushExplanation: {
      whyFaster: "Python is dynamically typed. In a `for` loop, Python inspects the type of `x` 100,000 times! NumPy delegates the entire calculation to pre-compiled C/Fortran routines that never touch the Python interpreter inside the hot loop.",
      hardwareConcept: "CPU Cache Locality & SIMD: NumPy arrays sit contiguously in L1/L2 CPU cache lines. Modern CPU registers (AVX-2 / AVX-512) crunch 8 or 16 numbers in a single clock cycle.",
      memoryEfficiency: "100,000 Python floats = 2.8 MB (due to 28-byte PyFloatObject wrappers). 100,000 NumPy float64 = 800 KB exact flat memory."
    }
  },
  {
    id: 'polars-vs-pandas',
    title: 'Polars Lazy Query Engine vs Pandas .apply()',
    category: 'DataFrame',
    description: 'Multi-condition filtering, string manipulation, and group aggregations on 100,000 records. See Rust multithreading leave single-core Python behind.',
    defaultDataSize: 100000,
    dataSizeOptions: [
      { label: '50,000 rows', count: 50000 },
      { label: '100,000 rows', count: 100000 },
      { label: '300,000 rows', count: 300000 }
    ],
    contenderA: {
      name: 'Pandas .apply(lambda)',
      library: 'Pandas',
      paradigm: 'Python Row-by-Row Iterator',
      code: `import pandas as pd

# Slow row-by-row iteration in Python
df['category'] = df.apply(
    lambda r: f"{r.dept}_{r.region.upper()}" if r.sales > 500 else "LOW",
    axis=1
)`,
      color: '#EC4899',
      approxMsPer100k: 142.0,
      explanation: '.apply() with axis=1 constructs a new Pandas Series object for each row, invoking the Python function 100,000 times.'
    },
    contenderB: {
      name: 'Polars Lazy Expression',
      library: 'Polars (Rust / Arrow2)',
      paradigm: 'Multithreaded Lazy Execution',
      code: `import polars as pl

# Parallel Rust expression engine with zero copies
q = df.lazy().with_columns(
    pl.when(pl.col('sales') > 500)
    .then(pl.col('dept') + '_' + pl.col('region').str.to_uppercase())
    .otherwise(pl.lit('LOW'))
    .alias('category')
).collect()`,
      color: '#10B981',
      approxMsPer100k: 2.1,
      explanation: 'Compiles query into an optimized execution graph, executes across all available CPU cores without Global Interpreter Lock (GIL).'
    },
    ayushiReaction: "Polars finished before my progress bar even rendered! It ran on all 8 cores while Pandas only maxed out one!",
    ayushExplanation: {
      whyFaster: "Pandas' `.apply(axis=1)` is literally a hidden Python loop in disguise. Polars expressions are declarative query trees written in pure Rust that run in parallel with Apache Arrow chunking.",
      hardwareConcept: "GIL-Free Multithreading: Python's Global Interpreter Lock (GIL) forces Pandas to run on 1 CPU core. Polars drops Python's GIL entirely during execution, saturating all available CPU threads.",
      memoryEfficiency: "Arrow uses columnar bitmask validity, eliminating intermediate copies. Polars processes data in chunked cache-friendly batches."
    }
  },
  {
    id: 'pytorch-vs-python',
    title: 'PyTorch GPU/Tensor GEMM vs Nested Matrix Loops',
    category: 'Deep Learning',
    description: 'Matrix multiplication of two (400 × 400) dense floating-point matrices (64 million multiply-adds).',
    defaultDataSize: 400,
    dataSizeOptions: [
      { label: '200 × 200', count: 200 },
      { label: '400 × 400', count: 400 },
      { label: '800 × 800', count: 800 }
    ],
    contenderA: {
      name: 'Triply-Nested Python Loop',
      library: 'Pure Python Lists',
      paradigm: 'O(N^3) Nested Iteration',
      code: `def matmul_loops(A, B):
    N = len(A)
    C = [[0.0]*N for _ in range(N)]
    for i in range(N):
        for j in range(N):
            for k in range(N):
                C[i][j] += A[i][k] * B[k][j]
    return C`,
      color: '#F59E0B',
      approxMsPer100k: 412.0,
      explanation: '64,000,000 list index lookups and pointer dereferences through dynamic Python list objects.'
    },
    contenderB: {
      name: 'PyTorch Tensor @ (GEMM)',
      library: 'PyTorch (OpenBLAS / cuBLAS)',
      paradigm: 'SIMD Blocked Matrix Multiply',
      code: `import torch

# High-performance BLAS level 3 GEMM
# C = A @ B (tensors in memory)
C = torch.matmul(tensor_A, tensor_B)`,
      color: '#8B5CF6',
      approxMsPer100k: 1.2,
      explanation: 'Uses tiled cache blocking, Strassen/GEMM kernel optimizations, and vector fused multiply-accumulate (FMA) instructions.'
    },
    ayushiReaction: "340 times faster?! No wonder people use PyTorch instead of writing algorithms by hand!",
    ayushExplanation: {
      whyFaster: "Python list-of-lists involves pointers to pointers in scattered RAM addresses, causing constant CPU cache misses. PyTorch stores numbers in a flat 1D buffer with calculated stride offsets.",
      hardwareConcept: "Tiled Cache Blocking: Matrix multiply reads columns of B, which jumps through memory. PyTorch splits matrices into tiny tiles that fit inside the CPU's ultra-fast L1 cache.",
      memoryEfficiency: "Zero pointer overhead. Flat contiguous memory buffer with hardware stride registers."
    }
  }
];
