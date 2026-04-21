import { NetworkState, ForwardResult } from '../lib/nn';

interface ComputationPanelProps {
  network: NetworkState;
  forwardResult: ForwardResult;
  x1: number;
  x2: number;
}

export default function ComputationPanel({ network, forwardResult, x1, x2 }: ComputationPanelProps) {
  
  return (
    <div className="h-full flex flex-col font-mono text-sm overflow-hidden text-[#E5E7EB]">
      <span className="block text-[10px] uppercase tracking-[1px] text-[#9CA3AF] mb-3 font-sans">Computation Log</span>
      
      <div className="overflow-y-auto flex-1 space-y-3 pr-2 custom-scrollbar">
        
        {/* Input Layer */}
        <div className="bg-black/30 rounded-lg p-3 text-[12px] leading-[1.5]">
          <span className="text-[#10B981] font-semibold">[L0: Input]</span><br/>
          x₁ = {x1}<br/>
          x₂ = {x2}
        </div>

        {/* Subsequent Layers */}
        {network.weights.map((layerWeights, lIdx) => {
          const targetLayerIdx = lIdx + 1;
          const isOutput = targetLayerIdx === network.layers.length - 1;
          const layerLabel = isOutput ? 'Output' : `Hidden ${targetLayerIdx}`;
          
          return layerWeights.map((neuronWeights, nIdx) => {
              const b = network.biases[lIdx]?.[nIdx] ?? 0;
              const z = forwardResult.z[targetLayerIdx]?.[nIdx] ?? 0;
              const a = forwardResult.a[targetLayerIdx]?.[nIdx] ?? 0;
              const subscript = isOutput ? 'ₒ' : (nIdx + 1);
              
              // Construct math string for z
              const zFormula = neuronWeights.map((w, wIdx) => {
                const prevA = forwardResult.a[targetLayerIdx - 1]?.[wIdx] ?? 0;
                return `(${w.toFixed(1)} * ${prevA.toFixed(1)})`;
              }).join(' + ');

              // Format math strings for activation fn
              const activationFunc = network.activations[lIdx];
              let actStr = "";
              let actFormula = "";
              if (activationFunc === 'sigmoid') {
                actStr = 'sigm';
                actFormula = `1 / (1 + e^-${z.toFixed(2)})`;
              } else if (activationFunc === 'relu') {
                actStr = 'relu';
                actFormula = `max(0, ${z.toFixed(2)})`;
              } else if (activationFunc === 'tanh') {
                actStr = 'tanh';
                actFormula = `(e^${z.toFixed(2)} - e^-${z.toFixed(2)}) / (e^${z.toFixed(2)} + e^-${z.toFixed(2)})`;
              } else if (activationFunc === 'linear') {
                actStr = 'linear';
                actFormula = `${z.toFixed(2)}`;
              }

              return (
                <div key={`${lIdx}-${nIdx}`} className="bg-black/30 rounded-lg p-3 text-[12px] leading-[1.5]">
                  <span className="text-[#10B981] font-semibold">[L{targetLayerIdx}: {layerLabel} - Node {nIdx + 1}]</span><br/>
                  <div className="opacity-70 mt-1 mb-1 whitespace-nowrap overflow-hidden text-ellipsis" title={`z = ${zFormula} ${b >= 0 ? '+' : '-'} ${Math.abs(b).toFixed(1)}`}>
                    z{subscript} = {zFormula} {b >= 0 ? '+' : '-'} {Math.abs(b).toFixed(1)}
                  </div>
                  z{subscript} = <span className="font-bold text-white">{z.toFixed(2)}</span><br/>
                  {isOutput ? 'y' : `a${subscript}`} = {actStr}({z.toFixed(2)}) = {actFormula}<br/>
                  {isOutput ? 'y' : `a${subscript}`} = <span className="text-[#10B981] font-bold">{a.toFixed(3)}</span>
                  {isOutput && (
                    <div className="mt-3 pt-3 border-t border-white/10 text-white font-sans text-sm">
                      <div className="text-[#9CA3AF] text-[10px] uppercase tracking-wider mb-1">Final Result (Thresholded)</div>
                      Prediction = <span className="text-[#10B981] font-bold">{a >= 0.5 ? '1 (True)' : '0 (False)'}</span>
                    </div>
                  )}
                </div>
              );
          });
        })}

        <div className="text-[10px] opacity-50 text-center mt-4 font-sans tracking-wide">
          Floating point precision: 64-bit
        </div>
      </div>
    </div>
  );
}
