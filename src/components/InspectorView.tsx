import React, { useState, useMemo } from 'react';
import { CharacterAvatar } from './CharacterAvatar';
import { playPlayfulPop } from '../utils/audio';
import {
  Grid3X3,
  Table,
  Sliders,
  Sparkles,
  Copy,
  Check,
  Cpu,
  Layers,
  Info,
  ArrowRight
} from 'lucide-react';

interface InspectorViewProps {
  onReturnHome?: () => void;
}

// Sample DataFrame data for Inspector Mode B
const SAMPLE_DF_DATA = [
  { id: 0, name: 'Ayushi', dept: 'Analytics', salary: 92000, rating: 4.8, tenure: 3 },
  { id: 1, name: 'Ayush', dept: 'Platform', salary: 118000, rating: 4.9, tenure: 5 },
  { id: 2, name: 'Rohan', dept: 'Analytics', salary: 88000, rating: 4.5, tenure: 2 },
  { id: 3, name: 'Elena', dept: 'Deep Learning', salary: 125000, rating: 4.9, tenure: 4 },
  { id: 4, name: 'Marcus', dept: 'DevOps', salary: 98000, rating: 4.6, tenure: 3 },
  { id: 5, name: 'Zoe', dept: 'Deep Learning', salary: 110000, rating: 4.7, tenure: 2 },
];

const COLUMNS = ['name', 'dept', 'salary', 'rating', 'tenure'];

