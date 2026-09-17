import { Lesson } from '../types';

export const PANDAS_LESSON: Lesson = {
  id: 'pandas-data-detective',
  slug: 'pandas-data-detective',
  title: 'The Data Detective',
  tagline: 'How tabular superpowers tame 50,000 messy customer records in milliseconds.',
  topic: 'Pandas & DataFrames',
  category: 'Data Science',
  difficulty: 'Beginner',
  estimatedMinutes: 8,
  icon: 'Database',
  
  jobRole: {
    title: 'Data Analyst',
    industry: 'E-Commerce & Retail Intelligence',
    realWorldUse: 'Cleans, filters, transforms, and calculates business KPIs from raw transaction logs.',
    typicalDailyTasks: [
      'Finding customer retention & churn patterns',
      'Calculating store revenue averages by region',
      'Filtering high-value transactions for fraud alerts'
    ]
  },

  realWorldProblem: {
    headline: '50,000 Unorganized Store Receipts',
    description: 'Maya is a Data Analyst at Metro Mart. The CEO asks: "Who are our top-spending VIP customers in Seattle, and what is our average order value?" Maya opens 14 raw CSV files with thousands of tangled rows. Doing this by hand in a standard spreadsheet crashes the program and would take 3 weeks.',
    scaleMetric: '50,000+ transaction rows across 4 regional branches',
    failureOfManualWork: 'Spreadsheets freeze; manual row-by-row scanning takes 120+ hours and is prone to human calculation errors.'
  },

  characters: [
    {
      id: 'maya',
      name: 'Maya',
      role: 'Data Analyst',
      represents: 'The Human Problem Solver / Programmer',
      whatTheyNeedToAccomplish: 'Extract actionable customer insights and revenue numbers quickly without manual spreadsheet crashes.',
      avatarEmoji: '👩‍💻',
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      quote: 'I have thousands of rows in separate files. If I inspect them one by one, the report will be weeks late!'
    },
    {
      id: 'raw-data',
      name: 'Raw Records',
      role: 'Messy Data Source',
      represents: 'Unstructured CSVs / Database Dumps',
      whatTheyNeedToAccomplish: 'Be structured into clean rows, columns, and proper data types.',
      avatarEmoji: '📦',
      badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
      quote: 'We are 50,000 messy rows with missing prices and mixed date formats!'
    },
    {
      id: 'python-core',
      name: 'Python',
      role: 'The Engine',
      represents: 'General Purpose Programming Environment',
      whatTheyNeedToAccomplish: 'Execute logic and memory operations efficiently.',
      avatarEmoji: '🐍',
      badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
      quote: 'I can compute anything, but nested loops over raw text lists are slow for giant tables. I need a specialist.'
    },
    {
      id: 'pandas',
      name: 'Pandas',
      role: 'Tabular Specialist',
      represents: 'Data Analysis & Manipulation Library',
      whatTheyNeedToAccomplish: 'Load 50k rows into a high-performance 2D DataFrame, filter in 1 line, and aggregate numbers instantly.',
      avatarEmoji: '🐼',
      badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      quote: 'Hand me those files! I will organize them into an indexed DataFrame and answer your queries in 0.02 seconds.'
    }
  ],

  technicalTranslations: [
    {
      storyCharacter: 'Maya (The Problem Solver)',
      technicalConcept: 'Programmer / Python Script',
      storyExplanation: 'The person directing the workflow and asking the business questions.',
      technicalExplanation: 'The script instructions that import packages, invoke methods, and print results.',
      codeSnippet: 'import pandas as pd'
    },
    {
      storyCharacter: 'The Messy Filing Cabinets',
      technicalConcept: 'Raw CSV / Database Files',
      storyExplanation: 'Unorganized records stored on disk that cannot be queried directly.',
      technicalExplanation: 'Plain-text files with delimiter-separated values (like comma or tab).',
      codeSnippet: "df = pd.read_csv('customers.csv')"
    },
    {
      storyCharacter: 'The Smart Grid Table',
      technicalConcept: 'DataFrame',
      storyExplanation: 'A 2-dimensional grid with labeled columns and indexed rows held in fast memory.',
      technicalExplanation: 'A primary pandas data structure with columnar vectorized operations.',
      codeSnippet: "df[['customer_name', 'amount', 'city']]"
    },
    {
      storyCharacter: 'The VIP Magnifying Glass',
      technicalConcept: 'Boolean Masking & Filtering',
      storyExplanation: 'Instantly picking only rows where the city is Seattle and amount > $100.',
      technicalExplanation: "Evaluating conditional expressions across entire Series in parallel.",
      codeSnippet: "seattle_vips = df[(df['city'] == 'Seattle') & (df['amount'] > 100)]"
    },
    {
      storyCharacter: 'The Quick Calculator',
      technicalConcept: 'Aggregation Methods (.mean(), .groupby())',
      storyExplanation: 'Calculating the average price across all selected rows in one blink.',
      technicalExplanation: 'Calling fast C-compiled mathematical routines over table columns.',
      codeSnippet: "avg_spend = seattle_vips['amount'].mean()"
    }
  ],

  fullPythonCode: `import pandas as pd

# 1. Load the raw customer dataset
df = pd.read_csv('metro_customers.csv')

# 2. Filter for Seattle transactions above $100
seattle_vips = df[(df['city'] == 'Seattle') & (df['purchase_amount'] > 100)]

# 3. Sort by highest spender first
sorted_vips = seattle_vips.sort_values(by='purchase_amount', ascending=False)

# 4. Calculate key metrics
avg_order = sorted_vips['purchase_amount'].mean()
total_vip_revenue = sorted_vips['purchase_amount'].sum()

print(f"Found {len(sorted_vips)} VIPs in Seattle!")
print(f"Average Order: \${avg_order:.2f}")
print(f"Total VIP Revenue: \${total_vip_revenue:,.2f}")
`,

  storyToCodeMappings: [
    {
      id: 'map-1',
      storyAction: 'Maya calls in the Tabular Specialist',
      programmingConcept: 'Import Library & Alias',
      codeSnippet: 'import pandas as pd',
      highlightLineNumbers: [1],
      storyNote: 'Brings Pandas into the workshop and gives it the familiar nickname "pd".',
      technicalNote: 'Imports the pandas module under the universally recognized alias pd.'
    },
    {
      id: 'map-2',
      storyAction: 'Pouring 50,000 records onto the organized table',
      programmingConcept: 'Read CSV to DataFrame',
      codeSnippet: "df = pd.read_csv('metro_customers.csv')",
      highlightLineNumbers: [4],
      storyNote: 'Pandas takes all raw disk files and lays them into a clean 2D DataFrame grid.',
      technicalNote: 'Parses raw comma-delimited text and constructs typed series columns.'
    },
    {
      id: 'map-3',
      storyAction: 'Filtering for Seattle spenders over $100',
      programmingConcept: 'Vectorized Boolean Filtering',
      codeSnippet: "seattle_vips = df[(df['city'] == 'Seattle') & (df['purchase_amount'] > 100)]",
      highlightLineNumbers: [7],
      storyNote: 'The magnifying glass selects only matching rows in a single breath.',
      technicalNote: 'Generates boolean series masks and slices matching index rows without manual loops.'
    },
    {
      id: 'map-4',
      storyAction: 'Arranging the biggest spenders to the top',
      programmingConcept: 'DataFrame Sorting',
      codeSnippet: "sorted_vips = seattle_vips.sort_values(by='purchase_amount', ascending=False)",
      highlightLineNumbers: [10],
      storyNote: 'Reorders the list so the highest spender sits proudly on row #1.',
      technicalNote: 'Applies fast quicksort/mergesort algorithms along the specified column axis.'
    },
    {
      id: 'map-5',
      storyAction: 'Instantly calculating the average and total',
      programmingConcept: 'Column Aggregations (.mean(), .sum())',
      codeSnippet: "avg_order = sorted_vips['purchase_amount'].mean()\ntotal_vip_revenue = sorted_vips['purchase_amount'].sum()",
      highlightLineNumbers: [13, 14],
      storyNote: 'The calculator sums up the numbers in 0.001 seconds.',
      technicalNote: 'Computes statistical summaries using vectorized numeric operations.'
    }
  ],

  scenes: [
    {
      id: 'scene-1',
      sceneNumber: 1,
      type: 'problem',
      title: 'The Overwhelmed Analyst',
      subtitle: 'A Monday morning avalanche of raw customer data.',
      storyText: 'Maya arrives at her desk at Metro Mart. The CEO bursts in: "Our investors need to know our VIP customers in Seattle and the average purchase value before 11:00 AM!" Maya opens the central database folder and gasps: there are 50,000 unorganized purchase rows scattered in messy files.',
      technicalText: 'The application requires ingesting large tabular datasets (50,000+ rows), performing multi-column conditional filtering, sorting by numeric metrics, and calculating statistical aggregations.',
      characterFocusId: 'maya',
      dialogue: [
        {
          characterId: 'maya',
          speech: 'If I try opening this in a normal office spreadsheet, my computer fan screams and the app crashes. How am I going to analyze 50,000 rows in time?',
          mood: 'worried'
        }
      ],
      visualMetaphor: {
        type: 'data-pile',
        title: '50,000 Scattered Sales Logs',
        description: 'Tangled records across Seattle, Austin, Boston, and Chicago with mixed order values.'
      }
    },
    {
      id: 'scene-2',
      sceneNumber: 2,
      type: 'characters',
      title: 'Meet the Cast',
      subtitle: 'Each player has a distinct job in solving the puzzle.',
      storyText: 'To solve this problem, we need to assemble our team. Maya is our analytical leader. The Raw Data holds the customer transactions. Core Python provides our execution engine. And soon, our Tabular Specialist will step into the spotlight.',
      technicalText: 'Understanding the separation of concerns: The Developer (script author), the Raw Storage (disk I/O), the Python Runtime (interpreter), and the Specialized Library (C-accelerated pandas data structures).',
      dialogue: [
        {
          characterId: 'maya',
          speech: 'I have the questions. We need the right digital tools to handle this volume without breaking a sweat.',
          mood: 'thinking'
        },
        {
          characterId: 'raw-data',
          speech: 'We are ready to be read, but please don\'t read us line-by-line with slow text loops!',
          mood: 'worried'
        }
      ]
    },
    {
      id: 'scene-3',
      sceneNumber: 3,
      type: 'conflict',
      title: 'The Conflict: Why Manual Work Fails',
      subtitle: 'What happens when we try to do this the hard way?',
      storyText: 'Maya considers writing a basic Python loop that opens the file as text and checks each row with an `if` statement. But writing loops for 50,000 rows with string splitting takes 45 lines of brittle code, consumes massive memory, and runs sluggishly.',
      technicalText: 'Pure Python `for` loops on standard text lists suffer from high bytecode interpreter overhead, lack columnar memory locality, and require manual type parsing for numbers, dates, and missing values (NaNs).',
      decision: {
        prompt: 'What should Maya do next?',
        options: [
          {
            id: 'opt-manual',
            label: 'Write 50 lines of manual text loops & string splits',
            isOptimal: false,
            reactionText: 'Maya writes 50 lines of nested loops. It took 3 hours to write, crashed on row 412 due to a missing comma, and ran at a crawl!',
            characterReaction: '😓 Maya: "Ugh! A missing value broke the whole loop halfway through!"'
          },
          {
            id: 'opt-pandas',
            label: 'Summon Pandas — The Tabular Specialist',
            isOptimal: true,
            reactionText: 'Pandas swoops in! With one command, all 50,000 rows are structured into an ultra-fast memory table.',
            characterReaction: '🐼 Pandas: "Step aside! I handle tabular structures in memory with C-speed efficiency!"'
          }
        ]
      },
      dialogue: [
        {
          characterId: 'python-core',
          speech: 'Standard loops over 50,000 elements take too many CPU cycles. Let me hand this over to Pandas.',
          mood: 'explaining'
        }
      ]
    },
    {
      id: 'scene-4',
      sceneNumber: 4,
      type: 'discovery',
      title: 'The Discovery: Enter Pandas',
      subtitle: 'Why was Pandas created in the first place?',
      storyText: 'In 2008, a quantitative financial analyst named Wes McKinney grew tired of struggling with spreadsheets and slow data loops. He created Pandas ("Python Data Analysis") to give Python the fastest, cleanest tabular data structure on earth: the DataFrame.',
      technicalText: 'Pandas is built on top of NumPy (written in C). It represents 2-dimensional tabular data as a `DataFrame`, where columns are typed `Series` stored contiguously in memory for SIMD-accelerated math.',
      characterFocusId: 'pandas',
      dialogue: [
        {
          characterId: 'pandas',
          speech: 'Think of me as a superpower spreadsheet that can hold millions of rows, never crashes, and does math in milliseconds.',
          mood: 'triumphant'
        }
      ]
    },
    {
      id: 'scene-5',
      sceneNumber: 5,
      type: 'solution',
      title: 'The Solution: The 4-Step Master Plan',
      subtitle: 'How Pandas effortlessly turns chaos into clarity.',
      storyText: 'Maya and Pandas establish a clear 4-step rhythm:\n1. Ingest the file using `pd.read_csv()`\n2. Filter Seattle VIPs using boolean conditions\n3. Sort the spenders from highest to lowest\n4. Calculate the average and total with `.mean()` and `.sum()`',
      technicalText: 'The standard Pandas ETL pipeline: Ingestion (I/O) -> Boolean Indexing (Slicing) -> Index Sorting (Transform) -> Statistical Reduction (Aggregation).',
      dialogue: [
        {
          characterId: 'maya',
          speech: 'Wait, so all my questions can be answered in just 5 lines of code instead of 100?',
          mood: 'excited'
        },
        {
          characterId: 'pandas',
          speech: 'Exactly! Let me show you the technical translation so you know how every piece connects.',
          mood: 'explaining'
        }
      ]
    },
    {
      id: 'scene-6',
      sceneNumber: 6,
      type: 'translation',
      title: 'Technical Translation Layer',
      subtitle: 'Mapping real-world story roles to actual Python concepts.',
      storyText: 'Every character and action in our story corresponds directly to an architectural building block in Python programming.',
      technicalText: 'Compare the intuitive Story mental model against the precise Technical programming concepts below. Use the toggle to switch perspectives anytime.',
      highlightCodeLines: [1, 4, 7, 10, 13]
    },
    {
      id: 'scene-7',
      sceneNumber: 7,
      type: 'code',
      title: 'The Python Code Connection',
      subtitle: 'Watch how each story action translates into Python syntax.',
      storyText: 'Click on any character action below to highlight the exact Python line that brings it to life!',
      technicalText: 'Inspect the code structure. Each line operates directly on DataFrame memory objects.',
      highlightCodeLines: [1, 4, 7, 10, 13, 14]
    },
    {
      id: 'scene-8',
      sceneNumber: 8,
      type: 'interactive',
      title: 'Interactive Demonstration',
      subtitle: 'Test the live DataFrame sandbox and see instant query results!',
      storyText: 'Adjust the controls below to change the minimum purchase threshold, filter cities, or sort records. Notice how the Python code and the live DataFrame update dynamically in real time!',
      technicalText: 'Execute real-time client-side Pandas-equivalent DataFrame operations including vector filtering, multi-column sorting, and column aggregations.',
      highlightCodeLines: [7, 10, 13]
    },
    {
      id: 'scene-9',
      sceneNumber: 9,
      type: 'result',
      title: 'The Grand Result',
      subtitle: 'Insights generated in 0.02 seconds.',
      storyText: 'Maya walks into the executive conference room at 10:45 AM, 15 minutes before the deadline. She delivers the exact VIP customer roster for Seattle and reveals that the average VIP order value is $384.50, generating over $2.4M in regional revenue. The CEO is stunned by the speed and precision.',
      technicalText: 'Pandas processed 50,000 records in 18ms, producing zero type-casting errors and outputting formatted statistical summaries with precision.',
      characterFocusId: 'maya',
      dialogue: [
        {
          characterId: 'maya',
          speech: 'The report is ready, accurate, and completely automated. Next month, I just run the script again with one click!',
          mood: 'triumphant'
        },
        {
          characterId: 'pandas',
          speech: 'That is the power of understanding WHY tools exist before writing a single line.',
          mood: 'excited'
        }
      ]
    },
    {
      id: 'scene-10',
      sceneNumber: 10,
      type: 'recap',
      title: 'Lesson Recap',
      subtitle: 'Lock in the mental model for your coding journey.',
      storyText: 'Let\'s review what you discovered: from messy disk records to high-speed DataFrame queries.',
      technicalText: 'Key syntax and mental models to carry forward into your Python projects.'
    },
    {
      id: 'scene-11',
      sceneNumber: 11,
      type: 'challenge',
      title: 'Mini Challenge: Test Your Intuition',
      subtitle: 'Apply your understanding to a new real-world scenario.',
      storyText: 'Put on your analyst hat and help Maya decide the best tool for the job!',
      technicalText: 'Evaluate architectural tool selection based on dataset properties and access patterns.'
    }
  ],

  interactiveSimulator: {
    title: 'Metro Mart Customer DataFrame Simulator',
    description: 'Experiment with interactive filters to see how Pandas manipulates tabular data in memory.',
    sampleDatasetName: 'metro_customers.csv (50,000 sample rows)',
    columns: [
      { key: 'id', label: 'ID', type: 'number' },
      { key: 'customer_name', label: 'Customer', type: 'string' },
      { key: 'city', label: 'City', type: 'badge' },
      { key: 'purchase_amount', label: 'Amount', type: 'currency' },
      { key: 'items_count', label: 'Items', type: 'number' },
      { key: 'membership_tier', label: 'Tier', type: 'badge' }
    ],
    initialData: [
      { id: 101, customer_name: 'Sarah Chen', city: 'Seattle', purchase_amount: 482.50, items_count: 6, membership_tier: 'Platinum' },
      { id: 102, customer_name: 'Marcus Vance', city: 'Seattle', purchase_amount: 145.00, items_count: 2, membership_tier: 'Gold' },
      { id: 103, customer_name: 'Elena Rostova', city: 'Austin', purchase_amount: 520.00, items_count: 8, membership_tier: 'Platinum' },
      { id: 104, customer_name: 'David Kim', city: 'Seattle', purchase_amount: 89.90, items_count: 1, membership_tier: 'Silver' },
      { id: 105, customer_name: 'Amina Yusuf', city: 'Boston', purchase_amount: 310.25, items_count: 4, membership_tier: 'Gold' },
      { id: 106, customer_name: 'Liam Gallagher', city: 'Seattle', purchase_amount: 620.00, items_count: 9, membership_tier: 'Diamond' },
      { id: 107, customer_name: 'Chloe Dubois', city: 'Chicago', purchase_amount: 75.00, items_count: 1, membership_tier: 'Bronze' },
      { id: 108, customer_name: 'Oliver Queen', city: 'Seattle', purchase_amount: 290.00, items_count: 3, membership_tier: 'Gold' },
      { id: 109, customer_name: 'Zoe Washington', city: 'Austin', purchase_amount: 195.50, items_count: 3, membership_tier: 'Silver' },
      { id: 110, customer_name: 'Lucas Silva', city: 'Seattle', purchase_amount: 340.00, items_count: 5, membership_tier: 'Platinum' }
    ],
    controls: [
      {
        id: 'cityFilter',
        label: 'Filter by City',
        type: 'select',
        defaultValue: 'Seattle',
        options: [
          { label: 'All Cities', value: 'All' },
          { label: 'Seattle', value: 'Seattle' },
          { label: 'Austin', value: 'Austin' },
          { label: 'Boston', value: 'Boston' },
          { label: 'Chicago', value: 'Chicago' }
        ]
      },
      {
        id: 'minAmount',
        label: 'Minimum Purchase ($)',
        type: 'slider',
        min: 0,
        max: 500,
        step: 25,
        defaultValue: 100
      },
      {
        id: 'sortBy',
        label: 'Sort By',
        type: 'select',
        defaultValue: 'purchase_amount_desc',
        options: [
          { label: 'Amount (Highest First)', value: 'purchase_amount_desc' },
          { label: 'Amount (Lowest First)', value: 'purchase_amount_asc' },
          { label: 'Items Count (Most First)', value: 'items_count_desc' },
          { label: 'Customer Name (A-Z)', value: 'customer_name_asc' }
        ]
      }
    ],
    pythonCodeTemplate: (params) => {
      const cityFilterStr = params.cityFilter === 'All' 
        ? '' 
        : `(df['city'] == '${params.cityFilter}')`;
      const amountFilterStr = `(df['purchase_amount'] >= ${params.minAmount})`;
      const combinedFilter = cityFilterStr ? `${cityFilterStr} & ${amountFilterStr}` : amountFilterStr;

      const isAsc = params.sortBy.endsWith('_asc');
      const sortCol = params.sortBy.replace('_asc', '').replace('_desc', '');

      return `import pandas as pd

# Load dataset
df = pd.read_csv('metro_customers.csv')

# 1. Apply boolean filter
filtered_df = df[${combinedFilter}]

# 2. Sort results
result_df = filtered_df.sort_values(by='${sortCol}', ascending=${isAsc ? 'True' : 'False'})

# 3. Calculate summary metrics
avg_order = result_df['purchase_amount'].mean()
total_spend = result_df['purchase_amount'].sum()
print(f"Matched {len(result_df)} records | Avg: \${avg_order:.2f} | Total: \${total_spend:,.2f}")`;
    },
    simulationLogic: (params, rawData) => {
      let filtered = [...rawData];

      // City filter
      if (params.cityFilter && params.cityFilter !== 'All') {
        filtered = filtered.filter(row => row.city === params.cityFilter);
      }

      // Min amount filter
      if (typeof params.minAmount === 'number') {
        filtered = filtered.filter(row => row.purchase_amount >= params.minAmount);
      }

      // Sort
      const [col, dir] = (params.sortBy || 'purchase_amount_desc').split('_');
      filtered.sort((a, b) => {
        const valA = a[col];
        const valB = b[col];
        if (typeof valA === 'string') {
          return dir === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
        }
        return dir === 'asc' ? valA - valB : valB - valA;
      });

      const totalRevenue = filtered.reduce((acc, row) => acc + row.purchase_amount, 0);
      const avgPurchase = filtered.length > 0 ? (totalRevenue / filtered.length) : 0;
      const totalItems = filtered.reduce((acc, row) => acc + row.items_count, 0);

      return {
        filteredData: filtered,
        computedStats: [
          { label: 'Active VIPs', value: filtered.length, change: `${Math.round((filtered.length / rawData.length) * 100)}% of total` },
          { label: 'Average Order', value: `$${avgPurchase.toFixed(2)}` },
          { label: 'Total Volume', value: `$${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` },
          { label: 'Items Moved', value: totalItems }
        ],
        executionTimeMs: 0.018,
        logMessages: [
          `[Pandas Kernel] Ingested 50,000 records from metro_customers.csv into memory`,
          `[Filter Engine] Vectorized mask evaluated in 0.006ms -> ${filtered.length} matching rows`,
          `[Sort Engine] Mergesort by '${col}' completed in 0.004ms`,
          `[Aggregator] Mean & Sum computed across Series '${col}'`
        ]
      };
    }
  },

  challenge: {
    question: 'The analyst now receives another dataset: 200,000 warehouse shipments across 12 countries. She needs to calculate the average shipping delay per country and find the slowest 5 routes. Which approach should she use?',
    scenarioContext: 'Scenario: 200,000 rows with columns [origin_country, dest_country, delay_minutes, cost].',
    options: [
      {
        id: 'opt-a',
        text: 'Export each country to a separate Excel spreadsheet and use a manual calculator.',
        isCorrect: false,
        explanation: 'Creating 12 separate spreadsheets and manually calculating numbers is slow, prone to copy-paste errors, and will crash when datasets grow.'
      },
      {
        id: 'opt-b',
        text: 'Load the data into a Pandas DataFrame, use .groupby(\'dest_country\')[\'delay_minutes\'].mean(), and sort the values.',
        isCorrect: true,
        explanation: 'Exactly! Pandas is built specifically for this. The data is structured in rows and columns, making a DataFrame with .groupby() the most natural, readable, and lightning-fast solution.'
      },
      {
        id: 'opt-c',
        text: 'Write 12 nested while-loops in pure Python and append strings into text files.',
        isCorrect: false,
        explanation: 'Nested while-loops in pure Python are much slower than Pandas C-vectorized routines and require dozens of lines of repetitive boilerplate code.'
      },
      {
        id: 'opt-d',
        text: 'Print all 200,000 rows directly into the terminal screen and read them visually.',
        isCorrect: false,
        explanation: 'Printing 200,000 rows into the terminal will flood the console and is humanly impossible to analyze.'
      }
    ],
    conceptualTakeaway: 'Whenever data has rows and columns, Pandas DataFrames turn hours of manual crunching into clean, instantaneous one-line operations.'
  },

  recapSummary: {
    problem: '50,000 messy customer records scattered across files, too large for manual spreadsheets.',
    concept: 'Pandas & DataFrames (2D high-performance structured memory tables).',
    whyNeeded: 'Pure Python loops are slow for large tabular data; Pandas uses C-accelerated vectorized operations.',
    howItWorks: 'Loads CSVs into memory columns (Series), filters rows via boolean masks, and computes stats without manual loops.',
    keySyntax: "df = pd.read_csv('file.csv')\nvips = df[(df['city'] == 'Seattle') & (df['amount'] > 100)]\navg = vips['amount'].mean()",
    keyResult: 'Extracted Seattle VIP spenders and average revenue in 0.02 seconds with 5 lines of code.'
  }
};

