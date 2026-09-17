import { ConversationLesson } from '../types';

export const PANDAS_CONVERSATION: ConversationLesson = {
  id: 'pandas-conversation',
  slug: 'pandas',
  topic: 'Pandas',
  title: 'Data Wrangling & Analysis',
  tagline: 'How Ayushi learned to query 10,000 customer records in 1 line of Python.',
  category: 'Data Science',
  difficulty: 'Beginner',
  estimatedMinutes: 5,
  learner: {
    name: 'Ayushi',
    role: 'Data Analyst',
    avatarEmoji: '👩',
    avatarBg: 'bg-amber-100 text-amber-800 border-amber-200',
    bio: 'Working through a customer spreadsheet that keeps freezing.'
  },
  guide: {
    name: 'Ayush',
    role: 'Software Engineer',
    avatarEmoji: '👨',
    avatarBg: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    bio: 'Connects business problems to idiomatic Python tools.'
  },
  turns: [
    {
      id: 'turn-1',
      speaker: 'learner',
      phase: 'problem',
      level: 1,
      text: "Ayush, I have thousands of customer records. I need to find which customers spent more than ₹10,000.",
      reactionMood: 'confused',
      secondaryNote: 'Person A has a tangible problem'
    },
    {
      id: 'turn-2',
      speaker: 'guide',
      phase: 'problem',
      level: 1,
      text: "How are you doing it right now?",
      reactionMood: 'curious',
      secondaryNote: 'Person B asks what happened'
    },
    {
      id: 'turn-3',
      speaker: 'learner',
      phase: 'problem',
      level: 1,
      text: "I'm checking the records one by one in my spreadsheet, but my computer keeps freezing.",
      reactionMood: 'thinking',
      secondaryNote: 'A explains the current naive approach'
    },
    {
      id: 'turn-4',
      speaker: 'guide',
      phase: 'problem',
      level: 1,
      text: "How long would that take if you did it manually?",
      reactionMood: 'explaining',
      secondaryNote: 'B asks why the current approach is difficult'
    },
    {
      id: 'turn-5',
      speaker: 'learner',
      phase: 'problem',
      level: 1,
      text: "Probably hours... maybe days if new records keep coming in.",
      reactionMood: 'confused',
      secondaryNote: 'A realizes the limitation'
    },
    {
      id: 'turn-6',
      speaker: 'guide',
      phase: 'discovery',
      level: 2,
      text: "We have 10,000 records. What should we do?",
      interactiveChoice: {
        prompt: "Help Ayushi decide the next step:",
        options: [
          {
            id: 'opt-manual',
            label: "Check every row manually using a regular for-loop",
            learnerSpeechAfter: "Should I just write a standard Python for-loop and check each row one by one?",
            guideReaction: "You could, but loops in plain Python can be slow and require writing lots of boilerplate code. There is a much faster way.",
            isOptimal: false
          },
          {
            id: 'opt-tool',
            label: "Use a specialized library that processes entire columns at once",
            learnerSpeechAfter: "Then I need something that can work with all those records at once without looping manually.",
            guideReaction: "Exactly! You need a Python library designed specifically for tabular data.",
            isOptimal: true
          }
        ]
      },
      reactionMood: 'explaining',
      secondaryNote: 'Interactive decision: Naive manual loop vs Specialized library'
    },
    {
      id: 'turn-7',
      speaker: 'learner',
      phase: 'discovery',
      level: 2,
      text: "Like what?",
      reactionMood: 'curious',
      secondaryNote: 'A asks "What is that?"'
    },
    {
      id: 'turn-8',
      speaker: 'guide',
      phase: 'discovery',
      level: 2,
      text: "Pandas.",
      reactionMood: 'encouraging',
      secondaryNote: 'B introduces the core idea'
    },
    {
      id: 'turn-9',
      speaker: 'learner',
      phase: 'explanation',
      level: 2,
      text: "Wait, Pandas? How does it help with spreadsheets?",
      reactionMood: 'thinking',
      secondaryNote: 'A asks for clarity'
    },
    {
      id: 'turn-10',
      speaker: 'guide',
      phase: 'explanation',
      level: 2,
      text: "Think of it as having a tireless assistant who loads all those records into a clean 2D table in fast memory, called a DataFrame.",
      reactionMood: 'explaining',
      secondaryNote: 'B explains simply using an intuitive analogy'
    },
    {
      id: 'turn-11',
      speaker: 'learner',
      phase: 'explanation',
      level: 3,
      text: "How does it actually filter all those rows without me writing a loop?",
      reactionMood: 'curious',
      secondaryNote: 'A asks "How does it actually work?"'
    },
    {
      id: 'turn-12',
      speaker: 'guide',
      phase: 'explanation',
      level: 3,
      text: "Pandas uses something called 'Boolean Masking'. You give it a condition — like `data['purchase'] > 10000` — and it checks all 10,000 records in parallel using fast C-compiled code underneath.",
      reactionMood: 'explaining',
      secondaryNote: 'B explains the technical mechanism'
    },
    {
      id: 'turn-13',
      speaker: 'guide',
      phase: 'code',
      level: 4,
      text: "Let's see what this looks like in Python. It's just 4 lines:",
      codeSnippet: {
        code: `import pandas as pd

# Load 10,000 customer transactions
data = pd.read_csv("customers.csv")

# Filter for customers spending > ₹10,000 in one line
high_value = data[data["purchase"] > 10000]

print(high_value[["customer_name", "city", "purchase"]])`,
        language: 'python',
        filename: 'filter_customers.py',
        caption: 'Filtering 10,000 records with Pandas Boolean Indexing',
        runnable: true,
        output: `   customer_name      city  purchase
0     Priya Sharma    Mumbai     14500
3      Rohan Mehta     Delhi     22000
7      Sneha Patel Bengaluru     18750
12    Vikram Singh    Jaipur     11200
[420 rows matched in 0.002s]`
      },
      reactionMood: 'encouraging',
      secondaryNote: 'Code appears as part of the conversation'
    },
    {
      id: 'turn-14',
      speaker: 'learner',
      phase: 'code',
      level: 4,
      text: "Oh! So `pd.read_csv` loads the file, and `data['purchase'] > 10000` creates the filter rule?",
      reactionMood: 'aha',
      secondaryNote: 'A tries and understands the code structure'
    },
    {
      id: 'turn-15',
      speaker: 'guide',
      phase: 'code',
      level: 4,
      text: "Spot on! And when you wrap `data[...]` around that rule, Pandas gives you back only the matching rows in 2 milliseconds.",
      reactionMood: 'satisfied',
      secondaryNote: 'Result and performance validated'
    },
    {
      id: 'turn-16',
      speaker: 'learner',
      phase: 'practice',
      level: 4,
      text: "That saved me hours of manual work. So whenever I have tabular data with thousands of rows, I load it into a DataFrame and use conditional filtering instead of manual loops!",
      reactionMood: 'satisfied',
      secondaryNote: 'A summarizes what was learned'
    }
  ],
  practiceQuestion: {
    question: "Ayushi wants to find all customers from 'Mumbai' in her DataFrame `data`. Which statement is the idiomatic Pandas way?",
    options: [
      {
        id: 'opt-a',
        text: "data[data['city'] == 'Mumbai']",
        isCorrect: true,
        explanation: "Correct! This uses Boolean Masking to filter the entire column without writing a slow loop."
      },
      {
        id: 'opt-b',
        text: "data.filter_rows(lambda r: r['city'] == 'Mumbai')",
        isCorrect: false,
        explanation: "This is not standard Pandas syntax. Pandas operates on vectorized Series conditions."
      },
      {
        id: 'opt-c',
        text: "[row for row in data if row.city == 'Mumbai']",
        isCorrect: false,
        explanation: "This reverts back to slow row-by-row iteration, defeating the C-optimized speed of Pandas."
      }
    ],
    takeaway: "Pandas transforms messy tabular datasets into fast in-memory DataFrames, enabling instant vectorized filtering without nested loops."
  },
  summaryTakeaway: {
    problem: "Iterating through spreadsheets or CSV files row-by-row freezes systems and wastes hours.",
    intuition: "A tireless assistant placing all rows onto a fast table and highlighting matches at a glance.",
    technicalConcept: "Vectorized Boolean indexing evaluates column-level conditions directly in C memory.",
    codePattern: "df_filtered = df[df['col'] > value]"
  }
};

