export interface FlipCardItem {
  id: string;
  library: 'Pandas' | 'PyTorch' | 'NumPy' | 'Polars' | 'FastAPI' | 'Seaborn';
  title: string;
  confusionBadge: string;
  conceptA: {
    name: string;
    summary: string;
    syntax: string;
  };
  conceptB: {
    name: string;
    summary: string;
    syntax: string;
  };
  ayushRuleOfThumb: string;
  ayushiMnemonic: string;
  practicalExample: string;
}

export const FLIP_CARDS_DATA: FlipCardItem[] = [
  {
    id: 'pandas-loc-vs-iloc',
    library: 'Pandas',
    title: '.loc[] vs .iloc[]',
    confusionBadge: 'Label vs Position Indexing',
    conceptA: {
      name: '.loc[rows, cols]',
      summary: 'Label-based indexing. Both start and stop boundaries are INCLUSIVE.',
      syntax: "df.loc['2024-01-01':'2024-01-05', ['price', 'volume']]"
    },
    conceptB: {
      name: '.iloc[rows, cols]',
      summary: 'Integer position-based (0 to N-1). Stop boundary is EXCLUSIVE (standard Python slice).',
      syntax: "df.iloc[0:5, [1, 3]]"
    },
    ayushRuleOfThumb: "Use .loc when querying business labels or boolean masks (`df.loc[df.age > 25]`). Use .iloc when slicing top-N rows by position.",
    ayushiMnemonic: "'i' in .iloc stands for 'Integer position'!",
    practicalExample: `# Slicing rows 0 through 4:
df.iloc[0:5]      # 5 rows (0, 1, 2, 3, 4)
df.loc[0:4]       # 5 rows if index is integer (inclusive of 4!)`
  },
  {
    id: 'pytorch-view-vs-reshape',
    library: 'PyTorch',
    title: 'tensor.view() vs tensor.reshape()',
    confusionBadge: 'Contiguity & Memory Copies',
    conceptA: {
      name: 'tensor.view(*shape)',
      summary: 'Returns a new tensor sharing the EXACT same underlying storage. Fails with RuntimeError if tensor is non-contiguous!',
      syntax: "x = tensor.view(batch_size, -1)"
    },
    conceptB: {
      name: 'tensor.reshape(*shape)',
      summary: 'Attempts view() first; if tensor is non-contiguous (e.g. after .transpose()), silently copies memory to make it contiguous.',
      syntax: "x = tensor.reshape(batch_size, -1)"
    },
    ayushRuleOfThumb: "Use .view() if you want to GUARANTEE zero memory copies (fails loudly if sliced). Use .reshape() if you want safe reshaping without worrying about strides.",
    ayushiMnemonic: "view() is like a glass window (same data viewed differently). reshape() might buy a new box!",
    practicalExample: `# After transpose, view() fails:
y = x.transpose(0, 1)
# y.view(-1) -> RuntimeError: tensor not contiguous!
y.contiguous().view(-1) # Works!
y.reshape(-1)           # Works automatically (clones if needed)`
  },
  {
    id: 'numpy-axis-0-vs-1',
    library: 'NumPy',
    title: 'axis=0 vs axis=1 in Reductions',
    confusionBadge: 'Collapsing Dimension Direction',
    conceptA: {
      name: 'axis=0 (Rows collapse)',
      summary: 'Operates ALONG the rows (downwards), collapsing all rows into a single summary vector (column-wise aggregates).',
      syntax: "matrix.mean(axis=0) # shape (cols,)"
    },
    conceptB: {
      name: 'axis=1 (Columns collapse)',
      summary: 'Operates ACROSS columns (horizontally), collapsing all columns into a single summary vector (row-wise aggregates).',
      syntax: "matrix.mean(axis=1) # shape (rows,)"
    },
    ayushRuleOfThumb: "The axis number you specify is the dimension that gets COLLAPSED away into the output shape.",
    ayushiMnemonic: "Think of axis=0 as pulling the vertical accordion shut; axis=1 pulls the horizontal accordion shut!",
    practicalExample: `arr = np.array([[1, 2], [3, 4]])
arr.sum(axis=0) # [1+3, 2+4] = [4, 6] (downwards)
arr.sum(axis=1) # [1+2, 3+4] = [3, 7] (sideways)`
  },
  {
    id: 'fastapi-async-vs-sync',
    library: 'FastAPI',
    title: 'async def vs standard def Endpoints',
    confusionBadge: 'Event Loop vs ThreadPool',
    conceptA: {
      name: 'async def route():',
      summary: 'Runs directly on the single-threaded asyncio event loop. MUST only use non-blocking I/O (`await`).',
      syntax: "@app.get('/')\nasync def fetch_api():\n    return await client.get(...)"
    },
    conceptB: {
      name: 'def route():',
      summary: 'FastAPI automatically spawns a separate worker thread from Starlette threadpool. Safe for synchronous blocking libraries.',
      syntax: "@app.get('/')\ndef heavy_calc():\n    return run_heavy_pandas(df)"
    },
    ayushRuleOfThumb: "If calling requests, psycopg2, or Pandas, use `def`. If calling httpx with `await` or asyncpg, use `async def`.",
    ayushiMnemonic: "Don't put a slow sleeping elephant (`time.sleep`) in the single-lane async expressway!",
    practicalExample: `# BAD: Freezes all users for 5s
@app.get("/slow")
async def bad(): time.sleep(5)

# GOOD: Background thread keeps main loop free
@app.get("/slow")
def good(): time.sleep(5)`
  },
  {
    id: 'polars-select-vs-with-columns',
    library: 'Polars',
    title: '.select() vs .with_columns()',
    confusionBadge: 'Projection vs Enrichment',
    conceptA: {
      name: 'df.select([...])',
      summary: 'Projects ONLY the specified columns. All other unmentioned columns in the DataFrame are dropped.',
      syntax: "df.select([pl.col('name'), pl.col('salary') * 1.1])"
    },
    conceptB: {
      name: 'df.with_columns([...])',
      summary: 'Keeps ALL existing columns and adds or replaces the specified columns in-place.',
      syntax: "df.with_columns([(pl.col('salary') * 1.1).alias('new_salary')])"
    },
    ayushRuleOfThumb: "Use .with_columns() when creating feature engineering columns. Use .select() when creating a final report export.",
    ayushiMnemonic: "select is SQL SELECT (narrow filter); with_columns is 'keep everything, plus this extra bonus'!",
    practicalExample: `# Drop everything except 1 column:
df.select(pl.col('age'))

# Keep all 20 columns, and update 1 column:
df.with_columns(pl.col('age') + 1)`
  },
  {
    id: 'seaborn-figure-vs-axes',
    library: 'Seaborn',
    title: 'Figure-Level (relplot) vs Axes-Level (scatterplot)',
    confusionBadge: 'FacetGrid vs Matplotlib Axes',
    conceptA: {
      name: 'Figure-Level: sns.relplot(), sns.catplot()',
      summary: 'Creates and manages its own Matplotlib Figure and FacetGrid. Supports easy multi-panel column/row faceting.',
      syntax: "g = sns.relplot(data=df, x='x', y='y', col='region')\ng.set_axis_labels('X', 'Y')"
    },
    conceptB: {
      name: 'Axes-Level: sns.scatterplot(), sns.barplot()',
      summary: 'Plots onto a single specific Matplotlib Axes object (`ax`). Seamlessly integrates into custom plt.subplots grids.',
      syntax: "fig, ax = plt.subplots()\nsns.scatterplot(data=df, x='x', y='y', ax=ax)\nax.set_xlabel('X')"
    },
    ayushRuleOfThumb: "Use Figure-level for fast exploratory faceting (`col='category'`). Use Axes-level when building complex custom multi-chart dashboards.",
    ayushiMnemonic: "relplot/catplot is the full director (owns the stage); scatterplot is an actor placed on a designated chair (ax)!",
    practicalExample: `# Axes-level allows placing on subplot:
fig, (ax1, ax2) = plt.subplots(1, 2)
sns.scatterplot(data=df, x='x', y='y', ax=ax1)
sns.histplot(data=df, x='x', ax=ax2)`
  }
];
