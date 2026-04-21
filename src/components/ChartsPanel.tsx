import { useState, useEffect, useRef } from 'react';
import { NetworkState, forwardPropagate, TRUTH_TABLES, ForwardResult } from '../lib/nn';
import { GateType } from '../App';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface ChartsPanelProps {
  network: NetworkState;
  lossHistory: { epoch: number, loss: number }[];
  gateType: GateType;
  forwardResult: ForwardResult;
}

export default function ChartsPanel({ network, lossHistory, gateType, forwardResult }: ChartsPanelProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [activeTab, setActiveTab] = useState<'boundary' | 'loss'>('loss');

  useEffect(() => {
    if (activeTab !== 'boundary') return;
    
    const canvas = canvasRef.current;
    if (!canvas || !network) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    
    const resolution = 20;
    const cellW = width / resolution;
    const cellH = height / resolution;

    for (let i = 0; i < resolution; i++) {
        for (let j = 0; j < resolution; j++) {
            const x1 = i / (resolution - 1);
            const x2 = 1 - (j / (resolution - 1)); 

            const res = forwardPropagate(network, [x1, x2]);
            const pred = res.a[res.a.length - 1][0];

            const r = Math.round(31 + pred * (59 - 31));
            const g = Math.round(41 + pred * (130 - 41));
            const b = Math.round(55 + pred * (246 - 55));

            ctx.fillStyle = `rgb(${r},${g},${b})`;
            ctx.fillRect(i * cellW, j * cellH, Math.ceil(cellW), Math.ceil(cellH));
        }
    }
  }, [network, activeTab]);

  const dataPoints = TRUTH_TABLES[gateType];
  const maxLoss = lossHistory.length > 0 ? lossHistory[0].loss : 0.5;

  return (
    <>
      <section id="tour-charts" className="order-5 lg:order-none bg-white/[0.03] border border-white/10 rounded-[16px] p-[20px] overflow-hidden flex flex-col shadow-sm relative lg:col-start-2 lg:col-end-3 lg:row-start-3 min-h-[160px] lg:min-h-0 shrink-0">
        <div className="flex gap-4 mb-4 border-b border-white/10 pb-2">
          <button 
            onClick={() => setActiveTab('boundary')}
            className={`text-[10px] uppercase tracking-[1px] px-2 transition-colors ${activeTab === 'boundary' ? 'text-white font-bold' : 'text-[#9CA3AF] hover:text-gray-300'}`}
          >
            Decision Boundary
          </button>
          <button 
            onClick={() => setActiveTab('loss')}
            className={`text-[10px] uppercase tracking-[1px] px-2 transition-colors ${activeTab === 'loss' ? 'text-white font-bold' : 'text-[#9CA3AF] hover:text-gray-300'}`}
          >
            Training Loss
          </button>
        </div>

        <div className="flex-1 flex flex-col relative w-full h-full">
          {activeTab === 'boundary' ? (
            <div className="flex-1 flex gap-[16px] items-center animate-in fade-in duration-300">
              <div className="w-full aspect-square max-w-[120px] max-h-[120px] bg-black rounded-[8px] relative overflow-hidden isolate ring-1 ring-white/10 flex-shrink-0 mx-auto md:mx-0">
                <canvas 
                  ref={canvasRef} 
                  width={140} 
                  height={140}
                  className="w-full h-full object-fill absolute inset-0 -z-10"
                />
                
                {dataPoints.inputs.map((input, idx) => {
                  const expected = dataPoints.outputs[idx][0];
                  const left = `calc(${input[0] * 100}% - 5px)`;
                  const bottom = `calc(${input[1] * 100}% - 5px)`;
                  
                  return (
                    <div 
                      key={idx} 
                      className={`absolute w-[10px] h-[10px] rounded-full z-10 
                        ${expected === 1 ? 'bg-[#10B981] shadow-[0_0_8px_#10B981]' : 'bg-[#EF4444] shadow-[0_0_8px_#EF4444]'}`}
                      style={{ left, bottom }}
                    />
                  );
                })}
              </div>
              <div className="text-[11px] text-[#9CA3AF] leading-[1.6] hidden sm:block h-full pr-2 overflow-y-auto custom-scrollbar">
                The feature space visualizes how the model separates output states. <br/><br/>
                For non-linear problems like XOR, hidden layers warp coordinate space to draw a curved classification boundary.
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col w-full animate-in fade-in duration-300 relative">
              <div className="flex-1 w-full relative -ml-2 min-h-[100px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={lossHistory}>
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0A0A0B', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '12px', color: '#fff' }}
                      itemStyle={{ color: '#3B82F6' }}
                      labelStyle={{ display: 'none' }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="loss" 
                      stroke="#3B82F6" 
                      strokeWidth={2} 
                      dot={false}
                      isAnimationActive={false}
                    />
                    <XAxis dataKey="epoch" hide />
                    <YAxis hide domain={[0, maxLoss]} />
                  </LineChart>
                </ResponsiveContainer>
                <div className="absolute left-0 bottom-0 top-0 border-l border-white/20 ml-5" />
                <div className="absolute left-0 bottom-0 right-0 border-b border-white/20 mb-2 ml-5" />
              </div>
              {lossHistory.length > 0 && (
                <div className="flex justify-between text-[9px] text-[#9CA3AF] mt-[4px] pl-4">
                  <span>0 Epochs</span>
                  <span>{lossHistory[lossHistory.length-1].epoch.toLocaleString()} Epochs</span>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      <section className="order-6 lg:order-none bg-white/[0.03] border border-white/10 rounded-[16px] p-[20px] overflow-y-auto custom-scrollbar flex flex-col shadow-sm relative lg:col-start-3 lg:col-end-4 lg:row-start-3 min-h-[160px] lg:min-h-0 shrink-0">
        <span className="block text-[10px] uppercase tracking-[1px] text-[#9CA3AF] mb-[10px]">Performance</span>
        
        <div className="mt-2 flex-1 flex flex-col justify-between">
          <div>
            <div className="text-[28px] font-bold text-white">
              {lossHistory.length > 0 ? ((1 - Math.min(lossHistory[lossHistory.length-1].loss * 5, 1)) * 100).toFixed(1) : '0.0'}%
            </div>
            <div className="text-[11px] text-[#9CA3AF]">Global Model Accuracy</div>
            
            <div className="h-[4px] bg-[#1F2937] rounded-[2px] mt-[12px] overflow-hidden">
              <div 
                className="h-full bg-[#10B981] transition-all"
                style={{ width: `${lossHistory.length > 0 ? (1 - Math.min(lossHistory[lossHistory.length-1].loss * 5, 1)) * 100 : 0}%` }}
              />
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t border-white/10">
            <div className="text-[11px] text-[#9CA3AF] uppercase tracking-wider mb-2">Current Prediction</div>
            <div className="flex justify-between items-end">
              <div>
                <div className="text-[14px] font-mono text-[#E5E7EB]">
                  y = {forwardResult.a[forwardResult.a.length - 1]?.[0]?.toFixed(3) || '0.000'}
                </div>
                <div className="text-[11px] text-[#9CA3AF] mt-1">Raw Output</div>
              </div>
              <div className="text-right">
                <div className="text-[18px] font-bold text-[#10B981]">
                  Class {forwardResult.a[forwardResult.a.length - 1]?.[0] >= 0.5 ? '1' : '0'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