export const NUMPY_CONVERSATION: ConversationLesson = {
  id: 'numpy-conversation',
  slug: 'numpy',
  topic: 'NumPy',
  title: 'Vectorized Array Computing',
  tagline: 'Why running math on 1,000,000 numbers in NumPy is 80x faster than Python loops.',
  category: 'Scientific Computing',
  difficulty: 'Beginner',
  estimatedMinutes: 5,
  learner: {
    name: 'Ayushi',
    role: 'Quant Developer',
    avatarEmoji: '👩',
    avatarBg: 'bg-amber-100 text-amber-800 border-amber-200',
    bio: 'Calculating price normalizations across 1 million sensor readings.'
  },
  guide: {
    name: 'Ayush',
    role: 'Software Engineer',
    avatarEmoji: '👨',
    avatarBg: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    bio: 'Obsessed with hardware cache lines and vector registers.'
  },
  turns: [
    {
      id: 'npy-1',
      speaker: 'learner',
      phase: 'problem',
      level: 1,
      text: "Ayush, my program is calculating physics vectors for 1,000,000 data points. A simple list loop takes over 3 seconds and heats up my laptop!",
      reactionMood: 'worried',
      secondaryNote: 'A has a computational bottleneck'
    },
    {
      id: 'npy-2',
      speaker: 'guide',
      phase: 'problem',
      level: 1,
      text: "Show me your loop. Are you multiplying each number inside a regular Python `for` loop?",
      reactionMood: 'curious',
      secondaryNote: 'B investigates the loop implementation'
    },
    {
      id: 'npy-3',
      speaker: 'learner',
      phase: 'problem',
      level: 1,
      text: "Yes! `[x * 2.5 for x in raw_measurements]`. Standard Python list comprehension. Why is it so slow for big numbers?",
      reactionMood: 'confused',
      secondaryNote: 'A describes naive list iteration'
    },
    {
      id: 'npy-4',
      speaker: 'guide',
      phase: 'problem',
      level: 1,
      text: "Because a Python list doesn't store raw numbers side-by-side. It stores 1,000,000 pointers to heap-allocated objects. Every single multiplication has to unpack an object, inspect its type, calculate, and box it back up!",
      reactionMood: 'explaining',
      secondaryNote: 'B explains the memory pointer overhead'
    },
    {
      id: 'npy-5',
      speaker: 'guide',
      phase: 'discovery',
      level: 2,
      text: "If you have 1,000,000 numbers of the exact same float type, how should your computer organize them?",
      interactiveChoice: {
        prompt: "Choose the optimal hardware memory strategy:",
        options: [
          {
            id: 'npy-opt-pointers',
            label: "Keep them scattered across RAM as flexible Python objects",
            learnerSpeechAfter: "Maybe Python needs flexibility in case some items are strings and some are floats?",
            guideReaction: "When you do scientific computing, every item is guaranteed to be a number. Flexibility just slows you down.",
            isOptimal: false
          },
          {
            id: 'npy-opt-contiguous',
            label: "Store them tightly packed in contiguous memory bytes",
            learnerSpeechAfter: "Pack them right next to each other like a continuous tape of bytes!",
            guideReaction: "Bingo! When bytes are continuous, the CPU can grab 8 or 16 numbers at once using SIMD vector instructions.",
            isOptimal: true
          }
        ]
      },
      reactionMood: 'explaining',
      secondaryNote: 'Interactive decision on memory packing'
    },
    {
      id: 'npy-6',
      speaker: 'learner',
      phase: 'discovery',
      level: 2,
      text: "Which Python library does that contiguous memory packing?",
      reactionMood: 'curious',
      secondaryNote: 'A asks for the library name'
    },
    {
      id: 'npy-7',
      speaker: 'guide',
      phase: 'discovery',
      level: 2,
      text: "NumPy. It's the cornerstone of all numerical and AI computing in Python.",
      reactionMood: 'encouraging',
      secondaryNote: 'B introduces NumPy'
    },
    {
      id: 'npy-8',
      speaker: 'guide',
      phase: 'explanation',
      level: 2,
      text: "Think of a standard Python list like mailing 1,000,000 individually wrapped parcels. NumPy is like packing them into one long freight container on a high-speed bullet train.",
      reactionMood: 'explaining',
      secondaryNote: 'B uses the freight container analogy'
    },
    {
      id: 'npy-9',
      speaker: 'learner',
      phase: 'explanation',
      level: 3,
      text: "How does the syntax look? Do I still write a loop?",
      reactionMood: 'thinking',
      secondaryNote: 'A asks about syntax without loops'
    },
    {
      id: 'npy-10',
      speaker: 'guide',
      phase: 'explanation',
      level: 3,
      text: "No loops! In NumPy, you apply operators directly to the entire array: `arr * 2.5`. This is called 'vectorization'. Underneath, compiled C and BLAS libraries execute at bare-metal speeds.",
      reactionMood: 'explaining',
      secondaryNote: 'B explains vectorization'
    },
    {
      id: 'npy-11',
      speaker: 'guide',
      phase: 'code',
      level: 4,
      text: "Check out this benchmark on 1,000,000 numbers:",
      codeSnippet: {
        code: `import numpy as np
import time

# Create an array of 1,000,000 float measurements
data = np.random.randn(1_000_000)

# Vectorized operation in 1 clean line
start = time.perf_counter()
normalized = (data - data.mean()) / data.std()
elapsed_ms = (time.perf_counter() - start) * 1000

print(f"Computed shape: {normalized.shape}")
print(f"Calculated 1M normalized stats in {elapsed_ms:.2f} ms")`,
        language: 'python',
        filename: 'numpy_benchmark.py',
        caption: 'Normalizing 1M data points in NumPy',
        runnable: true,
        output: `Computed shape: (1000000,)
Calculated 1M normalized stats in 3.12 ms (82x faster than Python loop)`
      },
      reactionMood: 'encouraging',
      secondaryNote: 'Live NumPy benchmark code'
    },
    {
      id: 'npy-12',
      speaker: 'learner',
      phase: 'code',
      level: 4,
      text: "3 milliseconds instead of 3 seconds?! That's insane! And `data.mean()` and `data.std()` run right on the array directly.",
      reactionMood: 'aha',
      secondaryNote: 'A experiences the massive speedup'
    },
    {
      id: 'npy-13',
      speaker: 'guide',
      phase: 'practice',
      level: 4,
      text: "Every major library — Pandas, SciPy, Matplotlib, Scikit-Learn, and PyTorch — is built directly on top of NumPy's array foundations.",
      reactionMood: 'satisfied',
      secondaryNote: 'B connects NumPy to the wider ecosystem'
    }
  ],
  practiceQuestion: {
    question: "Why is `np.array * 2` dramatically faster than `[x * 2 for x in my_list]` for 10 million elements?",
    options: [
      {
        id: 'npy-q1',
        text: "NumPy stores uniform data contiguously in memory and delegates math to compiled C with SIMD vector instructions.",
        isCorrect: true,
        explanation: "Exactly. Zero Python interpreter boxing overhead, predictable memory layout, and SIMD hardware parallel execution."
      },
      {
        id: 'npy-q2',
        text: "NumPy skips calculating half of the numbers using lossy approximations.",
        isCorrect: false,
        explanation: "NumPy computes exact mathematical results with full IEEE 754 precision."
      },
      {
        id: 'npy-q3',
        text: "NumPy creates 10 million separate background threads.",
        isCorrect: false,
        explanation: "NumPy's core advantage comes from contiguous memory and SIMD vector registers, not spawning 10 million threads."
      }
    ],
    takeaway: "NumPy replaces slow interpreted loops with fast compiled C arrays and vector broadcasting."
  },
  summaryTakeaway: {
    problem: "Iterating through millions of numbers with standard Python lists causes massive memory fragmentation and interpreter overhead.",
    intuition: "Packing uniform items into a continuous high-speed freight container instead of wrapping millions of individual parcels.",
    technicalConcept: "Homogeneous C-contiguous arrays (ndarray) combined with CPU SIMD registers and vector broadcasting.",
    codePattern: "arr_res = (arr - arr.mean()) / arr.std()"
  }
};