export const LOOPS_LESSON: Lesson = {
  id: 'loops-busy-bee',
  slug: 'loops-busy-bee',
  title: 'The Busy Bee & The Flower Fields',
  tagline: 'Why write 1,000 repetitive lines when a single loop can visit every flower in the meadow?',
  topic: 'For Loops & Iteration',
  category: 'Python Basics',
  difficulty: 'Beginner',
  estimatedMinutes: 6,
  icon: 'Repeat',
  
  jobRole: {
    title: 'Automation Engineer',
    industry: 'DevOps & Process Automation',
    realWorldUse: 'Automates repetitive tasks over lists of files, server logs, or user emails.',
    typicalDailyTasks: [
      'Processing thousands of user email notifications',
      'Batch renaming and resizing product images',
      'Scanning server log lines for error codes'
    ]
  },

  realWorldProblem: {
    headline: 'Barnaby the Bee & 10,000 Meadow Flowers',
    description: 'Barnaby is a worker bee tasked with collecting nectar from thousands of blossoming flowers in Sunny Meadow. If Barnaby had to write a separate instruction for every single flower (flower_1, flower_2, flower_3...), he would write code for 10 years before gathering a single drop of honey!',
    scaleMetric: '10,000 flowers in the meadow needing sequential visits',
    failureOfManualWork: 'Copy-pasting identical instructions 10,000 times bloats code, causes typos, and cannot handle meadows with varying flower counts.'
  },

  characters: [
    {
      id: 'barnaby',
      name: 'Barnaby',
      role: 'Worker Bee',
      represents: 'The Loop Variable / Iterator',
      whatTheyNeedToAccomplish: 'Visit each flower one-by-one in sequential order without skipping any.',
      avatarEmoji: '🐝',
      badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
      quote: 'Just point me to the flower patch! I will land on every bloom, take the nectar, and move to the next.'
    },
    {
      id: 'meadow',
      name: 'The Meadow',
      role: 'The Flower Collection',
      represents: 'Iterable Data Structure (List / Range)',
      whatTheyNeedToAccomplish: 'Hold the items waiting to be visited in sequence.',
      avatarEmoji: '🌸',
      badgeColor: 'bg-pink-50 text-pink-700 border-pink-200',
      quote: 'We are a list of colorful flowers: [Sunflower, Rose, Daisy, Lavender, Tulip].'
    },
    {
      id: 'honeypot',
      name: 'The Honey Pot',
      role: 'Storage Container',
      represents: 'Accumulator Variable',
      whatTheyNeedToAccomplish: 'Accumulate the collected nectar after each visit.',
      avatarEmoji: '🍯',
      badgeColor: 'bg-orange-50 text-orange-700 border-orange-200',
      quote: 'My level rises by 10ml with every flower Barnaby pollinates!'
    }
  ],

  technicalTranslations: [
    {
      storyCharacter: 'Barnaby (The Worker)',
      technicalConcept: 'Loop Variable (`item` in `for item in list:`)',
      storyExplanation: 'The worker holding the current item being processed on this turn.',
      technicalExplanation: 'A reference variable bound to each sequential element of the iterable during each cycle.',
      codeSnippet: 'for flower in flowers:'
    },
    {
      storyCharacter: 'The Meadow Collection',
      technicalConcept: 'Iterable Sequence (List, Tuple, Range)',
      storyExplanation: 'The orderly line of items waiting to be inspected.',
      technicalExplanation: 'Any object implementing the Python `__iter__()` protocol.',
      codeSnippet: "flowers = ['Sunflower', 'Rose', 'Daisy', 'Lavender']"
    },
    {
      storyCharacter: 'Collecting Nectar',
      technicalConcept: 'Loop Body / Repeated Statement Block',
      storyExplanation: 'The work performed on every single item during its turn.',
      technicalExplanation: 'The indented code block executed once per iteration.',
      codeSnippet: 'honey_pot += 10'
    }
  ],

  fullPythonCode: `flowers = ['Sunflower', 'Rose', 'Daisy', 'Lavender', 'Tulip']
honey_pot = 0

print("🐝 Barnaby begins his morning flight...")

# The For Loop visits each flower one by one
for flower in flowers:
    nectar_amount = 10
    honey_pot += nectar_amount
    print(f"Visited {flower} -> Gathered {nectar_amount}ml! (Total: {honey_pot}ml)")

print(f"🎉 All {len(flowers)} flowers visited! Total Honey: {honey_pot}ml")
`,

  storyToCodeMappings: [
    {
      id: 'map-bee-1',
      storyAction: 'The meadow is prepared with a list of flowers',
      programmingConcept: 'List Definition',
      codeSnippet: "flowers = ['Sunflower', 'Rose', 'Daisy', 'Lavender', 'Tulip']",
      highlightLineNumbers: [1],
      storyNote: 'Defines the sequence of items waiting to be visited.',
      technicalNote: 'Allocates a Python list of strings in memory.'
    },
    {
      id: 'map-bee-2',
      storyAction: 'Barnaby flies from flower to flower sequentially',
      programmingConcept: 'For Loop Header',
      codeSnippet: 'for flower in flowers:',
      highlightLineNumbers: [6],
      storyNote: 'The bee automatically picks up the first flower, does the work, then advances.',
      technicalNote: 'Calls iter() and next() under the hood until StopIteration is raised.'
    },
    {
      id: 'map-bee-3',
      storyAction: 'Adding nectar to the honey pot',
      programmingConcept: 'Accumulator Addition (+=)',
      codeSnippet: 'honey_pot += nectar_amount',
      highlightLineNumbers: [8],
      storyNote: 'Increments the stored honey count with each completed visit.',
      technicalNote: 'Modifies the integer variable state inside the loop scope.'
    }
  ],

  scenes: [
    {
      id: 'bee-scene-1',
      sceneNumber: 1,
      type: 'problem',
      title: 'The Infinite Flower Field',
      subtitle: 'Barnaby has 10,000 flowers to visit before sunset.',
      storyText: 'The Queen Bee tells Barnaby: "We need nectar from every single blossom in Sunny Meadow." Barnaby looks at the vast colorful fields stretching to the horizon. "If I have to manually write a command for each flower, I will die of old age before I finish!"',
      technicalText: 'Real-world software constantly needs to process lists of items (orders, files, rows, pixels) without hardcoding repetitive lines for each element.',
      characterFocusId: 'barnaby',
      dialogue: [
        {
          characterId: 'barnaby',
          speech: 'I need an automated routine that handles any number of flowers automatically!',
          mood: 'worried'
        }
      ]
    },
    {
      id: 'bee-scene-2',
      sceneNumber: 2,
      type: 'characters',
      title: 'Meet the Meadow Team',
      subtitle: 'The Worker, The Meadow Collection, and The Honey Pot.',
      storyText: 'Barnaby is the worker bee (the loop variable). The meadow is the list of flowers (the iterable). The honey pot is where we store our total progress (the accumulator).',
      technicalText: 'An iteration loop consists of: an Iterable source, a dynamic Iterator variable, and an Accumulator state.',
      dialogue: [
        {
          characterId: 'barnaby',
          speech: 'Give me an iterable list, and I will handle the repetitions smoothly!',
          mood: 'excited'
        }
      ]
    },
    {
      id: 'bee-scene-3',
      sceneNumber: 3,
      type: 'conflict',
      title: 'The Conflict: The Copy-Paste Nightmare',
      subtitle: 'Why copy-pasting code leads to catastrophic bugs.',
      storyText: 'Imagine writing `pollinate(flower_1)`, `pollinate(flower_2)`, `pollinate(flower_3)`... What if tomorrow the meadow has 20,000 flowers? What if a flower is missing? Copy-pasted code cannot adapt!',
      technicalText: 'Hardcoded repetitive statements violate the DRY (Don\'t Repeat Yourself) principle, lead to maintenance nightmares, and cannot handle dynamic runtime data sizes.',
      decision: {
        prompt: 'How should Barnaby gather the nectar?',
        options: [
          {
            id: 'bee-opt-copy',
            label: 'Copy and paste "pollinate()" 10,000 times in the script',
            isOptimal: false,
            reactionText: 'The code file becomes 10,000 lines long! A typo on line 4,321 caused an error, and the app froze.',
            characterReaction: '🐝 Barnaby: "My wings hurt from typing all those identical lines!"'
          },
          {
            id: 'bee-opt-loop',
            label: 'Use a Python "for" loop in 2 clean lines',
            isOptimal: true,
            reactionText: 'Barnaby glides effortlessly across the flowers in a 2-line loop!',
            characterReaction: '🍯 Honey Pot: "Filling up at lightning speed!"'
          }
        ]
      }
    },
    {
      id: 'bee-scene-4',
      sceneNumber: 4,
      type: 'discovery',
      title: 'The Discovery: The For Loop',
      subtitle: 'How Python handles sequential traversal.',
      storyText: 'Python provides the `for ... in ...` syntax. You tell Python: "For each item in this collection, do these steps." Python automatically tracks where it is, stops when the list ends, and never misses a single item.',
      technicalText: 'The `for` loop is Python\'s iterator pattern. It extracts the next element using the iterator protocol until `StopIteration` is encountered.',
      characterFocusId: 'barnaby',
      dialogue: [
        {
          characterId: 'barnaby',
          speech: 'It doesn\'t matter if there are 5 flowers or 5 million — the exact same 2 lines of code work every time!',
          mood: 'triumphant'
        }
      ]
    },
    {
      id: 'bee-scene-5',
      sceneNumber: 5,
      type: 'solution',
      title: 'The Solution: Clean Iteration',
      subtitle: 'The 3 golden rules of Python loops.',
      storyText: '1. Give your list a plural name (e.g. `flowers`)\n2. Give your loop variable a singular name (e.g. `flower`)\n3. Indent the work you want repeated under the colon (`:`)',
      technicalText: 'Syntactic structure: `for <variable> in <iterable>:` followed by a PEP-8 compliant 4-space indented block.'
    },
    {
      id: 'bee-scene-6',
      sceneNumber: 6,
      type: 'translation',
      title: 'Technical Translation Layer',
      subtitle: 'Translating the bee\'s flight into Python iteration syntax.',
      storyText: 'Barnaby visiting a flower is the exact equivalent of the loop assigning the current element to the variable.',
      technicalText: 'Switch between Story Mode and Technical Mode to inspect the iterator protocol mechanics.',
      highlightCodeLines: [1, 6, 8]
    },
    {
      id: 'bee-scene-7',
      sceneNumber: 7,
      type: 'code',
      title: 'The Code Connection',
      subtitle: 'Interactive line mapping of loop mechanics.',
      storyText: 'Click the actions to see how the loop begins, iterates, and accumulates.',
      technicalText: 'Direct mapping of iterator declaration and accumulator assignment.',
      highlightCodeLines: [1, 2, 6, 7, 8, 9, 11]
    },
    {
      id: 'bee-scene-8',
      sceneNumber: 8,
      type: 'interactive',
      title: 'Interactive Loop Simulator',
      subtitle: 'Add flowers to the meadow and step through the loop in real time!',
      storyText: 'Use the controls to adjust flower count, nectar yield, or add a special filter condition.',
      technicalText: 'Interactive visualization of loop pointers, accumulator states, and iteration steps.',
      highlightCodeLines: [6, 8]
    },
    {
      id: 'bee-scene-9',
      sceneNumber: 9,
      type: 'result',
      title: 'The Sweet Reward',
      subtitle: 'All nectar gathered with 0 bugs.',
      storyText: 'Barnaby fills the honeycomb storage to the brim before sunset. The hive celebrates with a feast, and Barnaby\'s loop code is saved in the Hive Library for all future worker bees.',
      technicalText: 'Completed iteration over collection in O(N) linear time with minimal memory overhead.',
      characterFocusId: 'honeypot',
      dialogue: [
        {
          characterId: 'barnaby',
          speech: '500 flowers visited without breaking a sweat! Loops are a programmer\'s best friend.',
          mood: 'triumphant'
        }
      ]
    },
    {
      id: 'bee-scene-10',
      sceneNumber: 10,
      type: 'recap',
      title: 'Lesson Recap',
      subtitle: 'Key takeaways from the Meadow.',
      storyText: 'Remember: Plural collection, singular loop variable, indented work.',
      technicalText: 'Review loop syntax, accumulator patterns, and iteration efficiency.'
    },
    {
      id: 'bee-scene-11',
      sceneNumber: 11,
      type: 'challenge',
      title: 'Mini Challenge',
      subtitle: 'Test your loop mastery.',
      storyText: 'Help Barnaby calculate total pollen from a list of numbers!',
      technicalText: 'Verify understanding of loop variables and accumulator accumulation.'
    }
  ],

  interactiveSimulator: {
    title: 'Meadow Flight & Loop Accumulator Simulator',
    description: 'Watch Barnaby step through each flower in real time as the honey pot fills up.',
    sampleDatasetName: 'meadow_flowers_list',
    columns: [
      { key: 'id', label: 'Index', type: 'number' },
      { key: 'flower_name', label: 'Flower', type: 'string' },
      { key: 'color', label: 'Color', type: 'badge' },
      { key: 'nectar_ml', label: 'Nectar (ml)', type: 'number' },
      { key: 'visited', label: 'Status', type: 'badge' }
    ],
    initialData: [
      { id: 0, flower_name: 'Sunflower', color: 'Yellow', nectar_ml: 15, visited: 'Pending' },
      { id: 1, flower_name: 'Wild Rose', color: 'Pink', nectar_ml: 20, visited: 'Pending' },
      { id: 2, flower_name: 'Meadow Daisy', color: 'White', nectar_ml: 10, visited: 'Pending' },
      { id: 3, flower_name: 'Lavender', color: 'Purple', nectar_ml: 25, visited: 'Pending' },
      { id: 4, flower_name: 'Mountain Tulip', color: 'Red', nectar_ml: 15, visited: 'Pending' },
      { id: 5, flower_name: 'Golden Orchid', color: 'Yellow', nectar_ml: 30, visited: 'Pending' }
    ],
    controls: [
      {
        id: 'nectarMultiplier',
        label: 'Nectar Boost per Flower (ml)',
        type: 'slider',
        min: 5,
        max: 50,
        step: 5,
        defaultValue: 15
      },
      {
        id: 'filterColor',
        label: 'Only Visit Color',
        type: 'select',
        defaultValue: 'All',
        options: [
          { label: 'All Flowers', value: 'All' },
          { label: 'Yellow Only', value: 'Yellow' },
          { label: 'Pink / Red Only', value: 'Pink' },
          { label: 'Purple Only', value: 'Purple' }
        ]
      }
    ],
    pythonCodeTemplate: (params) => {
      const filterClause = params.filterColor !== 'All' 
        ? `\n    if flower['color'] == '${params.filterColor}':\n        honey_pot += ${params.nectarMultiplier}\n        print(f"Pollinated {flower['name']}!")`
        : `\n    honey_pot += ${params.nectarMultiplier}\n    print(f"Pollinated {flower['name']} (+${params.nectarMultiplier}ml)")`;

      return `flowers = get_meadow_flowers()
honey_pot = 0

# Barnaby's loop
for flower in flowers:${filterClause}

print(f"Total Honey Gathered: {honey_pot}ml")`;
    },
    simulationLogic: (params, rawData) => {
      const boost = params.nectarMultiplier || 15;
      const matching = rawData.map(f => {
        const isMatch = params.filterColor === 'All' || f.color === params.filterColor;
        return {
          ...f,
          nectar_ml: isMatch ? boost : 0,
          visited: isMatch ? 'Polinated 🐝' : 'Skipped ⏭️'
        };
      });

      const totalHoney = matching.reduce((acc, f) => acc + f.nectar_ml, 0);
      const visitedCount = matching.filter(f => f.visited.includes('Polinated')).length;

      return {
        filteredData: matching,
        computedStats: [
          { label: 'Flowers Visited', value: `${visitedCount} / ${rawData.length}` },
          { label: 'Total Honey Pot', value: `${totalHoney} ml` },
          { label: 'Avg Nectar / Flower', value: visitedCount > 0 ? `${(totalHoney / visitedCount).toFixed(1)} ml` : '0 ml' },
          { label: 'Time Saved vs Manual', value: '99.4%' }
        ],
        executionTimeMs: 0.002,
        logMessages: [
          `[Loop Initialized] Target iterable has ${rawData.length} elements`,
          `[Iteration] Processed ${visitedCount} elements matching criteria`,
          `[Accumulator] State updated: honey_pot = ${totalHoney}ml`
        ]
      };
    }
  },

  challenge: {
    question: 'You have a list of prices: `prices = [10, 25, 40, 15]`. Which code snippet correctly calculates the total cost using a loop?',
    scenarioContext: 'Scenario: Adding up all prices in the list into a variable named total.',
    options: [
      {
        id: 'opt-loop-1',
        text: 'total = 0\nfor p in prices:\n    total += p',
        isCorrect: true,
        explanation: 'Exactly right! We initialize total = 0 outside the loop, visit each price `p` one by one, and add it to `total`.'
      },
      {
        id: 'opt-loop-2',
        text: 'for p in prices:\n    total = 0\n    total += p',
        isCorrect: false,
        explanation: 'Incorrect! If you set `total = 0` inside the loop body, it resets to zero on every iteration and will only keep the very last price.'
      },
      {
        id: 'opt-loop-3',
        text: 'total = prices[0] + prices[1] + prices[2] + prices[3]',
        isCorrect: false,
        explanation: 'While this works for exactly 4 items, it crashes if the list has 3 items (IndexError) and ignores extra items if the list has 5 items. Loops handle any list length automatically!'
      }
    ],
    conceptualTakeaway: 'Always initialize your accumulator variable before the loop starts so its value builds up across each iteration.'
  },

  recapSummary: {
    problem: '10,000 repetitive tasks that would require thousands of copy-pasted lines.',
    concept: 'For Loops & Iterables (`for item in collection:`).',
    whyNeeded: 'Automates sequential processing over dynamic collections of any length.',
    howItWorks: 'Assigns each element to a loop variable and executes the indented block once per element.',
    keySyntax: "for item in items:\n    process(item)",
    keyResult: 'Traversed the entire meadow in 2 lines of clean, reusable code.'
  }
};

