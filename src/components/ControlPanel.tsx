import { GateType } from '../App';
import { TRUTH_TABLES, Activation } from '../lib/nn';
import clsx from 'clsx';

interface ControlPanelProps {
  gateType: GateType;
  setGateType: (gate: GateType) => void;
  x1: 0 | 1;
  setX1: (val: 0 | 1) => void;
  x2: 0 | 1;
  setX2: (val: 0 | 1) => void;
  hiddenLayers: number[];
  setHiddenLayers: (layers: number[]) => void;
  hiddenActivation: Activation;
  setHiddenActivation: (act: Activation) => void;
  outputActivation: Activation;
  setOutputActivation: (act: Activation) => void;
  learningRate: number | string;
  setLearningRate: (lr: number | string) => void;
  maxEpochs: number | string;
  setMaxEpochs: (me: number | string) => void;
  isTraining: boolean;
  setIsTraining: (val: boolean) => void;
  resetNetwork: () => void;
  prediction: number;
}

export default function ControlPanel({
  gateType, setGateType, x1, setX1, x2, setX2,
  hiddenLayers, setHiddenLayers,
  hiddenActivation, setHiddenActivation,
  outputActivation, setOutputActivation,
  learningRate, setLearningRate,
  maxEpochs, setMaxEpochs,
  isTraining, setIsTraining, resetNetwork, prediction
}: ControlPanelProps) {
  
  const expectedOutput = TRUTH_TABLES[gateType].outputs[
    TRUTH_TABLES[gateType].inputs.findIndex(i => i[0] === x1 && i[1] === x2)
  ][0];

  const roundedPred = prediction > 0.5 ? 1 : 0;
  const isCorrect = roundedPred === expectedOutput;

  return (
    <div className="flex flex-col h-fit min-h-full justify-between relative">
      <div>
        <span className="block text-[10px] uppercase tracking-[1px] text-[#9CA3AF] mb-[8px]">Gate Architecture</span>
        <select 
          className="w-full bg-[#111827] border border-white/20 text-white p-[8px] rounded-[8px] mb-[16px] outline-none"
          value={gateType}
          onChange={(e) => setGateType(e.target.value as GateType)}
        >
          <option value="XOR">XOR (Non-Linear)</option>
          <option value="AND">AND (Linear)</option>
          <option value="OR">OR (Linear)</option>
        </select>
        
        <span className="block text-[10px] uppercase tracking-[1px] text-[#9CA3AF] mb-[8px]">Network Input</span>
        <div className="flex gap-[8px] mb-[16px]">
          <button 
            onClick={() => setX1(x1 === 0 ? 1 : 0)} 
            className={clsx("flex-1 p-[8px] rounded-[8px] text-center border transition-colors outline-none", x1 === 1 ? "bg-[#3B82F6] text-white border-[#3B82F6]" : "bg-[#1F2937] border-white/10 text-[#9CA3AF] hover:text-white")}
          >
            X1: {x1}
          </button>
          <button 
            onClick={() => setX2(x2 === 0 ? 1 : 0)} 
            className={clsx("flex-1 p-[8px] rounded-[8px] text-center border transition-colors outline-none", x2 === 1 ? "bg-[#3B82F6] text-white border-[#3B82F6]" : "bg-[#1F2937] border-white/10 text-[#9CA3AF] hover:text-white")}
          >
            X2: {x2}
          </button>
        </div>

        <div className="flex justify-between items-end mb-[8px]">
          <span className="block text-[10px] uppercase tracking-[1px] text-[#9CA3AF]">Hidden Layers</span>
          <button 
            onClick={() => setHiddenLayers([...hiddenLayers, 2])}
            disabled={isTraining || hiddenLayers.length >= 3}
            className="text-[10px] text-[#3B82F6] hover:text-white disabled:opacity-50"
          >+ ADD LAYER</button>
        </div>
        
        <div className="flex flex-col gap-[8px] mb-[16px] max-h-[140px] overflow-y-auto custom-scrollbar pr-2">
          {hiddenLayers.length === 0 && <div className="text-[11px] text-[#9CA3AF] italic text-center py-2 bg-white/5 rounded-md">0 Hidden Layers (Direct Logic)</div>}
          {hiddenLayers.map((count, i) => (
            <div key={i} className="flex gap-[8px]">
              <button 
                onClick={() => {
                   const newL = [...hiddenLayers];
                   newL[i] = Math.max(1, count - 1); 
                   setHiddenLayers(newL);
                }} 
                disabled={isTraining || count <= 1}
                className="flex-1 p-[6px] rounded-[6px] text-center border transition-colors outline-none bg-[#1F2937] border-white/10 text-[#9CA3AF] hover:text-white disabled:opacity-50"
              >
                -
              </button>
              <div className="flex-[2] flex flex-col items-center justify-center p-[4px] rounded-[6px] text-[12px] font-bold border border-white/20 bg-[#111827] text-white leading-tight">
                {count} Nodes
                <span className="text-[9px] text-[#9CA3AF] tracking-wide font-normal mt-1">L{i+1}</span>
              </div>
              <button 
                onClick={() => {
                   const newL = [...hiddenLayers];
                   newL[i] = Math.min(10, count + 1); 
                   setHiddenLayers(newL);
                }} 
                disabled={isTraining}
                className="flex-1 p-[6px] rounded-[6px] text-center border transition-colors outline-none bg-[#1F2937] border-white/10 text-[#9CA3AF] hover:text-white disabled:opacity-50"
              >
                +
              </button>
              <button
                onClick={() => {
                  setHiddenLayers(hiddenLayers.filter((_, idx) => idx !== i));
                }}
                disabled={isTraining}
                 className="p-[6px] rounded-[6px] text-center border transition-colors outline-none bg-red-500/10 border-red-500/20 text-red-400 hover:bg-red-500/20 hover:text-red-300 disabled:opacity-50"
              >
                 ×
              </button>
            </div>
          ))}
        </div>

        <div className="flex gap-[8px] mb-[16px]">
          <div className="flex-1">
            <span className="block text-[10px] uppercase tracking-[1px] text-[#9CA3AF] mb-[4px]">Hidden Act.</span>
            <select 
              className="w-full bg-[#111827] border border-white/20 text-white p-[6px] text-[12px] rounded-[8px] outline-none disabled:opacity-50"
              value={hiddenActivation}
              onChange={(e) => setHiddenActivation(e.target.value as Activation)}
              disabled={isTraining || hiddenLayers.length === 0}
            >
              <option value="sigmoid">Sigmoid</option>
              <option value="relu">ReLU</option>
              <option value="tanh">Tanh</option>
              <option value="linear">Linear</option>
            </select>
          </div>
          <div className="flex-1">
            <span className="block text-[10px] uppercase tracking-[1px] text-[#9CA3AF] mb-[4px]">Output Act.</span>
            <select 
              className="w-full bg-[#111827] border border-white/20 text-white p-[6px] text-[12px] rounded-[8px] outline-none disabled:opacity-50"
              value={outputActivation}
              onChange={(e) => setOutputActivation(e.target.value as Activation)}
              disabled={isTraining}
            >
              <option value="sigmoid">Sigmoid</option>
              <option value="relu">ReLU</option>
              <option value="tanh">Tanh</option>
              <option value="linear">Linear</option>
            </select>
          </div>
        </div>

        <div id="tour-training" className="flex gap-[8px] mb-[16px]">
          <div className="flex-1">
            <span className="block text-[10px] uppercase tracking-[1px] text-[#9CA3AF] mb-[4px]">Learning Rate</span>
            <input 
              type="number"
              step="0.01"
              min="0.001"
              max="1.0"
              className="w-full bg-[#111827] border border-white/20 text-white p-[6px] text-[12px] rounded-[8px] outline-none disabled:opacity-50"
              value={learningRate}
              onChange={(e) => setLearningRate(e.target.value)}
              disabled={isTraining}
            />
          </div>
          <div className="flex-1">
            <span className="block text-[10px] uppercase tracking-[1px] text-[#9CA3AF] mb-[4px]">Max Epochs</span>
            <input 
              type="number"
              step="1000"
              min="10"
              max="100000"
              className="w-full bg-[#111827] border border-white/20 text-white p-[6px] text-[12px] rounded-[8px] outline-none disabled:opacity-50"
              value={maxEpochs}
              onChange={(e) => setMaxEpochs(e.target.value)}
              disabled={isTraining}
            />
          </div>
        </div>

        <button 
            onClick={() => setIsTraining(!isTraining)}
            className="w-full bg-[#3B82F6] text-white p-[10px] rounded-[8px] border-none font-[600] cursor-pointer mt-[8px] hover:bg-blue-600 transition-colors tracking-wide"
        >
          {isTraining ? 'Stop Training' : 'Train Model'}
        </button>
        <button 
            onClick={resetNetwork}
            className="w-full bg-transparent border border-white/20 text-white p-[10px] rounded-[8px] mt-[8px] cursor-pointer hover:bg-white/5 transition-colors tracking-wide"
        >
          Reset Weights
        </button>
      </div>

      <div className="mt-6">
        <span className="block text-[10px] uppercase tracking-[1px] text-[#9CA3AF] mb-[4px]">Current State</span>
        
        <div className="text-[24px] font-bold text-[#E5E7EB] flex items-baseline gap-[8px]">
          {prediction.toFixed(3)} 
          <span className="text-[14px] font-normal text-[#9CA3AF]">
            → {Boolean(roundedPred).toString().charAt(0).toUpperCase() + Boolean(roundedPred).toString().slice(1)}
          </span>
        </div>
        <div className="text-[11px] mt-[4px]" style={{ color: isCorrect ? '#10B981' : '#EF4444' }}>
          Expected: {expectedOutput.toFixed(1)} ({isCorrect ? 'Match' : 'Mismatch'})
        </div>
      </div>

    </div>
  );
}