export const MATPLOTLIB_CONVERSATION: ConversationLesson = {
  id: 'matplotlib-conversation',
  slug: 'matplotlib',
  topic: 'Matplotlib',
  title: 'Data Visualization & Charting',
  tagline: 'How Ayushi turned confusing terminal logs into publication-ready graphs.',
  category: 'Visualization',
  difficulty: 'Beginner',
  estimatedMinutes: 5,
  learner: {
    name: 'Ayushi',
    role: 'Research Engineer',
    avatarEmoji: '👩',
    avatarBg: 'bg-amber-100 text-amber-800 border-amber-200',
    bio: 'Presenting model training loss to stakeholders but only has raw numbers in text logs.'
  },
  guide: {
    name: 'Ayush',
    role: 'Software Engineer',
    avatarEmoji: '👨',
    avatarBg: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    bio: 'Draws diagrams and plots figures for technical papers.'
  },
  turns: [
    {
      id: 'plt-1',
      speaker: 'learner',
      phase: 'problem',
      level: 1,
      text: "Ayush, I have to present our machine learning experiment results to the engineering director tomorrow. Right now, all I have is a terminal full of loss values printed every epoch!",
      reactionMood: 'worried',
      secondaryNote: 'A has data that nobody can visually comprehend'
    },
    {
      id: 'plt-2',
      speaker: 'guide',
      phase: 'problem',
      level: 1,
      text: "No executive wants to read 50 lines of floating-point numbers scrolling across a terminal.",
      reactionMood: 'explaining',
      secondaryNote: 'B highlights the communication problem'
    },
    {
      id: 'plt-3',
      speaker: 'learner',
      phase: 'problem',
      level: 1,
      text: "I was thinking of exporting the numbers to a CSV, opening an external spreadsheet app, manually making a chart, and taking a screenshot.",
      reactionMood: 'thinking',
      secondaryNote: 'A suggests a fragile manual workflow'
    },
    {
      id: 'plt-4',
      speaker: 'guide',
      phase: 'discovery',
      level: 2,
      text: "What happens next week when you retrain the model on new data?",
      interactiveChoice: {
        prompt: "Help Ayushi choose the reproducible path:",
        options: [
          {
            id: 'plt-opt-manual',
            label: "Repeat the export, click around in spreadsheets, and re-screenshot every time",
            learnerSpeechAfter: "I guess I'd have to manually repeat the whole spreadsheet process again...",
            guideReaction: "That's tedious and error-prone. Good scientific code generates its own visualizations automatically.",
            isOptimal: false
          },
          {
            id: 'plt-opt-code',
            label: "Plot the graphs directly from Python using code as part of the script",
            learnerSpeechAfter: "I should plot it programmatically so the graph updates automatically every time the model runs!",
            guideReaction: "Exactly! And the gold-standard Python library for that is Matplotlib.",
            isOptimal: true
          }
        ]
      },
      reactionMood: 'explaining',
      secondaryNote: 'Interactive choice: Manual screenshot vs Programmatic plotting'
    },
    {
      id: 'plt-5',
      speaker: 'learner',
      phase: 'discovery',
      level: 2,
      text: "I've heard people complain that Matplotlib has weird object names like Figure and Axes. What does that actually mean?",
      reactionMood: 'curious',
      secondaryNote: 'A asks about Figure vs Axes'
    },
    {
      id: 'plt-6',
      speaker: 'guide',
      phase: 'explanation',
      level: 2,
      text: "Think of the **Figure** as the physical picture frame or blank canvas on your wall. The **Axes** is the actual graph paper stuck inside that frame with the X and Y coordinates where you draw.",
      reactionMood: 'explaining',
      secondaryNote: 'B explains the Figure vs Axes hierarchy'
    },
    {
      id: 'plt-7',
      speaker: 'learner',
      phase: 'explanation',
      level: 3,
      text: "So one Figure can have multiple Axes side-by-side?",
      reactionMood: 'aha',
      secondaryNote: 'A deduces subplots'
    },
    {
      id: 'plt-8',
      speaker: 'guide',
      phase: 'explanation',
      level: 3,
      text: "Exactly! That's how you make side-by-side subplots: Loss on the left, Accuracy on the right, both inside one Figure.",
      reactionMood: 'encouraging',
      secondaryNote: 'B validates subplot mental model'
    },
    {
      id: 'plt-9',
      speaker: 'guide',
      phase: 'code',
      level: 4,
      text: "Here is the clean, object-oriented way to plot your training curve in 6 lines:",
      codeSnippet: {
        code: `import matplotlib.pyplot as plt

epochs = [1, 2, 3, 4, 5, 6, 7, 8]
loss = [0.85, 0.62, 0.44, 0.31, 0.22, 0.17, 0.14, 0.12]
val_loss = [0.90, 0.68, 0.52, 0.38, 0.30, 0.28, 0.29, 0.31]

# Create Figure (canvas) and Axes (plot)
fig, ax = plt.subplots(figsize=(6, 4))
ax.plot(epochs, loss, label="Train Loss", color="#1F77B4", marker="o")
ax.plot(epochs, val_loss, label="Validation Loss", color="#FF7F0E", linestyle="--")

ax.set_title("Neural Network Convergence")
ax.set_xlabel("Epoch")
ax.set_ylabel("Loss")
ax.grid(True, alpha=0.3)
ax.legend()

plt.savefig("loss_curve.png", dpi=300)
print("Saved publication-ready figure to loss_curve.png")`,
        language: 'python',
        filename: 'plot_loss.py',
        caption: 'Plotting training loss with Matplotlib object-oriented API',
        runnable: true,
        output: `Saved publication-ready figure to loss_curve.png (300 DPI)`
      },
      reactionMood: 'encouraging',
      secondaryNote: 'Demonstration of clean Matplotlib OO API'
    },
    {
      id: 'plt-10',
      speaker: 'learner',
      phase: 'code',
      level: 4,
      text: "Wow, `fig, ax = plt.subplots()` makes it so clean! I can see the exact epoch where validation loss starts overfitting, and it saves as a high-res image automatically.",
      reactionMood: 'satisfied',
      secondaryNote: 'A understands the visual payoff'
    }
  ],
  practiceQuestion: {
    question: "In Matplotlib's recommended object-oriented interface, what is the difference between `fig` and `ax`?",
    options: [
      {
        id: 'plt-q1',
        text: "`fig` is the outer bounding window/canvas, while `ax` is the coordinate system where data lines, labels, and ticks are drawn.",
        isCorrect: true,
        explanation: "Correct! One `fig` (Figure) can contain one or more `ax` (Axes) subplots."
      },
      {
        id: 'plt-q2',
        text: "`fig` is used for 3D graphs only, while `ax` is for 2D graphs.",
        isCorrect: false,
        explanation: "Both 2D and 3D plots live within the standard Figure and Axes architecture."
      },
      {
        id: 'plt-q3',
        text: "`fig` loads the data from disk, while `ax` executes the math.",
        isCorrect: false,
        explanation: "Matplotlib is purely a rendering library; NumPy or Pandas holds the data."
      }
    ],
    takeaway: "Matplotlib gives you programmatic, reproducible control over every pixel, axis, and tick mark of your data graphs."
  },
  summaryTakeaway: {
    problem: "Interpreting trends from massive raw terminal logs or manual screenshot workflows is slow and unreproducible.",
    intuition: "The Figure is your picture frame; the Axes is the coordinate grid where lines and points are painted.",
    technicalConcept: "Object-oriented plotting hierarchy with `plt.subplots()`, binding data vectors to coordinate transforms.",
    codePattern: "fig, ax = plt.subplots()\nax.plot(x, y)\nplt.savefig('plot.png')"
  }
};

