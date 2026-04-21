import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, RotateCcw, ChevronRight } from 'lucide-react';

export default function Learn() {
  const [activeTab, setActiveTab] = useState<'theory' | 'practical'>('theory');

  return (
    <div className="flex-1 h-full overflow-y-auto custom-scrollbar p-6 lg:p-10 text-[#E5E7EB] font-sans max-w-5xl mx-auto w-full">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-4">Neural Network Fundamentals</h1>
        <div className="flex gap-4">
          <button 
            onClick={() => setActiveTab('theory')}
            className={`px-4 py-2 rounded-md font-medium transition-all ${activeTab === 'theory' ? 'bg-blue-600 text-white' : 'bg-white/10 hover:bg-white/20'}`}
          >
            Theory & Concepts
          </button>
          <button 
            onClick={() => setActiveTab('practical')}
            className={`px-4 py-2 rounded-md font-medium transition-all ${activeTab === 'practical' ? 'bg-emerald-600 text-white' : 'bg-white/10 hover:bg-white/20'}`}
          >
            Interactive Practical
          </button>
        </div>
      </header>

      <AnimatePresence mode="wait">
        {activeTab === 'theory' ? (
          <motion.div 
            key="theory"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex flex-col gap-8 pb-10"
          >
            <section className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 lg:p-8">
              <h2 className="text-2xl font-semibold text-blue-400 mb-4">What is a Decision Boundary?</h2>
              <p className="text-gray-300 leading-relaxed mb-6">
                Imagine you have a piece of paper with red dots and blue dots scattered on it. 
                Your task is to draw a line (or a curve) that separates the red dots from the blue dots. 
                <br /><br />
                <strong>That line is the Decision Boundary.</strong>
              </p>
              
              <div className="grid md:grid-cols-2 gap-6 items-center">
                <div className="space-y-4 text-sm text-gray-400">
                  <p>
                    In 2D space (like our X1, X2 inputs), the network plots the possible inputs on a graph.
                  </p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li><strong className="text-gray-200">Linear Gates (AND, OR):</strong> Can be separated by a single straight line. A network with NO hidden layers (or just linear activation) can solve this.</li>
                    <li><strong className="text-emerald-400">Non-Linear Gates (XOR):</strong> Cannot be separated by a single straight line. Try drawing a single straight line separating [0,1] & [1,0] from [0,0] & [1,1] - it's impossible!</li>
                  </ul>
                  <p className="text-blue-300 mt-4">
                    <strong>Why Hidden Layers?</strong> Hidden layers warp the "piece of paper" (the 2D space) so that a straight line <em>can</em> separate them in a higher dimension. Our 2D Decision Boundary visualizer in the playground shows how the network splits the answers across every decimal input combination!
                  </p>
                </div>
                
                {/* Visual Representation of DB */}
                <div className="relative aspect-square max-w-[300px] mx-auto bg-[#111827] border border-white/20 rounded-xl overflow-hidden flex items-center justify-center">
                  <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/20 to-blue-500/20" />
                  <svg viewBox="0 0 100 100" className="w-full h-full opacity-80">
                      {/* Grid */}
                      <path d="M 50 0 L 50 100 M 0 50 L 100 50" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" />
                      {/* Points for XOR */}
                      <circle cx="20" cy="80" r="4" fill="#EF4444" /> {/* 0,0 Output 0 */}
                      <circle cx="80" cy="20" r="4" fill="#EF4444" /> {/* 1,1 Output 0 */}
                      <circle cx="20" cy="20" r="4" fill="#10B981" /> {/* 0,1 Output 1 */}
                      <circle cx="80" cy="80" r="4" fill="#10B981" /> {/* 1,0 Output 1 */}
                      
                      {/* Non-linear Decision Boundary */}
                      <path d="M 0 40 Q 50 50 40 0 M 60 100 Q 50 50 100 60" fill="none" stroke="#3B82F6" strokeWidth="2" strokeDasharray="4 2" />
                  </svg>
                  <div className="absolute bottom-2 font-mono text-[10px] text-[#9CA3AF]">XOR Decision Space</div>
                </div>
              </div>
            </section>

          </motion.div>
        ) : (
          <motion.div 
            key="practical"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex flex-col gap-6 pb-10"
          >
             <PracticalExample />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function PracticalExample() {
  const [step, setStep] = useState(0);

  const steps = [
    { label: "Given Inputs", description: "Start with input x1 = 1, x2 = 1." },
    { label: "Neuron 1 (Top)", description: "z1 = (1×1) + (1×1) - 1 = 1\n a1 = ReLU(1) = 1" },
    { label: "Neuron 2 (Bot)", description: "z2 = (1×1) + (1×1) - 2 = 0\n a2 = ReLU(0) = 0" },
    { label: "Output Neuron", description: "z3 = (1×1) + (0×-2) + 0 = 1\n y = Sigmoid(1) = 0.731" }
  ];

  return (
    <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 lg:p-8">
      <h2 className="text-2xl font-semibold text-emerald-400 mb-2">Step-by-Step Execution</h2>
      <p className="text-gray-400 mb-8 text-sm">
        Solving the prompt: 2 Inputs, 2 Hidden (ReLU), 1 Output (Sigmoid).
        <br/>Weights given in the God Mode visualizer.
      </p>

      <div className="flex flex-col lg:flex-row gap-8 items-center justify-center">
        {/* Simple Network Animation Diagram */}
        <div className="relative w-full max-w-[400px] h-[300px] bg-[#0A0A0B] border border-white/10 rounded-xl overflow-hidden p-6 font-mono text-xs">
          
          {/* Edges */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
             {/* Input to Hidden 1 */}
             <line x1="60" y1="80" x2="200" y2="80" stroke={step >= 1 ? "#3B82F6" : "#333"} strokeWidth="2" className="transition-all duration-700" />
             <line x1="60" y1="220" x2="200" y2="80" stroke={step >= 1 ? "#3B82F6" : "#333"} strokeWidth="2" className="transition-all duration-700" />
             
             {/* Input to Hidden 2 */}
             <line x1="60" y1="80" x2="200" y2="220" stroke={step >= 2 ? "#3B82F6" : "#333"} strokeWidth="2" className="transition-all duration-700" />
             <line x1="60" y1="220" x2="200" y2="220" stroke={step >= 2 ? "#3B82F6" : "#333"} strokeWidth="2" className="transition-all duration-700" />
             
             {/* Hidden to Output */}
             <line x1="200" y1="80" x2="340" y2="150" stroke={step >= 3 ? "#10B981" : "#333"} strokeWidth="2" className="transition-all duration-700" />
             <line x1="200" y1="220" x2="340" y2="150" stroke={step >= 3 ? "#10B981" : "#333"} strokeWidth="2" className="transition-all duration-700" />
          </svg>

          {/* Nodes */}
          {/* Inputs */}
          <Node x={60} y={80} label="x1=1" active={step >= 0} />
          <Node x={60} y={220} label="x2=1" active={step >= 0} />
          
          {/* Hidden */}
          <Node x={200} y={80} label="a1=1" subLabel="b=-1" active={step >= 1} color="blue" />
          <Node x={200} y={220} label="a2=0" subLabel="b=-2" active={step >= 2} color="blue" />
          
          {/* Output */}
          <Node x={340} y={150} label="y=0.73" subLabel="b=0" active={step >= 3} color="green" />

        </div>

        {/* Stepper Controls */}
        <div className="flex-1 flex flex-col gap-4 w-full">
          {steps.map((s, idx) => (
             <div 
               key={idx} 
               className={`p-4 rounded-xl border transition-all duration-500 ${step === idx ? 'bg-white/10 border-white/30 scale-105' : 'bg-white/[0.02] border-white/5 opacity-50'}`}
             >
               <h3 className="font-bold text-white mb-2">Step {idx + 1}: {s.label}</h3>
               <pre className="whitespace-pre-line text-blue-300 font-mono text-sm m-0">
                 {step >= idx ? s.description : '???'}
               </pre>
             </div>
          ))}

          <div className="flex gap-4 mt-4">
             <button 
               onClick={() => setStep(Math.max(0, step - 1))}
               disabled={step === 0}
               className="flex-1 py-2 rounded-lg bg-gray-800 text-white disabled:opacity-30 hover:bg-gray-700 transition"
             >
               Previous
             </button>
             <button 
               onClick={() => setStep(step < 3 ? step + 1 : 0)}
               className={`flex-1 py-2 rounded-lg font-bold transition flex items-center justify-center gap-2 ${step === 3 ? 'bg-emerald-600 hover:bg-emerald-500' : 'bg-blue-600 hover:bg-blue-500'} text-white`}
             >
               {step === 3 ? <><RotateCcw size={16}/> Restart</> : <><Play size={16}/> Next Step</>}
             </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Node({ x, y, label, subLabel, active, color = 'blue' }: { x: number, y: number, label: string, subLabel?: string, active: boolean, color?: 'blue' | 'green' }) {
  const baseColor = color === 'blue' ? '#3B82F6' : '#10B981';
  
  return (
    <div 
      className="absolute flex flex-col items-center justify-center transition-all duration-700 z-10" 
      style={{ left: x, top: y, transform: 'translate(-50%, -50%)' }}
    >
      <div 
        className="w-12 h-12 rounded-full border-2 flex items-center justify-center shadow-lg transition-colors duration-700"
        style={{ 
          borderColor: active ? baseColor : '#333', 
          backgroundColor: active ? `${baseColor}40` : '#1F2937',
          boxShadow: active ? `0 0 15px ${baseColor}60` : 'none'
        }}
      >
         <span className={`text-[10px] font-bold ${active ? 'text-white' : 'text-gray-500'}`}>
           {label}
         </span>
      </div>
      {subLabel && (
        <span className={`mt-1 text-[9px] px-1.5 py-0.5 rounded bg-black/50 ${active ? 'text-gray-300' : 'text-gray-600'}`}>
          {subLabel}
        </span>
      )}
    </div>
  );
}
