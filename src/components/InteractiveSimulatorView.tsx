import React, { useState, useMemo } from 'react';
import { InteractiveSimulatorConfig } from '../types';
import { Sliders, Play, RotateCcw, Clock, Terminal, Table as TableIcon, Sparkles } from 'lucide-react';
import { sound } from '../utils/audio';

interface InteractiveSimulatorViewProps {
  simulator: InteractiveSimulatorConfig;
}

export const InteractiveSimulatorView: React.FC<InteractiveSimulatorViewProps> = ({
  simulator
}) => {
  // Initialize controls state from defaults
  const initialControlValues = useMemo(() => {
    const vals: Record<string, any> = {};
    simulator.controls.forEach(c => {
      vals[c.id] = c.defaultValue;
    });
    return vals;
  }, [simulator]);

  const [controlValues, setControlValues] = useState<Record<string, any>>(initialControlValues);
  const [activeTab, setActiveTab] = useState<'table' | 'code' | 'logs'>('table');

  const updateControl = (id: string, value: any) => {
    sound.playClick();
    setControlValues(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const resetControls = () => {
    sound.playClick();
    setControlValues(initialControlValues);
  };

  // Run simulation logic
  const simulationResult = useMemo(() => {
    return simulator.simulationLogic(controlValues, simulator.initialData);
  }, [simulator, controlValues]);

  const generatedPythonCode = useMemo(() => {
    return simulator.pythonCodeTemplate(controlValues);
  }, [simulator, controlValues]);

  return (
    <div id="interactive-simulator-container" className="space-y-6">
      {/* Top Banner */}
      <div className="p-6 rounded-3xl bg-[#F7F5EE] border border-[#E9E5D9] shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#1A1A1A] text-[#D4A373] flex items-center justify-center border border-[#1A1A1A] shadow-xs shrink-0">
            <Play className="w-5 h-5 fill-current" />
          </div>
          <div>
            <h3 className="font-serif text-base font-bold text-[#1A1A1A]">{simulator.title}</h3>
            <p className="text-xs text-[#555] font-serif italic">{simulator.description}</p>
          </div>
        </div>

        <button
          onClick={resetControls}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#1A1A1A] hover:bg-[#D4A373] text-[#FDFCF6] hover:text-[#1A1A1A] border border-[#1A1A1A] text-xs font-bold transition-all shrink-0 cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Sandbox</span>
        </button>
      </div>

      {/* Main Sandbox Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Column: Interactive Controls */}
        <div className="lg:col-span-4 bg-[#F7F5EE] p-5 rounded-3xl border border-[#E9E5D9] shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#E9E5D9]">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-[#D4A373]" />
              <span className="font-serif text-xs font-bold text-[#1A1A1A]">Query Parameters</span>
            </div>
            <span className="text-[10px] uppercase font-bold text-[#486B4F] bg-[#EBF2EC] px-2 py-0.5 rounded-md border border-[#C8DEC9]">
              Live Link
            </span>
          </div>

          {simulator.controls.map(ctrl => {
            const val = controlValues[ctrl.id];

            return (
              <div key={ctrl.id} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-medium text-[#1A1A1A]">
                  <label htmlFor={`ctrl-${ctrl.id}`}>{ctrl.label}</label>
                  {ctrl.type === 'slider' && (
                    <span className="font-bold text-[#8C6D4F] font-mono">
                      {val} {ctrl.id.includes('Min') || ctrl.id.includes('Amount') ? '$' : ''}
                    </span>
                  )}
                </div>

                {ctrl.type === 'slider' && (
                  <input
                    id={`ctrl-${ctrl.id}`}
                    type="range"
                    min={ctrl.min ?? 0}
                    max={ctrl.max ?? 100}
                    step={ctrl.step ?? 1}
                    value={val}
                    onChange={(e) => updateControl(ctrl.id, Number(e.target.value))}
                    className="w-full h-2 bg-[#E9E5D9] rounded-lg appearance-none cursor-pointer accent-[#D4A373]"
                  />
                )}

                {ctrl.type === 'select' && (
                  <select
                    id={`ctrl-${ctrl.id}`}
                    value={val}
                    onChange={(e) => updateControl(ctrl.id, e.target.value)}
                    className="w-full px-3 py-2 text-xs font-medium bg-[#FDFCF6] border border-[#E9E5D9] rounded-xl text-[#1A1A1A] focus:ring-2 focus:ring-[#D4A373]/30 focus:border-[#D4A373] outline-hidden shadow-2xs"
                  >
                    {ctrl.options?.map(opt => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            );
          })}

          {/* Quick Metrics from Computed Result */}
          <div className="pt-3 border-t border-[#E9E5D9] space-y-2">
            <span className="text-[10px] font-bold text-[#8C6D4F] uppercase tracking-widest block">
              Execution Output Stats
            </span>
            <div className="grid grid-cols-2 gap-2">
              {simulationResult.computedStats.map((stat, idx) => (
                <div key={idx} className="p-2.5 rounded-xl bg-[#FDFCF6] border border-[#E9E5D9]">
                  <span className="text-[10px] text-[#666] block">{stat.label}</span>
                  <span className="font-serif text-xs font-bold text-[#1A1A1A]">{stat.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Live Table Output, Python Code, and Logs */}
        <div className="lg:col-span-8 bg-[#F7F5EE] rounded-3xl border border-[#E9E5D9] shadow-xs overflow-hidden">
          {/* Tabs */}
          <div className="px-4 py-2.5 bg-[#E9E5D9]/40 border-b border-[#E9E5D9] flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => { sound.playClick(); setActiveTab('table'); }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'table'
                    ? 'bg-[#1A1A1A] text-[#FDFCF6] shadow-xs'
                    : 'text-[#666] hover:text-[#1A1A1A]'
                }`}
              >
                <TableIcon className="w-3.5 h-3.5" />
                <span>DataFrame Grid ({simulationResult.filteredData.length})</span>
              </button>
              <button
                onClick={() => { sound.playClick(); setActiveTab('code'); }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'code'
                    ? 'bg-[#1A1A1A] text-[#FDFCF6] shadow-xs'
                    : 'text-[#666] hover:text-[#1A1A1A]'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-[#D4A373]" />
                <span>Live Python Script</span>
              </button>
              <button
                onClick={() => { sound.playClick(); setActiveTab('logs'); }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'logs'
                    ? 'bg-[#1A1A1A] text-[#FDFCF6] shadow-xs'
                    : 'text-[#666] hover:text-[#1A1A1A]'
                }`}
              >
                <Terminal className="w-3.5 h-3.5" />
                <span>Execution Logs</span>
              </button>
            </div>

            <div className="flex items-center gap-1 text-[11px] font-mono text-[#486B4F] bg-[#EBF2EC] px-2 py-0.5 rounded-md border border-[#C8DEC9]">
              <Clock className="w-3 h-3" />
              <span>{simulationResult.executionTimeMs}s Latency</span>
            </div>
          </div>

          {/* Tab 1: Live DataFrame Table */}
          {activeTab === 'table' && (
            <div className="overflow-x-auto max-h-80 bg-[#FDFCF6]">
              <table className="w-full text-left text-xs text-[#1A1A1A]">
                <thead className="bg-[#E9E5D9]/50 text-[#555] font-serif font-semibold border-b border-[#E9E5D9] sticky top-0">
                  <tr>
                    {simulator.columns.map(col => (
                      <th key={col.key} className="px-4 py-2.5 whitespace-nowrap">
                        {col.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E9E5D9] font-mono text-[11px]">
                  {simulationResult.filteredData.length > 0 ? (
                    simulationResult.filteredData.map((row, idx) => (
                      <tr key={idx} className="hover:bg-[#E9E5D9]/30 transition-colors">
                        {simulator.columns.map(col => {
                          const val = row[col.key];
                          return (
                            <td key={col.key} className="px-4 py-2 whitespace-nowrap">
                              {col.type === 'currency' ? (
                                <span className="font-semibold text-[#486B4F]">${Number(val).toFixed(2)}</span>
                              ) : col.type === 'badge' ? (
                                <span className="px-2 py-0.5 rounded-md bg-[#E9E5D9] text-[#1A1A1A] font-sans text-[10px] font-semibold border border-[#D4A373]/30">
                                  {val}
                                </span>
                              ) : (
                                <span>{val}</span>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={simulator.columns.length} className="px-4 py-8 text-center text-[#888] italic font-serif">
                        No records match the current filter parameters. Try lowering the threshold!
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* Tab 2: Live Python Code Preview */}
          {activeTab === 'code' && (
            <div className="p-4 bg-[#1A1A1A] font-mono text-xs text-[#E5E0D5] max-h-80 overflow-y-auto leading-6">
              <pre>
                <code>{generatedPythonCode}</code>
              </pre>
            </div>
          )}

          {/* Tab 3: Execution Logs */}
          {activeTab === 'logs' && (
            <div className="p-4 bg-[#1A1A1A] font-mono text-xs text-[#D4A373] max-h-80 overflow-y-auto space-y-1.5 leading-5">
              {simulationResult.logMessages.map((msg, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <span className="text-[#666] select-none">[{idx + 1}]</span>
                  <span>{msg}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