export const SEABORN_CONVERSATION: ConversationLesson = {
  id: 'seaborn-conversation',
  slug: 'seaborn',
  topic: 'Seaborn',
  title: 'Statistical Data Visualization',
  tagline: 'How Ayushi turned 20 columns of data into an instant correlation heatmap.',
  category: 'Visualization',
  difficulty: 'Intermediate',
  estimatedMinutes: 5,
  learner: {
    name: 'Ayushi',
    role: 'Data Scientist',
    avatarEmoji: '👩',
    avatarBg: 'bg-amber-100 text-amber-800 border-amber-200',
    bio: 'Exploring a housing dataset with 25 different numerical columns.'
  },
  guide: {
    name: 'Ayush',
    role: 'Software Engineer',
    avatarEmoji: '👨',
    avatarBg: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    bio: 'Uses statistical aesthetics to reveal hidden relationships in datasets.'
  },
  turns: [
    {
      id: 'sns-1',
      speaker: 'learner',
      phase: 'problem',
      level: 1,
      text: "Ayush, I have a housing dataset with 20 columns — square footage, bedrooms, year built, crime rate, and price. I need to know which features actually correlate with price.",
      reactionMood: 'confused',
      secondaryNote: 'A has multi-dimensional exploratory data analysis needs'
    },
    {
      id: 'sns-2',
      speaker: 'guide',
      phase: 'problem',
      level: 1,
      text: "Writing 20 separate Matplotlib scatter plots would take 50 lines of code and clutter your screen.",
      reactionMood: 'explaining',
      secondaryNote: 'B points out boilerplate fatigue'
    },
    {
      id: 'sns-3',
      speaker: 'learner',
      phase: 'discovery',
      level: 2,
      text: "Can't I just compute the correlation matrix and visualize it all in one glance?",
      reactionMood: 'curious',
      secondaryNote: 'A suggests correlation visualization'
    },
    {
      id: 'sns-4',
      speaker: 'guide',
      phase: 'discovery',
      level: 2,
      text: "Yes! And there's a specialized library built directly on top of Matplotlib that is specifically designed for statistical exploration.",
      interactiveChoice: {
        prompt: "Which library takes statistical visualization to the next level?",
        options: [
          {
            id: 'sns-opt-seaborn',
            label: "Seaborn: high-level statistical plotting with built-in color palettes & themes",
            learnerSpeechAfter: "Seaborn! It's designed to work hand-in-hand with Pandas DataFrames.",
            guideReaction: "Spot on! One line in Seaborn generates beautiful heatmaps, distributions, and regression lines.",
            isOptimal: true
          },
          {
            id: 'sns-opt-raw',
            label: "Write custom nested loops in Python to compute pixel RGB color shades manually",
            learnerSpeechAfter: "Should I calculate the RGB colors for each cell in a loop?",
            guideReaction: "Never hand-roll color interpolations when Seaborn does it with mathematically tuned perceptual palettes.",
            isOptimal: false
          }
        ]
      },
      reactionMood: 'explaining',
      secondaryNote: 'Interactive choice: Seaborn vs Manual RGB math'
    },
    {
      id: 'sns-5',
      speaker: 'learner',
      phase: 'explanation',
      level: 2,
      text: "What makes Seaborn different from Matplotlib?",
      reactionMood: 'thinking',
      secondaryNote: 'A asks for the distinction'
    },
    {
      id: 'sns-6',
      speaker: 'guide',
      phase: 'explanation',
      level: 2,
      text: "Matplotlib gives you raw building blocks (lines, rectangles, text). Seaborn gives you high-level statistical concepts: distributions, violin plots, regressions, and correlation heatmaps.",
      reactionMood: 'explaining',
      secondaryNote: 'B explains the abstraction layer'
    },
    {
      id: 'sns-7',
      speaker: 'guide',
      phase: 'code',
      level: 4,
      text: "Look how Seaborn renders an annotated correlation heatmap in literally 3 lines:",
      codeSnippet: {
        code: `import seaborn as sns
import pandas as pd
import matplotlib.pyplot as plt

# Load sample dataset
df = pd.DataFrame({
    'price': [450, 600, 320, 800, 510],
    'sqft': [1200, 1800, 950, 2400, 1500],
    'bedrooms': [2, 3, 1, 4, 3],
    'year_built': [1995, 2010, 1980, 2018, 2005]
})

# Generate correlation heatmap
plt.figure(figsize=(6, 4))
sns.heatmap(df.corr(), annot=True, cmap="coolwarm", fmt=".2f", vmin=-1, vmax=1)
plt.title("Feature Correlation Matrix")
plt.tight_layout()
print("Rendered statistical heatmap!")`,
        language: 'python',
        filename: 'seaborn_heatmap.py',
        caption: 'Generating an annotated correlation heatmap with Seaborn',
        runnable: true,
        output: `Rendered statistical heatmap!
sqft <-> price correlation: 0.99
bedrooms <-> price correlation: 0.96`
      },
      reactionMood: 'encouraging',
      secondaryNote: 'Seaborn heatmap snippet'
    },
    {
      id: 'sns-8',
      speaker: 'learner',
      phase: 'code',
      level: 4,
      text: "The colors instantly show that square footage and bedrooms are deeply correlated with price. And because it's built on Matplotlib, I can still use `plt.title()` and `plt.savefig()`!",
      reactionMood: 'aha',
      secondaryNote: 'A grasps the symbiotic relationship'
    }
  ],
  practiceQuestion: {
    question: "How does Seaborn interact with Matplotlib?",
    options: [
      {
        id: 'sns-q1',
        text: "Seaborn is built directly on top of Matplotlib, using Matplotlib's Figure and Axes objects while automating complex statistical visualizations.",
        isCorrect: true,
        explanation: "Correct! You can customize any Seaborn plot using standard Matplotlib functions."
      },
      {
        id: 'sns-q2',
        text: "Seaborn completely replaces Matplotlib and cannot be used in the same project.",
        isCorrect: false,
        explanation: "They work together. Seaborn uses Matplotlib under the hood."
      },
      {
        id: 'sns-q3',
        text: "Seaborn only works with SQL databases, not Pandas DataFrames.",
        isCorrect: false,
        explanation: "Seaborn is tightly integrated with Pandas DataFrames."
      }
    ],
    takeaway: "Seaborn provides beautiful, high-level statistical plotting templates with zero boilerplate."
  },
  summaryTakeaway: {
    problem: "Drawing statistical visualizations like heatmaps and pairplots with raw primitives requires dozens of tedious lines.",
    intuition: "A statistical designer who understands DataFrame columns and automatically picks the right color scales.",
    technicalConcept: "High-level statistical charting API mapped onto Matplotlib Axes with perceptual color palettes.",
    codePattern: "sns.heatmap(df.corr(), annot=True, cmap='coolwarm')"
  }
};

