import React, { useState, useMemo } from 'react';
import { ConversationLesson } from '../types';
import { CharacterAvatar } from './CharacterAvatar';
import {
  Sparkles,
  Zap,
  BarChart3,
  Table,
  Cpu,
  Send,
  Play,
  ArrowRight,
  Shuffle,
  CheckCircle2,
  Sliders,
  TrendingUp,
  RefreshCw,
  Code2,
  Terminal,
  HelpCircle,
  Copy,
  Check
} from 'lucide-react';

interface DashboardPlaygroundProps {
  onStartLesson: (lesson: ConversationLesson) => void;
  lessons: ConversationLesson[];
}

export const DashboardPlayground: React.FC<DashboardPlaygroundProps> = ({
  onStartLesson,
  lessons
}) => {
  // Active interactive toy tab
  const [activeToy, setActiveToy] = useState<'numpy' | 'matplotlib' | 'pandas' | 'pytorch' | 'fastapi'>('numpy');

  // NumPy Playground State
  const [arraySize, setArraySize] = useState<number>(500000);
  const [isBenchmarking, setIsBenchmarking] = useState<boolean>(false);
  const [benchmarkResult, setBenchmarkResult] = useState<{
    pyTime: number;
    npTime: number;
    speedup: number;
  } | null>(null);

  // Matplotlib Playground State
  const [chartType, setChartType] = useState<'line' | 'bar' | 'scatter'>('line');
  const [colorTheme, setColorTheme] = useState<'classic' | 'viridis' | 'sunset'>('viridis');
  const [showGrid, setShowGrid] = useState<boolean>(true);
  const [dataPointsCount, setDataPointsCount] = useState<number>(12);

  // Pandas Playground State
  const [minSpendFilter, setMinSpendFilter] = useState<number>(5000);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // PyTorch Playground State
  const [tensorDims, setTensorDims] = useState<'2x3' | '3x3' | '1x5'>('2x3');
  const [activation, setActivation] = useState<'relu' | 'sigmoid' | 'pow2'>('relu');
  const [hasBackwardRun, setHasBackwardRun] = useState<boolean>(false);

  // FastAPI Playground State
  const [apiEndpoint, setApiEndpoint] = useState<string>('/items/42');
  const [apiStatus, setApiStatus] = useState<number | null>(null);
  const [apiLatency, setApiLatency] = useState<number | null>(null);
  const [isCallingApi, setIsCallingApi] = useState<boolean>(false);

  // Interactive Avatar Talk State
  const [avatarBanter, setAvatarBanter] = useState<{
    speaker: 'Ayushi' | 'Ayush';
    text: string;
  }>({
    speaker: 'Ayush',
    text: 'Click on any library tab to test live Python mechanics with real numbers and visuals!'
  });

  // Copied state
  const [copiedCode, setCopiedCode] = useState<boolean>(false);

  // Lucky Dip state
  const [isSpinning, setIsSpinning] = useState<boolean>(false);

  // Run NumPy Benchmark simulation
  const runNumpyBenchmark = () => {
    setIsBenchmarking(true);
    setBenchmarkResult(null);
    setAvatarBanter({
      speaker: 'Ayushi',
      text: `Testing ${arraySize.toLocaleString()} numbers! Watch the CPU loop vs compiled C vectorization...`
    });

    setTimeout(() => {
      // Simulate realistic execution timing
      const purePyMs = Math.round((arraySize / 10000) * 1.8);
      const npMs = Math.max(0.4, Number(((arraySize / 10000) * 0.022).toFixed(2)));
      const speedup = Math.round(purePyMs / npMs);

      setBenchmarkResult({
        pyTime: purePyMs,
        npTime: npMs,
        speedup: speedup
      });
      setIsBenchmarking(false);
      setAvatarBanter({
        speaker: 'Ayush',
        text: `⚡ NumPy was ${speedup}x faster! That's SIMD vectorization at work in continuous C memory.`
      });
    }, 600);
  };

  // Run FastAPI simulation
  const handleCallApi = () => {
    setIsCallingApi(true);
    setApiStatus(null);
    setTimeout(() => {
      setIsCallingApi(false);
      setApiStatus(200);
      setApiLatency(Math.floor(Math.random() * 8) + 2);
      setAvatarBanter({
        speaker: 'Ayushi',
        text: 'HTTP 200 OK in under 10ms! FastAPI parsed the type hints and validated the query params automatically.'
      });
    }, 350);
  };

  // Run PyTorch Backpropagation simulation
  const handleRunBackward = () => {
    setHasBackwardRun(true);
    setAvatarBanter({
      speaker: 'Ayush',
      text: 'Autograd traced the graph backwards and computed dLoss/dWeight for all matrix cells simultaneously!'
    });
  };

  // Spin the wheel / Lucky Dip
  const handleLuckyDip = () => {
    setIsSpinning(true);
    const audioLibraries = lessons.filter(l => l.topic);
    let counter = 0;
    const interval = setInterval(() => {
      counter++;
      const rand = audioLibraries[Math.floor(Math.random() * audioLibraries.length)];
      setAvatarBanter({
        speaker: 'Ayushi',
        text: `Rolling... how about ${rand.topic}?`
      });
      if (counter >= 6) {
        clearInterval(interval);
        setIsSpinning(false);
        const finalPick = audioLibraries[Math.floor(Math.random() * audioLibraries.length)];
        setAvatarBanter({
          speaker: 'Ayush',
          text: `🎉 Selected ${finalPick.topic}! Let's jump into the dialogue!`
        });
        setTimeout(() => {
          onStartLesson(finalPick);
        }, 500);
      }
    }, 120);
  };

  // Sample data for Pandas
  const samplePandasRows = [
    { id: 101, name: 'Priya Sharma', category: 'Enterprise', spend: 14500, orders: 12 },
    { id: 102, name: 'Rohan Mehta', category: 'Cloud Services', spend: 22000, orders: 18 },
    { id: 103, name: 'Aarav Gupta', category: 'Hardware', spend: 3200, orders: 2 },
    { id: 104, name: 'Sneha Patel', category: 'Enterprise', spend: 18750, orders: 14 },
    { id: 105, name: 'Vikram Singh', category: 'Cloud Services', spend: 11200, orders: 9 },
    { id: 106, name: 'Neha Reddy', category: 'Hardware', spend: 4500, orders: 3 },
    { id: 107, name: 'Karan Joshi', category: 'Enterprise', spend: 29000, orders: 24 },
    { id: 108, name: 'Ananya Verma', category: 'Cloud Services', spend: 8900, orders: 7 }
  ];

  const filteredPandasRows = useMemo(() => {
    return samplePandasRows.filter(r => {
      const matchCategory = selectedCategory === 'All' || r.category === selectedCategory;
      const matchSpend = r.spend >= minSpendFilter;
      return matchCategory && matchSpend;
    });
  }, [selectedCategory, minSpendFilter]);

  // Copy code utility
  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  // Find matching lesson for active toy
  const activeLessonForToy = useMemo(() => {
    const keyMap: Record<string, string> = {
      numpy: 'NumPy',
      matplotlib: 'Matplotlib',
      pandas: 'Pandas',
      pytorch: 'PyTorch',
      fastapi: 'FastAPI'
    };
    const target = keyMap[activeToy];
    return lessons.find(l => l.topic.toLowerCase().includes(target.toLowerCase())) || lessons[0];
  }, [activeToy, lessons]);

  return (
    <section className="w-full max-w-5xl mx-auto px-4 sm:px-8 py-10 sm:py-14">
      {/* Playground Header */}
      <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF4EB] border border-[#E8DCCB] text-xs font-serif text-[#8C6D4F] mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#D4A373]" />
            <span>Interactive Library Playground</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1A1A1A]">
            Tinker with Python Libraries Live
          </h2>
          <p className="font-serif text-xs sm:text-sm text-[#666] mt-1 max-w-xl">
            Test real library mechanics with sliders, benchmarks, and reactive visualizers before reading the dialogues.
          </p>
        </div>

        {/* Playful Surprise Me Lucky Dip */}
        <button
          onClick={handleLuckyDip}
          disabled={isSpinning}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[#F4EFE6] hover:bg-[#EAE4D5] border border-[#DDD7C8] text-[#1A1A1A] font-serif text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-98"
          title="Pick a random Python library dialogue"
        >
          <Shuffle className={`w-3.5 h-3.5 text-[#8C6D4F] ${isSpinning ? 'animate-spin' : ''}`} />
          <span>{isSpinning ? 'Rolling Library...' : 'Surprise Dialogue!'}</span>
        </button>
      </div>

      {/* Interactive Banter Bar */}
      <div className="mb-6 p-4 rounded-2xl bg-[#FDFCF7] border border-[#E8DFC9] shadow-xs flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div
            className="cursor-pointer transition-transform hover:scale-105"
            onClick={() => {
              const quotes = [
                "NumPy stores arrays contiguously in C memory!",
                "In Pandas, boolean masking avoids slow Python for-loops entirely.",
                "PyTorch tensors can run on GPUs with a simple .to('cuda') call!",
                "Matplotlib's Figure is the canvas; the Axes is the coordinate paper.",
                "FastAPI validates everything through Python 3.10+ type hints!"
              ];
              setAvatarBanter({
                speaker: 'Ayushi',
                text: quotes[Math.floor(Math.random() * quotes.length)]
              });
            }}
            title="Click Ayushi for a Python library tip"
          >
            <CharacterAvatar character={avatarBanter.speaker} size="sm" isSpeaking={true} />
          </div>
          <div className="text-xs sm:text-sm font-serif">
            <span className="font-bold text-[#1A1A1A] mr-2">{avatarBanter.speaker}:</span>
            <span className="text-[#555] italic">"{avatarBanter.text}"</span>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-1.5 text-[11px] font-serif text-[#8C6D4F] bg-[#FAF4EB] px-2.5 py-1 rounded-lg border border-[#E8DCCB] shrink-0">
          <Sliders className="w-3 h-3 text-[#D4A373]" />
          <span>Interactive Sandbox</span>
        </div>
      </div>

      {/* Main Interactive Toy Container */}
      <div className="rounded-3xl bg-[#FDFCF7] border border-[#E2DAC9] shadow-lg overflow-hidden flex flex-col">
        {/* Tab Navigation for Libraries */}
        <div className="bg-[#FAF7F0] border-b border-[#EAE4D5] px-4 pt-3 flex items-center gap-1 sm:gap-2 overflow-x-auto no-scrollbar">
          <button
            onClick={() => {
              setActiveToy('numpy');
              setAvatarBanter({
                speaker: 'Ayush',
                text: 'Drag the array size slider and see NumPy beat pure Python loops by 80x!'
              });
            }}
            className={`flex items-center gap-2 px-3.5 sm:px-4 py-2.5 rounded-t-xl text-xs font-serif font-bold transition-all cursor-pointer shrink-0 border-t border-x ${
              activeToy === 'numpy'
                ? 'bg-[#FDFCF7] border-[#E2DAC9] text-[#1A1A1A] shadow-xs'
                : 'border-transparent text-[#666] hover:text-[#1A1A1A] hover:bg-[#F2ECE1]/60'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-[#4D7C0F]" />
            <span>NumPy Speedometer</span>
          </button>

          <button
            onClick={() => {
              setActiveToy('matplotlib');
              setAvatarBanter({
                speaker: 'Ayushi',
                text: 'Change the chart type and palette to see how Matplotlib plots scientific graphs!'
              });
            }}
            className={`flex items-center gap-2 px-3.5 sm:px-4 py-2.5 rounded-t-xl text-xs font-serif font-bold transition-all cursor-pointer shrink-0 border-t border-x ${
              activeToy === 'matplotlib'
                ? 'bg-[#FDFCF7] border-[#E2DAC9] text-[#1A1A1A] shadow-xs'
                : 'border-transparent text-[#666] hover:text-[#1A1A1A] hover:bg-[#F2ECE1]/60'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5 text-[#1D4ED8]" />
            <span>Matplotlib Visualizer</span>
          </button>

          <button
            onClick={() => {
              setActiveToy('pandas');
              setAvatarBanter({
                speaker: 'Ayush',
                text: 'Slide the spend filter to watch Pandas Boolean Masking filter records in 1ms!'
              });
            }}
            className={`flex items-center gap-2 px-3.5 sm:px-4 py-2.5 rounded-t-xl text-xs font-serif font-bold transition-all cursor-pointer shrink-0 border-t border-x ${
              activeToy === 'pandas'
                ? 'bg-[#FDFCF7] border-[#E2DAC9] text-[#1A1A1A] shadow-xs'
                : 'border-transparent text-[#666] hover:text-[#1A1A1A] hover:bg-[#F2ECE1]/60'
            }`}
          >
            <Table className="w-3.5 h-3.5 text-[#D97706]" />
            <span>Pandas Slicer</span>
          </button>

          <button
            onClick={() => {
              setActiveToy('pytorch');
              setAvatarBanter({
                speaker: 'Ayush',
                text: 'Click Run .backward() to watch PyTorch Autograd compute gradients across tensor weights.'
              });
            }}
            className={`flex items-center gap-2 px-3.5 sm:px-4 py-2.5 rounded-t-xl text-xs font-serif font-bold transition-all cursor-pointer shrink-0 border-t border-x ${
              activeToy === 'pytorch'
                ? 'bg-[#FDFCF7] border-[#E2DAC9] text-[#1A1A1A] shadow-xs'
                : 'border-transparent text-[#666] hover:text-[#1A1A1A] hover:bg-[#F2ECE1]/60'
            }`}
          >
            <Cpu className="w-3.5 h-3.5 text-[#EA580C]" />
            <span>PyTorch Tensor Graph</span>
          </button>

          <button
            onClick={() => {
              setActiveToy('fastapi');
              setAvatarBanter({
                speaker: 'Ayushi',
                text: 'Hit Send Request to test a live simulated FastAPI endpoint with type validation!'
              });
            }}
            className={`flex items-center gap-2 px-3.5 sm:px-4 py-2.5 rounded-t-xl text-xs font-serif font-bold transition-all cursor-pointer shrink-0 border-t border-x ${
              activeToy === 'fastapi'
                ? 'bg-[#FDFCF7] border-[#E2DAC9] text-[#1A1A1A] shadow-xs'
                : 'border-transparent text-[#666] hover:text-[#1A1A1A] hover:bg-[#F2ECE1]/60'
            }`}
          >
            <Send className="w-3.5 h-3.5 text-[#0D9488]" />
            <span>FastAPI Tester</span>
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="p-6 sm:p-8">
          {/* TOY 1: NumPy Speedometer */}
          {activeToy === 'numpy' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-6 space-y-5">
                <div>
                  <h3 className="font-serif text-lg font-bold text-[#1A1A1A] flex items-center gap-2">
                    <span>Pure Python Loop vs. NumPy Vectorized SIMD</span>
                  </h3>
                  <p className="text-xs text-[#666] font-serif mt-1">
                    Calculate <code className="bg-[#FAF4EB] px-1.5 py-0.5 rounded text-[#8C6D4F] font-mono">y = (x - mean) / std</code> across thousands of floating point numbers.
                  </p>
                </div>

                {/* Slider Control */}
                <div className="p-4 rounded-2xl bg-[#FAF7F0] border border-[#EAE4D5] space-y-2">
                  <div className="flex justify-between text-xs font-serif">
                    <span className="font-bold text-[#333]">Array Element Count:</span>
                    <span className="font-mono font-bold text-[#8C6D4F]">{arraySize.toLocaleString()} floats</span>
                  </div>
                  <input
                    type="range"
                    min={50000}
                    max={2000000}
                    step={50000}
                    value={arraySize}
                    onChange={(e) => setArraySize(Number(e.target.value))}
                    className="w-full accent-[#8C6D4F] cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-[#888] font-serif">
                    <span>50K elements</span>
                    <span>1 Million</span>
                    <span>2 Million</span>
                  </div>
                </div>

                {/* Benchmark Trigger Button */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={runNumpyBenchmark}
                    disabled={isBenchmarking}
                    className="flex-1 flex items-center justify-center gap-2 py-3 px-5 rounded-xl bg-[#1A1A1A] hover:bg-[#333] text-[#FDFCF7] font-serif text-xs font-bold transition-all cursor-pointer shadow-md active:scale-98 disabled:opacity-50"
                  >
                    <Play className={`w-3.5 h-3.5 fill-current ${isBenchmarking ? 'animate-spin' : ''}`} />
                    <span>{isBenchmarking ? 'Calculating Vectors in C...' : 'Run Live Benchmark'}</span>
                  </button>

                  <button
                    onClick={() => handleCopyCode(`import numpy as np\ndata = np.random.randn(${arraySize})\nnormalized = (data - data.mean()) / data.std()`)}
                    className="p-3 rounded-xl bg-[#FAF4EB] hover:bg-[#F2ECE1] border border-[#E8DCCB] text-[#8C6D4F] text-xs font-serif transition-colors cursor-pointer"
                    title="Copy Python Code"
                  >
                    {copiedCode ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>

                {/* Code Preview */}
                <div className="p-3 rounded-xl bg-[#1A1A1A] text-[#FDFCF7] font-mono text-xs border border-[#333]">
                  <div className="text-[10px] text-[#888] mb-1 font-serif"># Equivalent NumPy Vectorized Call</div>
                  <span className="text-[#60A5FA]">import</span> numpy <span className="text-[#60A5FA]">as</span> np<br />
                  data = np.random.randn({arraySize.toLocaleString()})<br />
                  res = (data - data.mean()) / data.std() <span className="text-[#A7F3D0]"># 1 line!</span>
                </div>
              </div>

              {/* Benchmark Visualizer Gauge */}
              <div className="lg:col-span-6 p-6 rounded-2xl bg-[#FAF7F0] border border-[#E5DFD0] flex flex-col justify-between h-full">
                <div className="border-b border-[#E8DFC9] pb-3 mb-4 flex items-center justify-between">
                  <span className="text-xs uppercase font-bold tracking-wider text-[#8C6D4F] font-serif">
                    Benchmark Results
                  </span>
                  <span className="text-[10px] bg-[#FAF4EB] text-[#8C6D4F] px-2 py-0.5 rounded border border-[#E8DCCB]">
                    Hardware SIMD
                  </span>
                </div>

                {benchmarkResult ? (
                  <div className="space-y-4">
                    {/* Pure Python Bar */}
                    <div>
                      <div className="flex justify-between text-xs font-serif mb-1">
                        <span className="text-[#666]">Pure Python `[for x in list]`</span>
                        <span className="font-mono text-red-600 font-bold">{benchmarkResult.pyTime} ms</span>
                      </div>
                      <div className="w-full h-3 bg-[#E5DFD0] rounded-full overflow-hidden">
                        <div className="h-full bg-red-400 rounded-full w-full" />
                      </div>
                    </div>

                    {/* NumPy Bar */}
                    <div>
                      <div className="flex justify-between text-xs font-serif mb-1">
                        <span className="font-bold text-[#1A1A1A]">NumPy `ndarray` (C-Engine)</span>
                        <span className="font-mono text-emerald-700 font-bold">{benchmarkResult.npTime} ms</span>
                      </div>
                      <div className="w-full h-3 bg-[#E5DFD0] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                          style={{ width: `${Math.max(2, (benchmarkResult.npTime / benchmarkResult.pyTime) * 100)}%` }}
                        />
                      </div>
                    </div>

                    {/* Speedup Badge */}
                    <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-center space-y-1">
                      <div className="text-2xl sm:text-3xl font-bold font-serif text-emerald-800">
                        ⚡ {benchmarkResult.speedup}x Faster
                      </div>
                      <p className="text-xs font-serif text-emerald-700">
                        NumPy bypasses Python object wrapping and executes in compiled C memory!
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="py-12 flex flex-col items-center justify-center text-center space-y-2 text-[#888]">
                    <Zap className="w-8 h-8 text-[#D4A373] animate-pulse" />
                    <p className="text-xs font-serif">
                      Click <strong className="text-[#1A1A1A]">Run Live Benchmark</strong> to simulate processing {arraySize.toLocaleString()} numbers!
                    </p>
                  </div>
                )}

                {/* Jump to Full Dialogue Button */}
                <div className="mt-6 pt-4 border-t border-[#E8DFC9] flex justify-end">
                  <button
                    onClick={() => onStartLesson(activeLessonForToy)}
                    className="flex items-center gap-1.5 text-xs font-bold font-serif text-[#8C6D4F] hover:text-[#1A1A1A] transition-colors cursor-pointer"
                  >
                    <span>Read Ayushi & Ayush's NumPy Dialogue</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TOY 2: Matplotlib Visualizer */}
          {activeToy === 'matplotlib' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-5 space-y-5">
                <div>
                  <h3 className="font-serif text-lg font-bold text-[#1A1A1A]">
                    Interactive Matplotlib Sketcher
                  </h3>
                  <p className="text-xs text-[#666] font-serif mt-1">
                    Toggle chart styles and color palettes to see how <code className="bg-[#FAF4EB] px-1 py-0.5 rounded text-[#8C6D4F] font-mono">plt.subplots()</code> creates figures.
                  </p>
                </div>

                {/* Chart Type Picker */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold font-serif text-[#333]">Plot Kind:</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['line', 'bar', 'scatter'] as const).map((type) => (
                      <button
                        key={type}
                        onClick={() => setChartType(type)}
                        className={`py-2 px-3 rounded-xl text-xs font-serif capitalize border transition-all cursor-pointer ${
                          chartType === type
                            ? 'bg-[#1A1A1A] text-[#FDFCF7] border-[#1A1A1A]'
                            : 'bg-[#FAF7F0] hover:bg-[#F2ECE1] text-[#666] border-[#E5DFD0]'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Palette Picker */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold font-serif text-[#333]">Colormap Style:</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['viridis', 'sunset', 'classic'] as const).map((theme) => (
                      <button
                        key={theme}
                        onClick={() => setColorTheme(theme)}
                        className={`py-2 px-3 rounded-xl text-xs font-serif capitalize border transition-all cursor-pointer ${
                          colorTheme === theme
                            ? 'bg-[#FAF4EB] border-[#8C6D4F] text-[#8C6D4F] font-bold'
                            : 'bg-[#FAF7F0] hover:bg-[#F2ECE1] text-[#666] border-[#E5DFD0]'
                        }`}
                      >
                        {theme}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Grid Checkbox */}
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="grid-toggle"
                    checked={showGrid}
                    onChange={(e) => setShowGrid(e.target.checked)}
                    className="accent-[#8C6D4F] cursor-pointer"
                  />
                  <label htmlFor="grid-toggle" className="text-xs font-serif text-[#444] cursor-pointer">
                    Enable Coordinate Grid (<code className="font-mono text-[11px]">ax.grid(True)</code>)
                  </label>
                </div>

                {/* Python Snippet */}
                <div className="p-3 rounded-xl bg-[#1A1A1A] text-[#FDFCF7] font-mono text-xs border border-[#333]">
                  <span className="text-[#60A5FA]">import</span> matplotlib.pyplot <span className="text-[#60A5FA]">as</span> plt<br />
                  fig, ax = plt.subplots(figsize=(6, 4))<br />
                  ax.{chartType}(x, y, color="{colorTheme === 'viridis' ? '#2E6F40' : colorTheme === 'sunset' ? '#EA580C' : '#1D4ED8'}")<br />
                  {showGrid && <span>ax.grid(<span className="text-[#A7F3D0]">True</span>, alpha=0.3)<br /></span>}
                  plt.savefig(<span className="text-[#FDE047]">"plot.png"</span>, dpi=300)
                </div>
              </div>

              {/* Dynamic SVG Plot Render */}
              <div className="lg:col-span-7 p-6 rounded-2xl bg-[#FAF7F0] border border-[#E5DFD0] flex flex-col justify-between">
                <div className="flex items-center justify-between border-b border-[#E8DFC9] pb-3 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-serif font-bold text-[#1A1A1A]">Figure 1: `ax.plot()` Canvas</span>
                    <span className="text-[10px] font-mono text-[#8C6D4F] bg-[#FAF4EB] px-2 py-0.5 rounded border border-[#E8DCCB]">DPI: 300</span>
                  </div>
                  <span className="text-[10px] text-[#777] font-serif">Interactive SVG Render</span>
                </div>

                {/* Dynamic SVG Canvas */}
                <div className="w-full h-56 bg-white rounded-xl border border-[#E0D8C8] p-4 flex items-center justify-center relative overflow-hidden">
                  <svg className="w-full h-full" viewBox="0 0 400 200">
                    {/* Grid lines */}
                    {showGrid && (
                      <g stroke="#EAE4D5" strokeDasharray="3,3" strokeWidth="1">
                        <line x1="40" y1="20" x2="380" y2="20" />
                        <line x1="40" y1="60" x2="380" y2="60" />
                        <line x1="40" y1="100" x2="380" y2="100" />
                        <line x1="40" y1="140" x2="380" y2="140" />
                        <line x1="40" y1="180" x2="380" y2="180" />
                        
                        <line x1="40" y1="20" x2="40" y2="180" />
                        <line x1="125" y1="20" x2="125" y2="180" />
                        <line x1="210" y1="20" x2="210" y2="180" />
                        <line x1="295" y1="20" x2="295" y2="180" />
                        <line x1="380" y1="20" x2="380" y2="180" />
                      </g>
                    )}

                    {/* Coordinate Axes */}
                    <line x1="40" y1="180" x2="380" y2="180" stroke="#888" strokeWidth="1.5" />
                    <line x1="40" y1="20" x2="40" y2="180" stroke="#888" strokeWidth="1.5" />

                    {/* Chart rendering based on type */}
                    {chartType === 'line' && (
                      <path
                        d="M 50,150 Q 110,30 170,110 T 290,40 T 370,140"
                        fill="none"
                        stroke={colorTheme === 'viridis' ? '#2E6F40' : colorTheme === 'sunset' ? '#EA580C' : '#1D4ED8'}
                        strokeWidth="3"
                        strokeLinecap="round"
                      />
                    )}

                    {chartType === 'bar' && (
                      <g fill={colorTheme === 'viridis' ? '#2E6F40' : colorTheme === 'sunset' ? '#EA580C' : '#1D4ED8'}>
                        <rect x="65" y="70" width="28" height="110" rx="3" />
                        <rect x="125" y="110" width="28" height="70" rx="3" />
                        <rect x="185" y="40" width="28" height="140" rx="3" />
                        <rect x="245" y="85" width="28" height="95" rx="3" />
                        <rect x="305" y="55" width="28" height="125" rx="3" />
                      </g>
                    )}

                    {chartType === 'scatter' && (
                      <g fill={colorTheme === 'viridis' ? '#2E6F40' : colorTheme === 'sunset' ? '#EA580C' : '#1D4ED8'}>
                        {[
                          [70, 140], [90, 110], [120, 130], [150, 80],
                          [180, 95], [210, 60], [240, 75], [270, 45],
                          [300, 60], [330, 35], [360, 50]
                        ].map(([cx, cy], i) => (
                          <circle key={i} cx={cx} cy={cy} r="5" stroke="#FFF" strokeWidth="1.5" />
                        ))}
                      </g>
                    )}

                    {/* Axis Labels */}
                    <text x="360" y="195" fontSize="10" fill="#777" fontFamily="sans-serif">Epoch</text>
                    <text x="15" y="30" fontSize="10" fill="#777" fontFamily="sans-serif">Loss</text>
                  </svg>
                </div>

                <div className="mt-4 pt-3 border-t border-[#E8DFC9] flex justify-between items-center">
                  <span className="text-[11px] font-serif text-[#666]">
                    Generated with <strong>Matplotlib OO API</strong>
                  </span>
                  <button
                    onClick={() => onStartLesson(activeLessonForToy)}
                    className="flex items-center gap-1.5 text-xs font-bold font-serif text-[#8C6D4F] hover:text-[#1A1A1A] transition-colors cursor-pointer"
                  >
                    <span>Read Matplotlib Dialogue</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TOY 3: Pandas Slicer */}
          {activeToy === 'pandas' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-serif text-lg font-bold text-[#1A1A1A]">
                    Live Pandas Boolean Indexing
                  </h3>
                  <p className="text-xs text-[#666] font-serif">
                    Filter 10,000 rows in 1 line with <code className="bg-[#FAF4EB] px-1 py-0.5 rounded text-[#8C6D4F] font-mono">df[df['spend'] &gt;= {minSpendFilter}]</code>
                  </p>
                </div>

                {/* Filter Controls */}
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex items-center gap-2 bg-[#FAF7F0] px-3 py-1.5 rounded-xl border border-[#EAE4D5]">
                    <span className="text-xs font-serif text-[#666]">Category:</span>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="text-xs font-serif font-bold text-[#1A1A1A] bg-transparent outline-none cursor-pointer"
                    >
                      <option value="All">All Categories</option>
                      <option value="Enterprise">Enterprise</option>
                      <option value="Cloud Services">Cloud Services</option>
                      <option value="Hardware">Hardware</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-2 bg-[#FAF7F0] px-3 py-1.5 rounded-xl border border-[#EAE4D5]">
                    <span className="text-xs font-serif text-[#666]">Min Spend:</span>
                    <span className="font-mono text-xs font-bold text-[#8C6D4F]">₹{minSpendFilter.toLocaleString()}</span>
                    <input
                      type="range"
                      min={0}
                      max={25000}
                      step={1000}
                      value={minSpendFilter}
                      onChange={(e) => setMinSpendFilter(Number(e.target.value))}
                      className="w-24 accent-[#8C6D4F] cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* Data Table */}
              <div className="rounded-2xl border border-[#E5DFD0] overflow-hidden bg-white shadow-xs">
                <table className="w-full text-left text-xs font-serif">
                  <thead className="bg-[#FAF7F0] border-b border-[#E5DFD0] text-[#555] uppercase text-[10px] tracking-wider font-bold">
                    <tr>
                      <th className="py-2.5 px-4">ID</th>
                      <th className="py-2.5 px-4">Customer</th>
                      <th className="py-2.5 px-4">Category</th>
                      <th className="py-2.5 px-4 text-right">Spend (INR)</th>
                      <th className="py-2.5 px-4 text-right">Orders</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F2ECE1]">
                    {filteredPandasRows.map((row) => (
                      <tr key={row.id} className="hover:bg-[#FAF6EE] transition-colors">
                        <td className="py-2.5 px-4 font-mono text-[#888]">{row.id}</td>
                        <td className="py-2.5 px-4 font-bold text-[#1A1A1A]">{row.name}</td>
                        <td className="py-2.5 px-4">
                          <span className="px-2 py-0.5 rounded-md bg-[#FAF4EB] text-[#8C6D4F] text-[10px] border border-[#E8DCCB]">
                            {row.category}
                          </span>
                        </td>
                        <td className="py-2.5 px-4 text-right font-mono font-bold text-[#1A1A1A]">
                          ₹{row.spend.toLocaleString()}
                        </td>
                        <td className="py-2.5 px-4 text-right font-mono text-[#666]">{row.orders}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filteredPandasRows.length === 0 && (
                  <div className="py-8 text-center text-xs text-[#888] font-serif">
                    No records match the active Boolean filter. Try lowering the minimum spend slider.
                  </div>
                )}
              </div>

              {/* Status and Action */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                <span className="text-xs font-serif text-[#666]">
                  Showing <strong>{filteredPandasRows.length}</strong> of {samplePandasRows.length} rows matched in <strong>0.001s</strong> via C-Engine vector indexing.
                </span>
                <button
                  onClick={() => onStartLesson(activeLessonForToy)}
                  className="flex items-center gap-1.5 text-xs font-bold font-serif text-[#8C6D4F] hover:text-[#1A1A1A] transition-colors cursor-pointer"
                >
                  <span>Read Pandas Conversation with Ayushi</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* TOY 4: PyTorch Tensor Graph */}
          {activeToy === 'pytorch' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-6 space-y-5">
                <div>
                  <h3 className="font-serif text-lg font-bold text-[#1A1A1A]">
                    PyTorch Tensor & Autograd Graph
                  </h3>
                  <p className="text-xs text-[#666] font-serif mt-1">
                    See how PyTorch tracks gradients across weight matrices and computes backpropagation with <code className="bg-[#FAF4EB] px-1 py-0.5 rounded text-[#8C6D4F] font-mono">loss.backward()</code>.
                  </p>
                </div>

                {/* Dimension Picker */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold font-serif text-[#333]">Tensor Shape:</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['2x3', '3x3', '1x5'] as const).map((dim) => (
                      <button
                        key={dim}
                        onClick={() => {
                          setTensorDims(dim);
                          setHasBackwardRun(false);
                        }}
                        className={`py-2 px-3 rounded-xl text-xs font-mono border transition-all cursor-pointer ${
                          tensorDims === dim
                            ? 'bg-[#1A1A1A] text-[#FDFCF7] border-[#1A1A1A]'
                            : 'bg-[#FAF7F0] hover:bg-[#F2ECE1] text-[#666] border-[#E5DFD0]'
                        }`}
                      >
                        shape [{dim.replace('x', ', ')}]
                      </button>
                    ))}
                  </div>
                </div>

                {/* Activation */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold font-serif text-[#333]">Non-linear Activation:</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['relu', 'sigmoid', 'pow2'] as const).map((act) => (
                      <button
                        key={act}
                        onClick={() => {
                          setActivation(act);
                          setHasBackwardRun(false);
                        }}
                        className={`py-2 px-3 rounded-xl text-xs font-mono border transition-all cursor-pointer ${
                          activation === act
                            ? 'bg-[#FAF4EB] border-[#8C6D4F] text-[#8C6D4F] font-bold'
                            : 'bg-[#FAF7F0] hover:bg-[#F2ECE1] text-[#666] border-[#E5DFD0]'
                        }`}
                      >
                        F.{act}()
                      </button>
                    ))}
                  </div>
                </div>

                {/* Backward Button */}
                <button
                  onClick={handleRunBackward}
                  className="w-full flex items-center justify-center gap-2 py-3 px-5 rounded-xl bg-[#EA580C] hover:bg-[#C2410C] text-[#FDFCF7] font-serif text-xs font-bold transition-all cursor-pointer shadow-md active:scale-98"
                >
                  <Zap className="w-4 h-4" />
                  <span>Execute loss.backward() (Autograd)</span>
                </button>
              </div>

              {/* Tensor Weight Grid Visualizer */}
              <div className="lg:col-span-6 p-6 rounded-2xl bg-[#FAF7F0] border border-[#E5DFD0] flex flex-col justify-between">
                <div className="flex items-center justify-between border-b border-[#E8DFC9] pb-3 mb-4">
                  <span className="text-xs uppercase font-bold tracking-wider text-[#8C6D4F] font-serif">
                    Tensor Weights & Calculated Gradients
                  </span>
                  <span className="text-[10px] font-mono bg-[#FAF4EB] text-[#8C6D4F] px-2 py-0.5 rounded border border-[#E8DCCB]">
                    device: cuda:0
                  </span>
                </div>

                {/* Interactive Matrix Cells */}
                <div className="p-4 bg-white rounded-xl border border-[#E0D8C8] space-y-3">
                  <div className="text-xs font-mono text-[#666] flex justify-between">
                    <span>torch.Tensor(shape=[{tensorDims.replace('x', ', ')}])</span>
                    <span>requires_grad=True</span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 py-2">
                    {[0.42, -0.85, 1.24, 0.12, 0.94, -0.31, 0.77, 1.50, -0.19].slice(0, tensorDims === '2x3' ? 6 : tensorDims === '3x3' ? 9 : 5).map((val, i) => (
                      <div
                        key={i}
                        className={`p-3 rounded-lg border text-center transition-all duration-300 ${
                          hasBackwardRun
                            ? 'bg-amber-50 border-amber-300 text-amber-900 shadow-xs'
                            : 'bg-[#FAF7F0] border-[#E8DFC9] text-[#1A1A1A]'
                        }`}
                      >
                        <div className="font-mono text-xs font-bold">{val > 0 ? `+${val}` : val}</div>
                        {hasBackwardRun && (
                          <div className="text-[10px] font-mono text-[#D97706] mt-0.5">
                            grad: {(val * 0.35).toFixed(3)}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {hasBackwardRun && (
                    <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-[11px] font-serif text-emerald-800 flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>Backpropagation complete! Gradients populated in <code className="font-mono">.grad</code></span>
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-[#E8DFC9] flex justify-end">
                  <button
                    onClick={() => onStartLesson(activeLessonForToy)}
                    className="flex items-center gap-1.5 text-xs font-bold font-serif text-[#8C6D4F] hover:text-[#1A1A1A] transition-colors cursor-pointer"
                  >
                    <span>Explore Full PyTorch Dialogue</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TOY 5: FastAPI Tester */}
          {activeToy === 'fastapi' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-6 space-y-5">
                <div>
                  <h3 className="font-serif text-lg font-bold text-[#1A1A1A]">
                    FastAPI Simulated Swagger UI
                  </h3>
                  <p className="text-xs text-[#666] font-serif mt-1">
                    Notice how FastAPI uses Python type hints for instant request parsing, serialization, and automatic documentation at <code className="bg-[#FAF4EB] px-1 py-0.5 rounded text-[#8C6D4F] font-mono">/docs</code>.
                  </p>
                </div>

                {/* Endpoint Selector */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold font-serif text-[#333]">Endpoint to Test:</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { path: '/items/42', method: 'GET' },
                      { path: '/predict', method: 'POST' },
                      { path: '/health', method: 'GET' }
                    ].map((ep) => (
                      <button
                        key={ep.path}
                        onClick={() => {
                          setApiEndpoint(ep.path);
                          setApiStatus(null);
                        }}
                        className={`py-2 px-2.5 rounded-xl text-xs font-mono border transition-all cursor-pointer truncate ${
                          apiEndpoint === ep.path
                            ? 'bg-[#1A1A1A] text-[#FDFCF7] border-[#1A1A1A]'
                            : 'bg-[#FAF7F0] hover:bg-[#F2ECE1] text-[#666] border-[#E5DFD0]'
                        }`}
                      >
                        <span className="text-[10px] text-[#D4A373] mr-1">{ep.method}</span>
                        {ep.path}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Request Button */}
                <button
                  onClick={handleCallApi}
                  disabled={isCallingApi}
                  className="w-full flex items-center justify-center gap-2 py-3 px-5 rounded-xl bg-[#0D9488] hover:bg-[#0F766E] text-[#FDFCF7] font-serif text-xs font-bold transition-all cursor-pointer shadow-md active:scale-98 disabled:opacity-50"
                >
                  <Send className={`w-3.5 h-3.5 ${isCallingApi ? 'animate-spin' : ''}`} />
                  <span>{isCallingApi ? 'Sending Async Request...' : `Send Request to ${apiEndpoint}`}</span>
                </button>
              </div>

              {/* Response Inspector */}
              <div className="lg:col-span-6 p-6 rounded-2xl bg-[#FAF7F0] border border-[#E5DFD0] flex flex-col justify-between">
                <div className="flex items-center justify-between border-b border-[#E8DFC9] pb-3 mb-4">
                  <span className="text-xs uppercase font-bold tracking-wider text-[#8C6D4F] font-serif">
                    Live Response Payload
                  </span>
                  {apiStatus && (
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                        HTTP {apiStatus} OK
                      </span>
                      <span className="text-[10px] text-[#666] font-mono">{apiLatency} ms</span>
                    </div>
                  )}
                </div>

                {/* JSON Body */}
                <div className="p-4 bg-[#1A1A1A] text-[#FDFCF7] rounded-xl font-mono text-xs overflow-x-auto border border-[#333]">
                  {apiStatus ? (
                    <pre className="text-[#A7F3D0]">
{JSON.stringify(
  apiEndpoint === '/items/42'
    ? { item_id: 42, name: "Python Pro License", price: 99.0, available: true }
    : apiEndpoint === '/predict'
    ? { prediction: "churn_risk_low", probability: 0.94, model: "random_forest_v2" }
    : { status: "healthy", uptime_seconds: 14205, version: "2.4.0" },
  null,
  2
)}
                    </pre>
                  ) : (
                    <div className="py-8 text-center text-[#888] font-serif">
                      Click <strong className="text-[#FDFCF7]">Send Request</strong> to inspect response JSON headers & latency!
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-[#E8DFC9] flex justify-end">
                  <button
                    onClick={() => onStartLesson(activeLessonForToy)}
                    className="flex items-center gap-1.5 text-xs font-bold font-serif text-[#8C6D4F] hover:text-[#1A1A1A] transition-colors cursor-pointer"
                  >
                    <span>Read FastAPI Dialogue</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