export const DICTIONARY_LESSON: Lesson = {
  id: 'dicts-warehouse-keeper',
  slug: 'dicts-warehouse-keeper',
  title: 'The Magical Warehouse Vault',
  tagline: 'Why search 100,000 boxes one by one when a Key-Value tag finds anything in O(1) instant time?',
  topic: 'Dictionaries & Hash Maps',
  category: 'Python Basics',
  difficulty: 'Beginner',
  estimatedMinutes: 7,
  icon: 'BookOpen',
  
  jobRole: {
    title: 'Backend Developer',
    industry: 'High-Scale Cloud Systems',
    realWorldUse: 'Uses hash maps and dictionaries for fast O(1) user profile and cache lookups.',
    typicalDailyTasks: [
      'Looking up user sessions by token',
      'Configuring app settings and environment key-value pairs',
      'Counting frequency of words or tags in text'
    ]
  },

  realWorldProblem: {
    headline: 'Finding Order #84920 in 100,000 Storage Crates',
    description: 'Winston is the chief keeper at Global Logistics Vault. A VIP customer calls demanding: "Where is parcel #84920?" The warehouse has 100,000 unindexed boxes on shelves. If Winston has to walk down every aisle checking boxes one-by-one from box #1 to box #84,920, the search takes 4 hours (O(N) linear time).',
    scaleMetric: '100,000 storage boxes searched hundreds of times per day',
    failureOfManualWork: 'Linear list searching takes O(N) time. As the warehouse doubles in size, search times double.'
  },

  characters: [
    {
      id: 'winston',
      name: 'Winston',
      role: 'Warehouse Keeper',
      represents: 'The Lookup Engine / Programmer',
      whatTheyNeedToAccomplish: 'Retrieve parcel details instantly without searching all shelves.',
      avatarEmoji: '🧙‍♂️',
      badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      quote: 'I need a magical ledger where every parcel ID points straight to its exact shelf location!'
    },
    {
      id: 'dict-ledger',
      name: 'The Fast Ledger',
      role: 'Python Dictionary',
      represents: 'Key-Value Hash Map ({key: value})',
      whatTheyNeedToAccomplish: 'Map unique keys (Parcel IDs) to values (Parcel Details) for instant O(1) lookup.',
      avatarEmoji: '📖',
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      quote: 'Give me a key like "order_84920" and I will open that exact vault door in 0.0001 seconds.'
    }
  ],

  technicalTranslations: [
    {
      storyCharacter: 'The Parcel ID Tag',
      technicalConcept: 'Dictionary Key',
      storyExplanation: 'The unique barcode or name used to identify the item.',
      technicalExplanation: 'An immutable, hashable object (string, int, tuple) passed to a hash function.',
      codeSnippet: "key = 'order_84920'"
    },
    {
      storyCharacter: 'The Parcel Contents',
      technicalConcept: 'Dictionary Value',
      storyExplanation: 'The actual package or data associated with the tag.',
      technicalExplanation: 'Any Python object stored at the memory bucket mapped by the key.',
      codeSnippet: "value = {'item': 'Laptop', 'status': 'Delivered'}"
    },
    {
      storyCharacter: 'The Magic Ledger',
      technicalConcept: 'Dictionary Structure `{}`',
      storyExplanation: 'The ledger holding all key-value connections.',
      technicalExplanation: 'A dynamically resizing hash table with O(1) average lookup, insertion, and deletion.',
      codeSnippet: "vault = {'order_84920': 'Shelf 4B', 'order_84921': 'Shelf 9A'}"
    }
  ],

  fullPythonCode: `# Creating Winston's Fast Dictionary
vault = {
    'order_84920': {'customer': 'Alice', 'item': 'Quantum Laptop', 'shelf': 'Aisle 4B'},
    'order_84921': {'customer': 'Bob', 'item': 'Noise-Cancel Headphones', 'shelf': 'Aisle 2A'},
    'order_84922': {'customer': 'Charlie', 'item': 'Mechanical Keyboard', 'shelf': 'Aisle 9C'}
}

# Instant O(1) lookup using key
parcel_id = 'order_84920'
if parcel_id in vault:
    info = vault[parcel_id]
    print(f"✨ Found {parcel_id} in 0.0001s! Stored at: {info['shelf']}")
`,

  storyToCodeMappings: [
    {
      id: 'dict-map-1',
      storyAction: 'Building the ledger with keys and values',
      programmingConcept: 'Dictionary Initialization',
      codeSnippet: "vault = {'order_84920': {'customer': 'Alice', 'shelf': 'Aisle 4B'}}",
      highlightLineNumbers: [2, 3, 4, 5],
      storyNote: 'Connects unique parcel barcodes to their shelf locations.',
      technicalNote: 'Populates a hash table with key-value entries.'
    },
    {
      id: 'dict-map-2',
      storyAction: 'Looking up a parcel instantly by its key',
      programmingConcept: 'Key Indexing & .get()',
      codeSnippet: "info = vault['order_84920']",
      highlightLineNumbers: [10],
      storyNote: 'Opens the exact shelf door without looking at any other shelves.',
      technicalNote: 'Hashes the key to compute direct memory bucket offset in O(1) time.'
    }
  ],

  scenes: [
    {
      id: 'dict-scene-1',
      sceneNumber: 1,
      type: 'problem',
      title: 'The Needle in 100,000 Haystacks',
      subtitle: 'Winston faces endless aisles of unindexed boxes.',
      storyText: 'A frantic delivery driver arrives: "I need order #84920 right now!" Winston looks at 10 miles of shelves containing 100,000 boxes. If he uses a plain list and checks each box one by one, he will walk 15 miles and take 4 hours.',
      technicalText: 'Searching an unsorted list with `in` or `for` takes O(N) linear time. When N = 100,000, worst-case comparisons reach 100,000 operations.',
      characterFocusId: 'winston',
      dialogue: [
        {
          characterId: 'winston',
          speech: 'If I search shelf by shelf, the delivery truck will leave without the package!',
          mood: 'worried'
        }
      ]
    },
    {
      id: 'dict-scene-2',
      sceneNumber: 2,
      type: 'characters',
      title: 'Meet the Fast Ledger',
      subtitle: 'How Hash Maps solve the search bottleneck forever.',
      storyText: 'Instead of searching shelves, Winston opens the Magic Ledger (a Python Dictionary). In this ledger, every parcel barcode (Key) is permanently linked to its exact shelf location (Value).',
      technicalText: 'Python dictionaries use hash tables to turn any key into a memory address directly.',
      dialogue: [
        {
          characterId: 'dict-ledger',
          speech: 'Don\'t walk the aisles! Tell me the key, and I will jump directly to the answer.',
          mood: 'triumphant'
        }
      ]
    },
    {
      id: 'dict-scene-3',
      sceneNumber: 3,
      type: 'conflict',
      title: 'The Conflict: List vs Dictionary',
      subtitle: 'Comparing O(N) linear search against O(1) direct access.',
      storyText: 'In a list, to find an item you must check index 0, index 1, index 2... all the way to index 99,999. In a dictionary, Python runs a mathematical hash function on the key and jumps directly to the location in 1 single step.',
      technicalText: 'Computational complexity comparison: List lookup by value is O(N). Dictionary lookup by key is O(1) constant time.',
      decision: {
        prompt: 'How should Winston locate parcel #84920?',
        options: [
          {
            id: 'dict-opt-list',
            label: 'Walk down every aisle checking all 100,000 boxes',
            isOptimal: false,
            reactionText: 'Winston walked 12 miles and took 3.5 hours. The delivery driver fell asleep waiting!',
            characterReaction: '🧙‍♂️ Winston: "My legs are exhausted and the customer is furious!"'
          },
          {
            id: 'dict-opt-dict',
            label: 'Query the Python Dictionary: vault["order_84920"]',
            isOptimal: true,
            reactionText: 'Instant hit! The ledger pinpointed Aisle 4B in 0.0001 seconds.',
            characterReaction: '📖 Fast Ledger: "Parcel found instantly at Aisle 4B!"'
          }
        ]
      }
    },
    {
      id: 'dict-scene-4',
      sceneNumber: 4,
      type: 'discovery',
      title: 'The Discovery: Key-Value Pairs',
      subtitle: 'The fundamental syntax `{key: value}`.',
      storyText: 'Dictionaries use curly braces `{}`. Each entry is written as `key: value`, separated by commas. Keys must be unique, just like parcel barcodes.',
      technicalText: 'Dictionary syntax: `d = {k1: v1, k2: v2}`. Keys must be immutable (hashable), while values can be any type.',
      highlightCodeLines: [2, 3, 4, 5]
    },
    {
      id: 'dict-scene-5',
      sceneNumber: 5,
      type: 'solution',
      title: 'The Solution: Fast Lookups & Safe Access',
      subtitle: 'Using `vault[key]` and `vault.get(key, default)`.',
      storyText: 'Winston learns two ways to retrieve items:\n1. Direct access: `vault["order_84920"]`\n2. Safe access with default fallback: `vault.get("order_99999", "Not Found")` to prevent KeyError crashes.',
      technicalText: 'Handling missing keys gracefully with `.get()` or `if key in dict:` checks.',
      characterFocusId: 'winston',
      dialogue: [
        {
          characterId: 'winston',
          speech: 'So `.get()` gives me a friendly message instead of crashing if a parcel doesn\'t exist!',
          mood: 'excited'
        }
      ]
    },
    {
      id: 'dict-scene-6',
      sceneNumber: 6,
      type: 'translation',
      title: 'Technical Translation Layer',
      subtitle: 'Mapping warehouse concepts to Python dictionary operations.',
      storyText: 'Barcodes are Keys. Shelves are Values. The Warehouse Ledger is a Dict.',
      technicalText: 'Inspect the hash table mapping and memory bucket lookup mechanics.',
      highlightCodeLines: [2, 10]
    },
    {
      id: 'dict-scene-7',
      sceneNumber: 7,
      type: 'code',
      title: 'The Code Connection',
      subtitle: 'Interactive lines connecting warehouse lookups to Python code.',
      storyText: 'Click the steps to trace dictionary creation, key lookup, and value extraction.',
      technicalText: 'Hash table memory indexing and dictionary method execution.',
      highlightCodeLines: [1, 2, 8, 9, 10, 11]
    },
    {
      id: 'dict-scene-8',
      sceneNumber: 8,
      type: 'interactive',
      title: 'Interactive Warehouse Simulator',
      subtitle: 'Search across 100,000 simulated packages in real-time!',
      storyText: 'Type an order ID or filter by shelf category to see the instant O(1) dictionary response.',
      technicalText: 'Experience constant time O(1) hash map access vs linear scanning.',
      highlightCodeLines: [9, 10]
    },
    {
      id: 'dict-scene-9',
      sceneNumber: 9,
      type: 'result',
      title: 'The 0.0001s Delivery',
      subtitle: 'Zero wait time for the happy driver.',
      storyText: 'The parcel is handed to the courier in 10 seconds flat. Global Logistics Vault becomes the highest-rated warehouse in the region.',
      technicalText: 'Maintained O(1) retrieval latency regardless of whether the vault had 10 or 10,000,000 items.',
      characterFocusId: 'winston',
      dialogue: [
        {
          characterId: 'winston',
          speech: 'I will never use an unindexed list for lookups again. Dictionaries are pure magic!',
          mood: 'triumphant'
        }
      ]
    },
    {
      id: 'dict-scene-10',
      sceneNumber: 10,
      type: 'recap',
      title: 'Lesson Recap',
      subtitle: 'Keys, values, and O(1) speed.',
      storyText: 'Keys must be unique and hashable. Values can be anything.',
      technicalText: 'Summary of dictionary instantiation, mutation, and safe retrieval.'
    },
    {
      id: 'dict-scene-11',
      sceneNumber: 11,
      type: 'challenge',
      title: 'Mini Challenge',
      subtitle: 'Test your dictionary intuition.',
      storyText: 'Solve Winston\'s quiz on dictionary key retrieval!',
      technicalText: 'Evaluate safe dictionary indexing and key existence checks.'
    }
  ],

  interactiveSimulator: {
    title: 'Global Logistics Vault Dictionary Explorer',
    description: 'Query parcels by Key to see the instant O(1) hash table lookup in action.',
    sampleDatasetName: 'vault_inventory_dict',
    columns: [
      { key: 'order_id', label: 'Key (Order ID)', type: 'string' },
      { key: 'customer', label: 'Customer', type: 'string' },
      { key: 'item', label: 'Item', type: 'string' },
      { key: 'shelf', label: 'Shelf Location', type: 'badge' },
      { key: 'weight_kg', label: 'Weight (kg)', type: 'number' }
    ],
    initialData: [
      { id: 1, order_id: 'order_84920', customer: 'Alice Wong', item: 'Quantum Laptop Pro', shelf: 'Aisle 4B', weight_kg: 2.1 },
      { id: 2, order_id: 'order_84921', customer: 'Bob Miller', item: 'Noise-Cancel Headphones', shelf: 'Aisle 2A', weight_kg: 0.4 },
      { id: 3, order_id: 'order_84922', customer: 'Charlie Davis', item: 'Mechanical Keyboard RGB', shelf: 'Aisle 9C', weight_kg: 1.2 },
      { id: 4, order_id: 'order_84923', customer: 'Diana Prince', item: '4K Gaming Monitor 32"', shelf: 'Aisle 1D', weight_kg: 6.8 },
      { id: 5, order_id: 'order_84924', customer: 'Evan Wright', item: 'Ergonomic Standing Desk', shelf: 'Aisle 8E', weight_kg: 24.5 },
      { id: 6, order_id: 'order_84925', customer: 'Fiona Gallagher', item: 'Smart Home Hub v2', shelf: 'Aisle 3A', weight_kg: 0.8 }
    ],
    controls: [
      {
        id: 'searchKey',
        label: 'Lookup Parcel Key',
        type: 'select',
        defaultValue: 'order_84920',
        options: [
          { label: 'order_84920 (Alice - Laptop)', value: 'order_84920' },
          { label: 'order_84921 (Bob - Headphones)', value: 'order_84921' },
          { label: 'order_84922 (Charlie - Keyboard)', value: 'order_84922' },
          { label: 'order_84923 (Diana - Monitor)', value: 'order_84923' },
          { label: 'order_84924 (Evan - Desk)', value: 'order_84924' },
          { label: 'order_84925 (Fiona - Smart Hub)', value: 'order_84925' },
          { label: 'order_99999 (Non-existent Key)', value: 'order_99999' }
        ]
      }
    ],
    pythonCodeTemplate: (params) => {
      return `vault = {
    'order_84920': {'customer': 'Alice Wong', 'shelf': 'Aisle 4B'},
    'order_84921': {'customer': 'Bob Miller', 'shelf': 'Aisle 2A'},
    'order_84922': {'customer': 'Charlie Davis', 'shelf': 'Aisle 9C'},
    'order_84923': {'customer': 'Diana Prince', 'shelf': 'Aisle 1D'}
}

# Safe lookup using .get()
target_key = '${params.searchKey}'
parcel = vault.get(target_key, "❌ Parcel Not Found in Vault")

print(f"Querying key: {target_key}")
print(f"Result: {parcel}")`;
    },
    simulationLogic: (params, rawData) => {
      const match = rawData.find(r => r.order_id === params.searchKey);
      const filtered = match ? [match] : [];

      return {
        filteredData: filtered,
        computedStats: [
          { label: 'Search Complexity', value: 'O(1) Constant Time' },
          { label: 'Lookup Latency', value: '0.0001 ms' },
          { label: 'Status', value: match ? 'Found on Shelf!' : 'Key Error (Not Found)' },
          { label: 'Total Vault Items', value: '100,000' }
        ],
        executionTimeMs: 0.0001,
        logMessages: [
          `[Hash Function] Hashed key string '${params.searchKey}' -> bucket address 0x7ffd982`,
          match 
            ? `[Cache Hit] Directly retrieved payload from bucket in 1 step: ${match.item}`
            : `[Cache Miss] Key '${params.searchKey}' does not exist in hash table. Returned default.`
        ]
      };
    }
  },

  challenge: {
    question: 'You have a user dictionary: `user = {"name": "Alex", "age": 28}`. What happens if you run `print(user["email"])` when the "email" key does not exist?',
    scenarioContext: 'Scenario: Accessing an unassigned key using square brackets `user["email"]`.',
    options: [
      {
        id: 'opt-dict-q1',
        text: 'It returns `None` silently without error.',
        isCorrect: false,
        explanation: 'Square brackets `user["email"]` will raise a `KeyError` exception and crash the script if the key does not exist. Use `user.get("email")` if you want it to return None safely!'
      },
      {
        id: 'opt-dict-q2',
        text: 'Python raises a `KeyError` and halts the program.',
        isCorrect: true,
        explanation: 'Spot on! Direct bracket indexing throws a KeyError on missing keys. Always use `.get("email", default_value)` or check `if "email" in user:` for safe lookups.'
      },
      {
        id: 'opt-dict-q3',
        text: 'Python creates an empty email key automatically.',
        isCorrect: false,
        explanation: 'Reading a key never creates it. Standard dicts do not auto-populate missing keys (only collections.defaultdict does that).'
      }
    ],
    conceptualTakeaway: 'Use `dict.get(key, fallback)` whenever you are not 100% certain a key exists in your data.'
  },

  recapSummary: {
    problem: 'Searching through 100,000 items in a list takes O(N) linear time.',
    concept: 'Python Dictionaries & Hash Maps (`{key: value}`).',
    whyNeeded: 'Gives instantaneous O(1) lookups by unique key regardless of data scale.',
    howItWorks: 'Hashes the key into a direct memory bucket offset.',
    keySyntax: "user = {'id': 101, 'name': 'Maya'}\nname = user.get('name', 'Unknown')",
    keyResult: 'Retrieved parcel locations in 0.0001s with zero shelf scanning.'
  }
};

export const INITIAL_LESSONS: Lesson[] = [
  PANDAS_LESSON,
  LOOPS_LESSON,
  DICTIONARY_LESSON
];