export const SCIKIT_LEARN_CONVERSATION: ConversationLesson = {
  id: 'scikit-learn-conversation',
  slug: 'scikit-learn',
  topic: 'Scikit-Learn',
  title: 'Applied Machine Learning',
  tagline: 'How Ayushi trained her first predictive customer churn model with `.fit()` and `.predict()`.',
  category: 'Machine Learning',
  difficulty: 'Intermediate',
  estimatedMinutes: 6,
  learner: {
    name: 'Ayushi',
    role: 'Software Engineer',
    avatarEmoji: '👩',
    avatarBg: 'bg-amber-100 text-amber-800 border-amber-200',
    bio: 'Tasked with predicting which users will cancel their subscription next month.'
  },
  guide: {
    name: 'Ayush',
    role: 'Software Engineer',
    avatarEmoji: '👨',
    avatarBg: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    bio: 'Advocates for clean, reproducible machine learning pipelines.'
  },
  turns: [
    {
      id: 'skl-1',
      speaker: 'learner',
      phase: 'problem',
      level: 1,
      text: "Ayush, my team wants to predict customer churn based on usage hours, support tickets, and account age. Do I have to write the math for decision trees or gradient descent from scratch?",
      reactionMood: 'worried',
      secondaryNote: 'A is intimidated by machine learning algorithms'
    },
    {
      id: 'skl-2',
      speaker: 'guide',
      phase: 'problem',
      level: 1,
      text: "Writing machine learning algorithms from scratch is great for math homework, but in production, hand-rolled code is slow, buggy, and lacks validation metrics.",
      reactionMood: 'explaining',
      secondaryNote: 'B explains why hand-rolling ML is risky'
    },
    {
      id: 'skl-3',
      speaker: 'learner',
      phase: 'discovery',
      level: 2,
      text: "What library do production data science teams use for standard tabular machine learning?",
      reactionMood: 'curious',
      secondaryNote: 'A asks for the industry standard'
    },
    {
      id: 'skl-4',
      speaker: 'guide',
      phase: 'discovery',
      level: 2,
      text: "Scikit-Learn (`sklearn`). It has the most elegant, unified API in the entire Python ecosystem.",
      reactionMood: 'encouraging',
      secondaryNote: 'B introduces Scikit-Learn'
    },
    {
      id: 'skl-5',
      speaker: 'guide',
      phase: 'explanation',
      level: 2,
      text: "Every model in Scikit-Learn — whether it's a Random Forest, Logistic Regression, or Support Vector Machine — follows the exact same 3 steps: 1) Instantiate, 2) `.fit(X_train, y_train)`, 3) `.predict(X_test)`.",
      reactionMood: 'explaining',
      secondaryNote: 'B introduces the unified Estimator API'
    },
    {
      id: 'skl-6',
      speaker: 'learner',
      phase: 'explanation',
      level: 3,
      text: "Wait, so whether I use a simple linear model or an ensemble of 100 decision trees, the method calls are identical?",
      reactionMood: 'curious',
      secondaryNote: 'A clarifies the unified API'
    },
    {
      id: 'skl-7',
      speaker: 'guide',
      phase: 'explanation',
      level: 3,
      text: "Exactly. It separates the algorithm logic from your data pipeline. And it includes built-in tools to split your data so you don't accidentally cheat by testing on training data.",
      reactionMood: 'explaining',
      secondaryNote: 'B explains data splitting'
    },
    {
      id: 'skl-8',
      speaker: 'guide',
      phase: 'code',
      level: 4,
      text: "Here is a complete churn prediction pipeline in under 15 lines:",
      codeSnippet: {
        code: `from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score
import numpy as np

# Synthetic features: [usage_hours, support_tickets, account_months]
X = np.random.rand(1000, 3)
# Target: 0 (retained) or 1 (churned)
y = (X[:, 1] * 2 + np.random.randn(1000) * 0.5 > 1.2).astype(int)

# 1. Train / Test Split (80% train, 20% test)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# 2. Fit the model
model = RandomForestClassifier(n_estimators=50, random_state=42)
model.fit(X_train, y_train)

# 3. Predict & evaluate
predictions = model.predict(X_test)
accuracy = accuracy_score(y_test, predictions)

print(f"Model trained successfully! Test Accuracy: {accuracy * 100:.1f}%")`,
        language: 'python',
        filename: 'train_churn_model.py',
        caption: 'Training a Random Forest Classifier with Scikit-Learn',
        runnable: true,
        output: `Model trained successfully! Test Accuracy: 89.5%
Features evaluated: usage_hours, support_tickets, account_months`
      },
      reactionMood: 'encouraging',
      secondaryNote: 'Scikit-Learn ML pipeline'
    },
    {
      id: 'skl-9',
      speaker: 'learner',
      phase: 'practice',
      level: 4,
      text: "That was so intuitive. `train_test_split` keeps me honest, `.fit()` trains on historical records, and `.predict()` gives me actionable predictions for new customers.",
      reactionMood: 'satisfied',
      secondaryNote: 'A summarizes key takeaway'
    }
  ],
  practiceQuestion: {
    question: "What is the primary role of `train_test_split` in Scikit-Learn?",
    options: [
      {
        id: 'skl-q1',
        text: "It splits data into distinct sets so the model is evaluated on unseen data, preventing misleading overfit metrics.",
        isCorrect: true,
        explanation: "Correct! Testing on the same data you trained on gives an artificially inflated sense of performance."
      },
      {
        id: 'skl-q2',
        text: "It speeds up Python loops by converting numbers to integers.",
        isCorrect: false,
        explanation: "It has nothing to do with loop acceleration or type conversion."
      },
      {
        id: 'skl-q3',
        text: "It uploads the model to a cloud server.",
        isCorrect: false,
        explanation: "Scikit-Learn executes entirely in your local Python environment."
      }
    ],
    takeaway: "Scikit-Learn standardizes machine learning through its universal estimator interface: fit, predict, and evaluate."
  },
  summaryTakeaway: {
    problem: "Implementing machine learning math by hand creates fragile, untested code prone to data leakage.",
    intuition: "A standardized toolbox where every statistical tool plugs into the exact same three sockets: fit, predict, score.",
    technicalConcept: "Estimator and Transformer API patterns with cross-validation and hyperparameter tuning.",
    codePattern: "model = RandomForestClassifier()\nmodel.fit(X_train, y_train)\ny_pred = model.predict(X_test)"
  }
};