export const InspectorView: React.FC<InspectorViewProps> = ({ onReturnHome }) => {
  const [activeTab, setActiveTab] = useState<'tensor' | 'dataframe'>('tensor');

  // Tensor Inspector State
  const [batchSize, setBatchSize] = useState<number>(2);
  const [channels, setChannels] = useState<number>(2);
  const [height, setHeight] = useState<number>(3);
  const [width, setWidth] = useState<number>(4);
  const [operation, setOperation] = useState<'normal' | 'flatten' | 'slice'>('normal');
  const [copiedCode, setCopiedCode] = useState(false);

  // DataFrame Inspector State
  const [rowStart, setRowStart] = useState<number>(1);
  const [rowEnd, setRowEnd] = useState<number>(4); // exclusive
  const [colStart, setColStart] = useState<number>(0);
  const [colEnd, setColEnd] = useState<number>(3); // exclusive
  const [filterDept, setFilterDept] = useState<string>('All');

  const totalElements = batchSize * channels * height * width;

  // Strides calculation for (B, C, H, W)
  const strides = [
    channels * height * width,
    height * width,
    width,
    1
  ];

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    playPlayfulPop();
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const tensorCodeSnippet = useMemo(() => {
    if (operation === 'flatten') {
      return `# PyTorch Tensor Flattening
x = torch.randn(${batchSize}, ${channels}, ${height}, ${width})
flattened = x.view(${batchSize}, -1)
print(flattened.shape) # torch.Size([${batchSize}, ${channels * height * width}])`;
    }
    if (operation === 'slice') {
      return `# PyTorch Tensor Slicing: first batch, all channels, middle rows
x = torch.randn(${batchSize}, ${channels}, ${height}, ${width})
sub = x[0, :, 1:${height}, :]
print(sub.shape) # torch.Size([${channels}, ${Math.max(1, height - 1)}, ${width}])`;
    }
    return `# PyTorch 4D Mini-Batch Tensor
x = torch.randn(${batchSize}, ${channels}, ${height}, ${width})
print(x.shape)   # torch.Size([${batchSize}, ${channels}, ${height}, ${width}])
print(x.stride()) # (${strides.join(', ')})
print(x.numel())  # ${totalElements} elements`;
  }, [batchSize, channels, height, width, operation, strides, totalElements]);

  const dfCodeSnippet = useMemo(() => {
    if (filterDept !== 'All') {
      return `# Pandas .loc[] Boolean Mask & Column Selection
filtered = df.loc[df['dept'] == '${filterDept}', ['name', 'salary']]
print(filtered)`;
    }
    return `# Pandas .iloc[] Integer Position Slicing
# Rows: ${rowStart} through ${rowEnd - 1} (exclusive of ${rowEnd})
# Cols: ${colStart} through ${colEnd - 1} (${COLUMNS.slice(colStart, colEnd).join(', ')})
sub_df = df.iloc[${rowStart}:${rowEnd}, ${colStart}:${colEnd}]
print(sub_df)`;
  }, [rowStart, rowEnd, colStart, colEnd, filterDept]);

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-8 py-6 sm:py-10 space-y-8 animate-fadeIn">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#FFF7ED] via-[#FFFDFB] to-[#FDF4FF] dark:from-[#281813] dark:via-[#191920] dark:to-[#25152A] border-2 border-[#FED7AA]/80 dark:border-[#52291B]/80 shadow-md">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#8B5CF6] text-white text-xs font-bold font-serif shadow-xs">
              <Grid3X3 className="w-3.5 h-3.5" />
              <span>Tactile Memory Visualizer</span>
            </span>
            <span className="text-xs font-serif font-bold text-[#EA580C] dark:text-[#FB923C] bg-[#FFF0E6] dark:bg-[#341F16] px-2.5 py-0.5 rounded-full border border-[#FED7AA] dark:border-[#52291B]">
              Tensors & DataFrames
            </span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-black text-[#1A1A1A] dark:text-[#F4F4F5] tracking-tight">
            Tensor & DataFrame Inspector
          </h1>
          <p className="text-xs sm:text-sm font-serif text-[#666] dark:text-[#A1A1AA] max-w-2xl">
            Tweak matrix shapes, slice positions, and view transformations with tactile live visual grids. Understand memory layouts and strides with zero guesswork.
          </p>
        </div>

        {/* Tab Toggle: Tensor vs DataFrame */}
        <div className="flex items-center gap-2 bg-[#FFFDFE] dark:bg-[#1E1E24] p-1.5 rounded-2xl border border-[#FED7AA]/80 dark:border-[#383846] shadow-xs">
          <button
            onClick={() => {
              playPlayfulPop();
              setActiveTab('tensor');
            }}
            className={`px-4 py-2 rounded-xl text-xs font-serif font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'tensor'
                ? 'bg-gradient-to-r from-[#F97316] to-[#EC4899] text-white shadow-xs'
                : 'text-[#666] dark:text-[#A1A1AA] hover:text-[#1A1A1A] dark:hover:text-[#FFF]'
            }`}
          >
            <Grid3X3 className="w-4 h-4" />
            <span>PyTorch Tensor (4D)</span>
          </button>
          <button
            onClick={() => {
              playPlayfulPop();
              setActiveTab('dataframe');
            }}
            className={`px-4 py-2 rounded-xl text-xs font-serif font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'dataframe'
                ? 'bg-gradient-to-r from-[#F97316] to-[#EC4899] text-white shadow-xs'
                : 'text-[#666] dark:text-[#A1A1AA] hover:text-[#1A1A1A] dark:hover:text-[#FFF]'
            }`}
          >
            <Table className="w-4 h-4" />
            <span>Pandas DataFrame</span>
          </button>
        </div>
      </div>

      {/* TAB 1: TENSOR INSPECTOR */}
      {activeTab === 'tensor' ? (
        <div className="space-y-6">
          {/* Controls & Metrics Panel */}
          <div className="p-6 rounded-3xl bg-[#FFFDFB] dark:bg-[#18181D] border-2 border-[#FED7AA]/80 dark:border-[#52291B]/80 shadow-md space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#EAE4D5] dark:border-[#2C2C36]">
              <div>
                <h2 className="font-serif text-xl font-bold text-[#1A1A1A] dark:text-[#F4F4F5]">
                  Tensor Shape (Batch, Channels, Height, Width)
                </h2>
                <p className="font-serif text-xs text-[#666] dark:text-[#A1A1AA] mt-0.5">
                  Adjust dimension sliders to watch memory layout and stride coefficients adjust in real time.
                </p>
              </div>

              {/* Memory Formula Metric */}
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-[#FFF9F2] dark:bg-[#201814] border border-[#FED7AA]/60 dark:border-[#3E2419] text-right">
                  <span className="text-[10px] uppercase font-mono font-bold text-[#EA580C] dark:text-[#FB923C] block">
                    Total Elements
                  </span>
                  <span className="font-mono text-base font-black text-[#1A1A1A] dark:text-[#F4F4F5]">
                    {totalElements} floats ({(totalElements * 4)} bytes in FP32)
                  </span>
                </div>
              </div>
            </div>

            {/* Sliders Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {/* Batch Size */}
              <div className="p-3.5 rounded-2xl bg-[#FFFDFE] dark:bg-[#202028] border border-[#FED7AA]/60 dark:border-[#383846] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-[#EA580C] dark:text-[#FB923C]">
                    Batch (B)
                  </span>
                  <span className="text-xs font-mono font-black px-2 py-0.5 rounded bg-[#FED7AA]/30 dark:bg-[#341F16]">
                    {batchSize}
                  </span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={3}
                  value={batchSize}
                  onChange={(e) => {
                    playPlayfulPop();
                    setBatchSize(Number(e.target.value));
                  }}
                  className="w-full accent-[#EA580C] cursor-pointer"
                />
              </div>

              {/* Channels */}
              <div className="p-3.5 rounded-2xl bg-[#FFFDFE] dark:bg-[#202028] border border-[#FED7AA]/60 dark:border-[#383846] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-[#0284C7] dark:text-[#38BDF8]">
                    Channels (C)
                  </span>
                  <span className="text-xs font-mono font-black px-2 py-0.5 rounded bg-[#BAE6FD]/30 dark:bg-[#0C2D48]">
                    {channels}
                  </span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={3}
                  value={channels}
                  onChange={(e) => {
                    playPlayfulPop();
                    setChannels(Number(e.target.value));
                  }}
                  className="w-full accent-[#0284C7] cursor-pointer"
                />
              </div>

              {/* Height */}
              <div className="p-3.5 rounded-2xl bg-[#FFFDFE] dark:bg-[#202028] border border-[#FED7AA]/60 dark:border-[#383846] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-[#10B981] dark:text-[#34D399]">
                    Height (H)
                  </span>
                  <span className="text-xs font-mono font-black px-2 py-0.5 rounded bg-[#A7F3D0]/30 dark:bg-[#064E3B]">
                    {height}
                  </span>
                </div>
                <input
                  type="range"
                  min={2}
                  max={5}
                  value={height}
                  onChange={(e) => {
                    playPlayfulPop();
                    setHeight(Number(e.target.value));
                  }}
                  className="w-full accent-[#10B981] cursor-pointer"
                />
              </div>

              {/* Width */}
              <div className="p-3.5 rounded-2xl bg-[#FFFDFE] dark:bg-[#202028] border border-[#FED7AA]/60 dark:border-[#383846] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-[#8B5CF6] dark:text-[#C084FC]">
                    Width (W)
                  </span>
                  <span className="text-xs font-mono font-black px-2 py-0.5 rounded bg-[#DDD6FE]/30 dark:bg-[#3B0764]">
                    {width}
                  </span>
                </div>
                <input
                  type="range"
                  min={2}
                  max={5}
                  value={width}
                  onChange={(e) => {
                    playPlayfulPop();
                    setWidth(Number(e.target.value));
                  }}
                  className="w-full accent-[#8B5CF6] cursor-pointer"
                />
              </div>
            </div>

            {/* Transform Operation Selector */}
            <div className="flex items-center gap-2 pt-1 flex-wrap">
              <span className="text-xs font-serif text-[#777] dark:text-[#A1A1AA]">
                Simulate Operation:
              </span>
              {[
                { id: 'normal', label: 'Default 4D Grid' },
                { id: 'flatten', label: 'x.view(B, -1) (Flatten Features)' },
                { id: 'slice', label: 'x[0, :, 1:H, :] (Spatial Slice)' }
              ].map(op => (
                <button
                  key={op.id}
                  onClick={() => {
                    playPlayfulPop();
                    setOperation(op.id as any);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-serif font-bold transition-all cursor-pointer border ${
                    operation === op.id
                      ? 'bg-[#1A1A1A] dark:bg-[#32323E] text-white border-[#1A1A1A]'
                      : 'bg-[#FFFDFE] dark:bg-[#202028] text-[#666] dark:text-[#A1A1AA] border-[#DDD7C8] dark:border-[#383846]'
                  }`}
                >
                  {op.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tactile Grid Visualizer & Code Output */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left: 4D Matrix Visualization Grid (7 cols) */}
            <div className="lg:col-span-7 p-6 rounded-3xl bg-[#FFFDFB] dark:bg-[#18181D] border-2 border-[#FED7AA]/80 dark:border-[#52291B]/80 shadow-md space-y-4">
              <div className="flex items-center justify-between border-b border-[#EAE4D5] dark:border-[#2C2C36] pb-3">
                <span className="font-serif text-sm font-bold text-[#1A1A1A] dark:text-[#F4F4F5] flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-[#EA580C]" />
                  Visual Tensor Layout (Batch × Channel Grid)
                </span>
                <span className="text-[11px] font-mono text-[#888]">
                  Shape: [{batchSize}, {channels}, {height}, {width}]
                </span>
              </div>

              {/* Render Batches */}
              <div className="space-y-4 max-h-[460px] overflow-y-auto pr-1">
                {Array.from({ length: batchSize }).map((_, bIdx) => (
                  <div
                    key={bIdx}
                    className={`p-4 rounded-2xl border transition-all ${
                      operation === 'slice' && bIdx !== 0
                        ? 'opacity-30 bg-black/5 dark:bg-white/5 border-dashed border-[#AAA]'
                        : 'bg-[#FFF9F2] dark:bg-[#201814] border-[#FED7AA]/80 dark:border-[#4B291D]'
                    }`}
                  >
                    <span className="text-xs font-mono font-bold text-[#EA580C] dark:text-[#FB923C] block mb-2">
                      Batch #{bIdx} {operation === 'slice' && bIdx === 0 ? '(Selected in Slice)' : ''}
                    </span>

                    {/* Channels row */}
                    <div className="flex flex-wrap gap-3">
                      {Array.from({ length: channels }).map((_, cIdx) => (
                        <div
                          key={cIdx}
                          className="p-2.5 rounded-xl bg-[#FFFDFE] dark:bg-[#1E1E24] border border-[#BAE6FD]/70 dark:border-[#1E4E79] shadow-2xs"
                        >
                          <span className="text-[10px] font-mono font-semibold text-[#0284C7] dark:text-[#38BDF8] block mb-1">
                            Channel #{cIdx}
                          </span>

                          {/* 2D Matrix Height x Width */}
                          <div
                            className="grid gap-1"
                            style={{ gridTemplateColumns: `repeat(${width}, minmax(0, 1fr))` }}
                          >
                            {Array.from({ length: height }).map((_, hIdx) =>
                              Array.from({ length: width }).map((_, wIdx) => {
                                const isSliced =
                                  operation === 'slice' &&
                                  bIdx === 0 &&
                                  hIdx >= 1;

                                const elementIdx =
                                  bIdx * strides[0] +
                                  cIdx * strides[1] +
                                  hIdx * strides[2] +
                                  wIdx;

                                return (
                                  <div
                                    key={`${hIdx}-${wIdx}`}
                                    className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center font-mono text-[10px] transition-all ${
                                      isSliced
                                        ? 'bg-gradient-to-r from-[#F97316] to-[#EC4899] text-white font-bold ring-2 ring-[#EC4899] shadow-xs'
                                        : operation === 'slice'
                                        ? 'opacity-20 bg-gray-200 dark:bg-gray-800 text-gray-500'
                                        : 'bg-[#F3EFE6] dark:bg-[#2A2A34] text-[#333] dark:text-[#CCC] hover:bg-[#EA580C] hover:text-white'
                                    }`}
                                    title={`Index [${bIdx}, ${cIdx}, ${hIdx}, ${wIdx}] | Offset: ${elementIdx}`}
                                  >
                                    {elementIdx}
                                  </div>
                                );
                              })
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Live PyTorch Code & Memory Strides (5 cols) */}
            <div className="lg:col-span-5 space-y-4">
              {/* Code Card */}
              <div className="rounded-2xl bg-[#1E1E24] text-[#F4F4F5] border border-[#33333E] p-4 text-xs font-mono space-y-2 shadow-md">
                <div className="flex items-center justify-between text-[#888] border-b border-[#2C2C36] pb-2">
                  <span className="text-[#38BDF8] font-bold">PyTorch Code Equivalent</span>
                  <button
                    onClick={() => handleCopyCode(tensorCodeSnippet)}
                    className="flex items-center gap-1 text-[11px] font-mono px-2 py-1 rounded bg-white/10 hover:bg-white/20 text-[#DDD] transition-colors cursor-pointer"
                  >
                    {copiedCode ? (
                      <>
                        <Check className="w-3 h-3 text-[#4ADE80]" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
                <pre className="overflow-x-auto whitespace-pre leading-relaxed text-[#86EFAC]">
                  {tensorCodeSnippet}
                </pre>
              </div>

              {/* Ayush's Strides & Hardware Explanation */}
              <div className="p-5 rounded-2xl bg-[#FFFDFB] dark:bg-[#18181D] border border-[#FED7AA]/80 dark:border-[#4B291D] space-y-3">
                <div className="flex items-center gap-3">
                  <CharacterAvatar character="Ayush" size="sm" className="ring-2 ring-[#F97316]/30" />
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#EA580C] dark:text-[#FB923C] block">
                      Under the Hood: Strides & Stored Bytes
                    </span>
                    <span className="font-serif text-xs text-[#666] dark:text-[#A1A1AA]">
                      How PyTorch navigates flat memory without copying
                    </span>
                  </div>
                </div>

                <div className="space-y-2 text-xs font-serif text-[#333] dark:text-[#DDD] leading-relaxed">
                  <div className="p-3 rounded-xl bg-[#FFF9F2] dark:bg-[#201814] border border-[#FED7AA]/50 dark:border-[#3E2419]">
                    <strong className="text-[#EA580C] dark:text-[#FB923C] block mb-0.5">
                      Memory Stride Vector: ({strides.join(', ')})
                    </strong>
                    To jump to the next Batch sample, PyTorch skips <span className="font-mono font-bold text-[#EA580C]">{strides[0]}</span> floats. To jump to the next row, it skips <span className="font-mono font-bold text-[#EA580C]">{strides[2]}</span> floats.
                  </div>

                  <p className="text-[11px] text-[#666] dark:text-[#A1A1AA] italic">
                    "When you transpose or slice a tensor in PyTorch, it doesn't move a single byte of numbers in RAM! It only updates the stride vector."
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* TAB 2: DATAFRAME SLICER */
        <div className="space-y-6">
          {/* Controls Panel */}
          <div className="p-6 rounded-3xl bg-[#FFFDFB] dark:bg-[#18181D] border-2 border-[#FED7AA]/80 dark:border-[#52291B]/80 shadow-md space-y-5">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#EAE4D5] dark:border-[#2C2C36]">
              <div>
                <h2 className="font-serif text-xl font-bold text-[#1A1A1A] dark:text-[#F4F4F5]">
                  Pandas .iloc & .loc Slicer
                </h2>
                <p className="font-serif text-xs text-[#666] dark:text-[#A1A1AA] mt-0.5">
                  Adjust row/column range boundaries to watch exactly which cells are extracted into memory.
                </p>
              </div>

              {/* Filter Dept Toggle */}
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-serif text-[#777] dark:text-[#A1A1AA]">
                  Quick Filter:
                </span>
                {['All', 'Analytics', 'Deep Learning'].map(dept => (
                  <button
                    key={dept}
                    onClick={() => {
                      playPlayfulPop();
                      setFilterDept(dept);
                    }}
                    className={`px-3 py-1 rounded-xl text-xs font-serif font-bold transition-all cursor-pointer border ${
                      filterDept === dept
                        ? 'bg-[#1A1A1A] dark:bg-[#32323E] text-white border-[#1A1A1A]'
                        : 'bg-[#FFFDFE] dark:bg-[#202028] text-[#666] dark:text-[#A1A1AA] border-[#DDD7C8] dark:border-[#383846]'
                    }`}
                  >
                    {dept}
                  </button>
                ))}
              </div>
            </div>

            {/* Slicing Controls (Sliders) */}
            {filterDept === 'All' && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {/* Row Start */}
                <div className="p-3 rounded-xl bg-[#FFFDFE] dark:bg-[#202028] border border-[#FED7AA]/60 dark:border-[#383846] space-y-1">
                  <div className="flex justify-between text-xs font-mono font-bold text-[#EA580C] dark:text-[#FB923C]">
                    <span>Row Start (inc)</span>
                    <span>{rowStart}</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={rowEnd - 1}
                    value={rowStart}
                    onChange={(e) => {
                      playPlayfulPop();
                      setRowStart(Number(e.target.value));
                    }}
                    className="w-full accent-[#EA580C] cursor-pointer"
                  />
                </div>

                {/* Row End */}
                <div className="p-3 rounded-xl bg-[#FFFDFE] dark:bg-[#202028] border border-[#FED7AA]/60 dark:border-[#383846] space-y-1">
                  <div className="flex justify-between text-xs font-mono font-bold text-[#EA580C] dark:text-[#FB923C]">
                    <span>Row End (exc)</span>
                    <span>{rowEnd}</span>
                  </div>
                  <input
                    type="range"
                    min={rowStart + 1}
                    max={6}
                    value={rowEnd}
                    onChange={(e) => {
                      playPlayfulPop();
                      setRowEnd(Number(e.target.value));
                    }}
                    className="w-full accent-[#EA580C] cursor-pointer"
                  />
                </div>

                {/* Col Start */}
                <div className="p-3 rounded-xl bg-[#FFFDFE] dark:bg-[#202028] border border-[#FED7AA]/60 dark:border-[#383846] space-y-1">
                  <div className="flex justify-between text-xs font-mono font-bold text-[#0284C7] dark:text-[#38BDF8]">
                    <span>Col Start (inc)</span>
                    <span>{colStart}</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={colEnd - 1}
                    value={colStart}
                    onChange={(e) => {
                      playPlayfulPop();
                      setColStart(Number(e.target.value));
                    }}
                    className="w-full accent-[#0284C7] cursor-pointer"
                  />
                </div>

                {/* Col End */}
                <div className="p-3 rounded-xl bg-[#FFFDFE] dark:bg-[#202028] border border-[#FED7AA]/60 dark:border-[#383846] space-y-1">
                  <div className="flex justify-between text-xs font-mono font-bold text-[#0284C7] dark:text-[#38BDF8]">
                    <span>Col End (exc)</span>
                    <span>{colEnd}</span>
                  </div>
                  <input
                    type="range"
                    min={colStart + 1}
                    max={5}
                    value={colEnd}
                    onChange={(e) => {
                      playPlayfulPop();
                      setColEnd(Number(e.target.value));
                    }}
                    className="w-full accent-[#0284C7] cursor-pointer"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Interactive DataFrame Table & Code Output */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Table Visualization (7 cols) */}
            <div className="lg:col-span-7 p-6 rounded-3xl bg-[#FFFDFB] dark:bg-[#18181D] border-2 border-[#FED7AA]/80 dark:border-[#52291B]/80 shadow-md space-y-4">
              <div className="flex items-center justify-between border-b border-[#EAE4D5] dark:border-[#2C2C36] pb-3">
                <span className="font-serif text-sm font-bold text-[#1A1A1A] dark:text-[#F4F4F5] flex items-center gap-1.5">
                  <Table className="w-4 h-4 text-[#EC4899]" />
                  DataFrame Memory Grid (Rows 0 to 5)
                </span>
                <span className="text-[11px] font-mono text-[#888]">
                  Highlighted cells = Sliced output
                </span>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-xs font-mono border-collapse">
                  <thead>
                    <tr className="border-b border-[#DDD7C8] dark:border-[#333]">
                      <th className="py-2 px-3 text-left text-[#888]">idx</th>
                      {COLUMNS.map((col, cIdx) => {
                        const isColActive = filterDept === 'All' && cIdx >= colStart && cIdx < colEnd;
                        return (
                          <th
                            key={col}
                            className={`py-2 px-3 text-left transition-colors ${
                              isColActive
                                ? 'text-[#0284C7] dark:text-[#38BDF8] font-black'
                                : 'text-[#555] dark:text-[#AAA]'
                            }`}
                          >
                            {col}
                          </th>
                        );
                      })}
                    </tr>
                  </thead>
                  <tbody>
                    {SAMPLE_DF_DATA.map((row, rIdx) => {
                      const isRowSelected =
                        filterDept !== 'All'
                          ? row.dept === filterDept
                          : rIdx >= rowStart && rIdx < rowEnd;

                      return (
                        <tr
                          key={row.id}
                          className={`border-b border-black/5 dark:border-white/5 transition-all ${
                            isRowSelected
                              ? 'bg-[#FFF7ED] dark:bg-[#2A1E18]'
                              : 'opacity-35'
                          }`}
                        >
                          <td className="py-2 px-3 font-bold text-[#EA580C]">
                            {rIdx}
                          </td>
                          {COLUMNS.map((col, cIdx) => {
                            const isCellActive =
                              filterDept !== 'All'
                                ? isRowSelected && (col === 'name' || col === 'salary')
                                : isRowSelected && cIdx >= colStart && cIdx < colEnd;

                            return (
                              <td
                                key={col}
                                className={`py-2 px-3 transition-colors ${
                                  isCellActive
                                    ? 'font-bold text-[#1A1A1A] dark:text-[#F4F4F5] bg-[#FED7AA]/40 dark:bg-[#52291B]/50'
                                    : 'text-[#666] dark:text-[#AAA]'
                                }`}
                              >
                                {String((row as any)[col])}
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Code Output & Ayushi's Tip (5 cols) */}
            <div className="lg:col-span-5 space-y-4">
              {/* Code Box */}
              <div className="rounded-2xl bg-[#1E1E24] text-[#F4F4F5] border border-[#33333E] p-4 text-xs font-mono space-y-2 shadow-md">
                <div className="flex items-center justify-between text-[#888] border-b border-[#2C2C36] pb-2">
                  <span className="text-[#EC4899] font-bold">Pandas Slicing Syntax</span>
                  <button
                    onClick={() => handleCopyCode(dfCodeSnippet)}
                    className="flex items-center gap-1 text-[11px] font-mono px-2 py-1 rounded bg-white/10 hover:bg-white/20 text-[#DDD] transition-colors cursor-pointer"
                  >
                    {copiedCode ? (
                      <>
                        <Check className="w-3 h-3 text-[#4ADE80]" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
                <pre className="overflow-x-auto whitespace-pre leading-relaxed text-[#86EFAC]">
                  {dfCodeSnippet}
                </pre>
              </div>

              {/* Ayushi's Discovery Card */}
              <div className="p-5 rounded-2xl bg-[#FFFDFB] dark:bg-[#18181D] border border-[#FED7AA]/80 dark:border-[#4B291D] space-y-3">
                <div className="flex items-center gap-3">
                  <CharacterAvatar character="Ayushi" size="sm" className="ring-2 ring-[#EC4899]/30" />
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#DB2777] dark:text-[#F472B6] block">
                      Ayushi's Aha! Moment
                    </span>
                    <span className="font-serif text-xs text-[#666] dark:text-[#A1A1AA]">
                      Why 0:3 gets rows 0, 1, 2 only
                    </span>
                  </div>
                </div>

                <p className="text-xs font-serif text-[#333] dark:text-[#DDD] leading-relaxed">
                  "In Python and Pandas <code className="font-mono text-[#EA580C]">.iloc[0:3]</code>, the stop index is <strong>exclusive</strong>. It means 'stop right before index 3', which gives you exactly 3 rows (3 - 0 = 3). But with <code className="font-mono text-[#DB2777]">.loc['Mon':'Wed']</code>, Wednesday is <strong>inclusive</strong>!"
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