export const PYTORCH_CONVERSATION: ConversationLesson = {
  id: 'pytorch-conversation',
  slug: 'pytorch',
  topic: 'PyTorch',
  title: 'Deep Learning & Neural Tensors',
  tagline: 'How Ayushi unlocked GPU acceleration and automatic differentiation for deep neural nets.',
  category: 'Advanced AI',
  difficulty: 'Advanced',
  estimatedMinutes: 6,
  learner: {
    name: 'Ayushi',
    role: 'AI Engineer',
    avatarEmoji: '👩',
    avatarBg: 'bg-amber-100 text-amber-800 border-amber-200',
    bio: 'Building an image embedding model and wondering why standard libraries cannot use her GPU.'
  },
  guide: {
    name: 'Ayush',
    role: 'Software Engineer',
    avatarEmoji: '👨',
    avatarBg: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    bio: 'Trains large transformer architectures and tunes CUDA kernels.'
  },
  turns: [
    {
      id: 'torch-1',
      speaker: 'learner',
      phase: 'problem',
      level: 1,
      text: "Ayush, I'm trying to train a 5-layer neural network for image recognition. In pure NumPy, calculating gradients with manual calculus backpropagation is giving me nightmares!",
      reactionMood: 'worried',
      secondaryNote: 'A has manual calculus & hardware limits'
    },
    {
      id: 'torch-2',
      speaker: 'guide',
      phase: 'problem',
      level: 1,
      text: "Manual chain rule calculus across millions of weights is impossible to maintain. Plus, NumPy cannot run on modern GPU acceleration chips.",
      reactionMood: 'explaining',
      secondaryNote: 'B explains the dual limitations of CPU and manual calculus'
    },
    {
      id: 'torch-3',
      speaker: 'learner',
      phase: 'discovery',
      level: 2,
      text: "What library does the modern AI industry use to run tensor math on GPUs and calculate gradients automatically?",
      reactionMood: 'curious',
      secondaryNote: 'A asks for the industry standard'
    },
    {
      id: 'torch-4',
      speaker: 'guide',
      phase: 'discovery',
      level: 2,
      text: "PyTorch. It's the engine behind modern Large Language Models, computer vision models, and generative AI.",
      reactionMood: 'encouraging',
      secondaryNote: 'B introduces PyTorch'
    },
    {
      id: 'torch-5',
      speaker: 'guide',
      phase: 'explanation',
      level: 2,
      text: "PyTorch gives you two superpowers: 1) **Tensors** that look like NumPy arrays but can teleport onto GPUs (`.to('cuda')`), and 2) **Autograd**, an automatic differentiation engine that records every math step on a computational graph.",
      reactionMood: 'explaining',
      secondaryNote: 'B explains Tensors and Autograd'
    },
    {
      id: 'torch-6',
      speaker: 'learner',
      phase: 'explanation',
      level: 3,
      text: "Wait, so when I write `loss.backward()`, PyTorch computes all the calculus partial derivatives automatically?",
      reactionMood: 'aha',
      secondaryNote: 'A realizes the power of Autograd'
    },
    {
      id: 'torch-7',
      speaker: 'guide',
      phase: 'explanation',
      level: 3,
      text: "Every single one! It traces the computational graph backwards, computes `dL/dw` for every weight tensor, and stores them in `.grad`. Then the optimizer simply steps in that direction.",
      reactionMood: 'explaining',
      secondaryNote: 'B explains backpropagation'
    },
    {
      id: 'torch-8',
      speaker: 'guide',
      phase: 'code',
      level: 4,
      text: "Check out a minimal PyTorch forward pass and automatic gradient calculation:",
      codeSnippet: {
        code: `import torch
import torch.nn as nn

# 1. Define a tiny 2-layer Neural Network
class Classifier(nn.Module):
    def __init__(self):
        super().__init__()
        self.net = nn.Sequential(
            nn.Linear(4, 8),
            nn.ReLU(),
            nn.Linear(8, 1)
        )
    def forward(self, x):
        return self.net(x)

model = Classifier()
criterion = nn.MSELoss()
optimizer = torch.optim.Adam(model.parameters(), lr=0.01)

# Forward pass with random batch of 5 items
inputs = torch.randn(5, 4)
targets = torch.randn(5, 1)

output = model(inputs)
loss = criterion(output, targets)

# Automatic Backpropagation in ONE call!
optimizer.zero_grad()
loss.backward()
optimizer.step()

print(f"Calculated Loss: {loss.item():.4f}")
print("Gradients computed and weights updated via Autograd!")`,
        language: 'python',
        filename: 'pytorch_training_step.py',
        caption: 'PyTorch Neural Network Forward Pass & Autograd Step',
        runnable: true,
        output: `Calculated Loss: 0.8412
Gradients computed and weights updated via Autograd!
Device: CUDA / CPU Tensor Graph`
      },
      reactionMood: 'encouraging',
      secondaryNote: 'PyTorch code snippet'
    },
    {
      id: 'torch-9',
      speaker: 'learner',
      phase: 'practice',
      level: 4,
      text: "No manual calculus derivatives, and I can move the whole model to a GPU with `model.to('cuda')`. Now I understand why every AI paper uses PyTorch!",
      reactionMood: 'satisfied',
      secondaryNote: 'A connects theory to practice'
    }
  ],
  practiceQuestion: {
    question: "What does calling `loss.backward()` in PyTorch do?",
    options: [
      {
        id: 'torch-q1',
        text: "It traverses the dynamic computational graph backwards and computes the gradient of the loss with respect to all leaf tensors with `requires_grad=True`.",
        isCorrect: true,
        explanation: "Correct! Autograd applies the calculus chain rule automatically."
      },
      {
        id: 'torch-q2',
        text: "It reverts the neural network weights to their starting values.",
        isCorrect: false,
        explanation: "It computes gradients; it does not undo model parameters."
      },
      {
        id: 'torch-q3',
        text: "It prints the source code of the network in reverse order.",
        isCorrect: false,
        explanation: "This is purely a mathematical operation for backpropagation."
      }
    ],
    takeaway: "PyTorch powers modern AI by combining GPU-accelerated tensor operations with dynamic automatic differentiation."
  },
  summaryTakeaway: {
    problem: "Calculating multivariate calculus derivatives manually and running heavy array math on CPUs prevents neural networks from scaling.",
    intuition: "A video recorder that tracks every mathematical move you make forward, so it can rewind backwards to calculate exact slopes.",
    technicalConcept: "Dynamic computational graph tracking (Autograd) coupled with CUDA GPU tensor execution.",
    codePattern: "loss = criterion(model(x), y)\nloss.backward()\noptimizer.step()"
  }
};

export const POLARS_CONVERSATION: ConversationLesson = {
  id: 'polars-conversation',
  slug: 'polars',
  topic: 'Polars',
  title: 'Next-Gen High-Speed DataFrames',
  tagline: 'How Ayushi processed a 15GB server log without crashing her RAM, using Rust-powered Polars.',
  category: 'Advanced Data',
  difficulty: 'Advanced',
  estimatedMinutes: 6,
  learner: {
    name: 'Ayushi',
    role: 'Data Engineer',
    avatarEmoji: '👩',
    avatarBg: 'bg-amber-100 text-amber-800 border-amber-200',
    bio: 'Trying to load a 15GB CSV file into Pandas on an 8GB laptop and getting MemoryError.'
  },
  guide: {
    name: 'Ayush',
    role: 'Software Engineer',
    avatarEmoji: '👨',
    avatarBg: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    bio: 'Advocate for modern multithreaded and memory-efficient data tooling.'
  },
  turns: [
    {
      id: 'pl-1',
      speaker: 'learner',
      phase: 'problem',
      level: 1,
      text: "Ayush, I love Pandas, but our production web logs just crossed 15 GB. When I run `pd.read_csv('logs.csv')`, my terminal dies with `MemoryError: Unable to allocate array`!",
      reactionMood: 'worried',
      secondaryNote: 'A hits the single-threaded memory wall'
    },
    {
      id: 'pl-2',
      speaker: 'guide',
      phase: 'problem',
      level: 1,
      text: "Pandas was created over 15 years ago when datasets were smaller. It's largely single-threaded and creates multiple in-memory copies of data during queries.",
      reactionMood: 'explaining',
      secondaryNote: 'B explains Pandas architectural bottleneck'
    },
    {
      id: 'pl-3',
      speaker: 'learner',
      phase: 'discovery',
      level: 2,
      text: "Do I have to spin up a giant distributed Apache Spark cluster just to filter one big file?",
      reactionMood: 'confused',
      secondaryNote: 'A dreads cluster complexity'
    },
    {
      id: 'pl-4',
      speaker: 'guide',
      phase: 'discovery',
      level: 2,
      text: "Not anymore! Modern data engineering uses **Polars**, an ultra-fast DataFrame library written from scratch in Rust.",
      interactiveChoice: {
        prompt: "Why is Polars becoming the new favorite in high-performance data pipelines?",
        options: [
          {
            id: 'pl-opt-lazy',
            label: "It uses Apache Arrow memory, all CPU cores in parallel, and Lazy Query Optimization",
            learnerSpeechAfter: "Because it optimizes queries lazily and uses all CPU cores instead of just one!",
            guideReaction: "Exactly. It inspects your entire query first, drops unneeded columns, and streams data without blowing up RAM.",
            isOptimal: true
          },
          {
            id: 'pl-opt-simple',
            label: "It deletes rows randomly to save space",
            learnerSpeechAfter: "Does it just discard records that it cannot fit?",
            guideReaction: "No! Polars maintains 100% data integrity with zero sampling.",
            isOptimal: false
          }
        ]
      },
      reactionMood: 'explaining',
      secondaryNote: 'Interactive choice on Polars architecture'
    },
    {
      id: 'pl-5',
      speaker: 'learner',
      phase: 'explanation',
      level: 2,
      text: "What does 'Lazy Execution' mean in practice?",
      reactionMood: 'curious',
      secondaryNote: 'A asks for the Lazy concept'
    },
    {
      id: 'pl-6',
      speaker: 'guide',
      phase: 'explanation',
      level: 2,
      text: "In Pandas, every line executes eagerly right away. If you filter 10 lines later, it already loaded all 15 GB! In Polars `scan_csv()`, it doesn't load a single byte until you say `.collect()`. It plans the query like an SQL database compiler.",
      reactionMood: 'explaining',
      secondaryNote: 'B explains Lazy vs Eager execution'
    },
    {
      id: 'pl-7',
      speaker: 'guide',
      phase: 'code',
      level: 4,
      text: "Look how clean and lightning-fast Polars query expressions look:",
      codeSnippet: {
        code: `import polars as pl

# 1. Scan lazily (does not load entire 15GB into memory at once!)
query = (
    pl.scan_csv("server_logs.csv")
    .filter(pl.col("status") >= 500)
    .group_by("endpoint")
    .agg([
        pl.len().alias("error_count"),
        pl.col("response_time_ms").mean().alias("avg_latency")
    ])
    .sort("error_count", descending=True)
    .limit(5)
)

# 2. Execute with multi-core Rust engine
result = query.collect()
print(result)`,
        language: 'python',
        filename: 'polars_log_pipeline.py',
        caption: 'Processing multi-gigabyte logs with Polars LazyFrames',
        runnable: true,
        output: `shape: (5, 3)
┌──────────────────┬─────────────┬─────────────┐
│ endpoint         ┆ error_count ┆ avg_latency │
│ ---              ┆ ---         ┆ ---         │
│ str              ┆ u32         ┆ f64         │
╞══════════════════╪═════════════╪═════════════╡
│ /api/v1/checkout ┆ 4812        ┆ 1420.5      │
│ /api/v1/auth     ┆ 1205        ┆ 890.2       │
│ /api/v1/search   ┆ 840         ┆ 310.8       │
└──────────────────┴─────────────┴─────────────┘
[Processed 15GB in 1.4s using 8 CPU cores]`
      },
      reactionMood: 'encouraging',
      secondaryNote: 'Polars LazyFrame snippet'
    },
    {
      id: 'pl-8',
      speaker: 'learner',
      phase: 'practice',
      level: 4,
      text: "15 GB processed in 1.4 seconds on my laptop?! The expression syntax `pl.col('status') >= 500` is so readable, and my RAM stayed under 300 MB.",
      reactionMood: 'satisfied',
      secondaryNote: 'A experiences modern data performance'
    }
  ],
  practiceQuestion: {
    question: "What is the key difference between `pl.read_csv()` and `pl.scan_csv()` in Polars?",
    options: [
      {
        id: 'pl-q1',
        text: "`scan_csv()` builds a lazy query plan that the Rust engine optimizes before reading disk, while `read_csv()` eagerly loads everything into memory immediately.",
        isCorrect: true,
        explanation: "Correct! Lazy execution allows Polars to push down filters and project only needed columns."
      },
      {
        id: 'pl-q2',
        text: "`scan_csv()` converts all numbers into strings.",
        isCorrect: false,
        explanation: "Polars maintains strict Arrow data types for optimal speed."
      },
      {
        id: 'pl-q3',
        text: "`scan_csv()` only works on text files smaller than 1 MB.",
        isCorrect: false,
        explanation: "Lazy scanning is specifically designed for huge datasets larger than RAM."
      }
    ],
    takeaway: "Polars provides 10x-100x faster DataFrame performance through Apache Arrow column layout, multithreading in Rust, and lazy query optimization."
  },
  summaryTakeaway: {
    problem: "Pandas runs out of memory on large datasets due to single-threaded execution and eager in-memory copies.",
    intuition: "An architect reviewing the entire blueprint before ordering materials, rather than ordering the whole store at once.",
    technicalConcept: "Apache Arrow columnar format, multi-threaded Rust execution, and predicate/projection pushdown in lazy query plans.",
    codePattern: "df = pl.scan_csv('data.csv').filter(pl.col('x') > 0).collect()"
  }
};

export const FASTAPI_CONVERSATION: ConversationLesson = {
  id: 'fastapi-conversation',
  slug: 'fastapi',
  topic: 'FastAPI',
  title: 'High-Performance Web APIs',
  tagline: 'How Ayushi built a production REST API with automatic Swagger docs & type validation.',
  category: 'Web & APIs',
  difficulty: 'Intermediate',
  estimatedMinutes: 5,
  learner: {
    name: 'Ayushi',
    role: 'Backend Developer',
    avatarEmoji: '👩',
    avatarBg: 'bg-amber-100 text-amber-800 border-amber-200',
    bio: 'Building an API service for mobile apps and struggling with manual input validation and outdated documentation.'
  },
  guide: {
    name: 'Ayush',
    role: 'Software Engineer',
    avatarEmoji: '👨',
    avatarBg: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    bio: 'Designs microservice architectures with asynchronous Python.'
  },
  turns: [
    {
      id: 'fa-1',
      speaker: 'learner',
      phase: 'problem',
      level: 1,
      text: "Ayush, whenever the frontend mobile app sends malformed JSON to my backend, my server crashes with an unhandled KeyError! Plus, writing API documentation in Postman or markdown takes half my week.",
      reactionMood: 'worried',
      secondaryNote: 'A struggles with payload validation and docs'
    },
    {
      id: 'fa-2',
      speaker: 'guide',
      phase: 'problem',
      level: 1,
      text: "In legacy Python web frameworks, you had to manually inspect `request.json`, write 20 `if/else` checks for types, and write separate Swagger docs that go out of date the next day.",
      reactionMood: 'explaining',
      secondaryNote: 'B outlines the friction of manual validation'
    },
    {
      id: 'fa-3',
      speaker: 'learner',
      phase: 'discovery',
      level: 2,
      text: "Can't Python type hints do the validation and generate documentation automatically?",
      reactionMood: 'curious',
      secondaryNote: 'A asks about type-hint powered APIs'
    },
    {
      id: 'fa-4',
      speaker: 'guide',
      phase: 'discovery',
      level: 2,
      text: "That is the exact philosophy of **FastAPI**.",
      interactiveChoice: {
        prompt: "What makes FastAPI so popular for modern Python backends?",
        options: [
          {
            id: 'fa-opt-types',
            label: "Combines Pydantic type models, native async/await, and instant automatic interactive Swagger UI",
            learnerSpeechAfter: "It uses standard Python type hints for instant request validation and generates interactive documentation for free!",
            guideReaction: "Spot on! You declare your data model once, and FastAPI validates payloads, casts types, and hosts interactive docs at `/docs`.",
            isOptimal: true
          },
          {
            id: 'fa-opt-manual',
            label: "Requires you to write your own web server in C++",
            learnerSpeechAfter: "Do I have to re-implement HTTP protocol parsers?",
            guideReaction: "Not at all. FastAPI runs on top of Starlette and Uvicorn with blazing ASGI async speed.",
            isOptimal: false
          }
        ]
      },
      reactionMood: 'explaining',
      secondaryNote: 'Interactive choice on FastAPI features'
    },
    {
      id: 'fa-5',
      speaker: 'learner',
      phase: 'explanation',
      level: 2,
      text: "What happens if a user passes a string instead of an integer for `price`?",
      reactionMood: 'thinking',
      secondaryNote: 'A asks about validation behavior'
    },
    {
      id: 'fa-6',
      speaker: 'guide',
      phase: 'explanation',
      level: 2,
      text: "FastAPI automatically intercepts it before your function even runs, returning an HTTP 422 Unprocessable Entity error with a crystal-clear JSON explaining exactly which field was wrong.",
      reactionMood: 'explaining',
      secondaryNote: 'B explains automatic 422 error handling'
    },
    {
      id: 'fa-7',
      speaker: 'guide',
      phase: 'code',
      level: 4,
      text: "Look how complete a production endpoint is in just 12 lines:",
      codeSnippet: {
        code: `from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field

app = FastAPI(title="Order Service", version="1.0.0")

class OrderItem(BaseModel):
    name: str
    price: float = Field(gt=0, description="Price must be positive")
    quantity: int = Field(default=1, ge=1)

@app.post("/orders", status_code=201)
async def create_order(item: OrderItem):
    total = item.price * item.quantity
    return {
        "status": "confirmed",
        "item": item.name,
        "total_amount": total
    }

# Visit http://localhost:8000/docs for interactive Swagger UI!`,
        language: 'python',
        filename: 'main_api.py',
        caption: 'FastAPI Endpoint with Pydantic Schema Validation',
        runnable: true,
        output: `INFO:     Started server process [Uvicorn]
INFO:     Application startup complete.
POST /orders HTTP/1.1 201 Created -> {"status":"confirmed","item":"Python Pro License","total_amount":99.0}
Interactive Swagger UI active at: /docs`
      },
      reactionMood: 'encouraging',
      secondaryNote: 'FastAPI code snippet'
    },
    {
      id: 'fa-8',
      speaker: 'learner',
      phase: 'practice',
      level: 4,
      text: "I didn't have to write any manual input checking or open a Swagger editor. I just defined `OrderItem` with type hints, and FastAPI handled validation, serialization, and interactive docs automatically!",
      reactionMood: 'satisfied',
      secondaryNote: 'A celebrates the developer ergonomics'
    }
  ],
  practiceQuestion: {
    question: "Where does FastAPI generate interactive OpenAPI documentation by default when your server starts?",
    options: [
      {
        id: 'fa-q1',
        text: "At the `/docs` endpoint, offering a live interactive Swagger UI where anyone can test endpoints directly in the browser.",
        isCorrect: true,
        explanation: "Correct! FastAPI also provides ReDoc documentation at `/redoc` automatically."
      },
      {
        id: 'fa-q2',
        text: "It emails a PDF to the project manager.",
        isCorrect: false,
        explanation: "FastAPI serves live web-based documentation directly from the application."
      },
      {
        id: 'fa-q3',
        text: "You must pay an external SaaS subscription to see documentation.",
        isCorrect: false,
        explanation: "FastAPI's automatic documentation is completely open-source and built-in."
      }
    ],
    takeaway: "FastAPI eliminates boilerplate in web development through type-driven validation, async ASGI performance, and automatic interactive documentation."
  },
  summaryTakeaway: {
    problem: "Manual request validation and out-of-sync API documentation slow down backend teams.",
    intuition: "A smart receptionist who checks every form entry against strict requirements before letting anyone through.",
    technicalConcept: "ASGI asynchronous execution coupled with Pydantic runtime schema parsing and automatic OpenAPI generation.",
    codePattern: "@app.post('/items')\nasync def create_item(item: ItemModel):\n    return item"
  }
};

export const MASTER_CONVERSATIONS: ConversationLesson[] = [
  PANDAS_CONVERSATION,
  NUMPY_CONVERSATION,
  MATPLOTLIB_CONVERSATION,
  SEABORN_CONVERSATION,
  SCIKIT_LEARN_CONVERSATION,
  PYTORCH_CONVERSATION,
  POLARS_CONVERSATION,
  FASTAPI_CONVERSATION
];
