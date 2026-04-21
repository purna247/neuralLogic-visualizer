import { useEffect, useState } from 'react';
import clsx from 'clsx';
import { 
  Info, Layers, Cpu, Activity, ArrowRight, Target, 
  RefreshCw, Grid, Layout, Sliders, HelpCircle, Lightbulb 
} from 'lucide-react';

const SECTIONS = [
  { id: 'intro', title: '1. Introduction', icon: Info },
  { id: 'structure', title: '2. Neural Network Structure', icon: Layers },
  { id: 'neuron', title: '3. Neuron Model', icon: Cpu },
  { id: 'activations', title: '4. Activation Functions', icon: Activity },
  { id: 'forward', title: '5. Forward Propagation', icon: ArrowRight },
  { id: 'loss', title: '6. Loss Function', icon: Target },
  { id: 'training', title: '7. Training & Backprop', icon: RefreshCw },
  { id: 'matrix', title: '8. Matrix Representation', icon: Grid },
  { id: 'boundaries', title: '9. Decision Boundaries', icon: Layout },
  { id: 'logic-gates', title: '10. Logic Gates Case Study', icon: Cpu },
  { id: 'parameters', title: '11. Parameters', icon: Sliders },
  { id: 'faqs', title: '12. FAQs', icon: HelpCircle },
];

export default function Docs() {
  const [activeSection, setActiveSection] = useState('intro');

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    }, { rootMargin: '-10% 0px -80% 0px' });

    SECTIONS.forEach(s => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="flex flex-1 h-full w-full bg-[#0A0A0B] text-[#E5E7EB] font-sans overflow-hidden">
      
      {/* 📚 LEFT SIDEBAR (NAVIGATION) */}
      <div className="hidden md:flex flex-col w-[260px] lg:w-[300px] border-r border-white/10 h-full shrink-0 bg-white/[0.02]">
        <div className="p-6 border-b border-white/10">
          <h2 className="text-sm font-bold tracking-wider uppercase text-white/80">Documentation</h2>
        </div>
        <nav className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-1">
          {SECTIONS.map((section) => {
            const Icon = section.icon;
            const isActive = activeSection === section.id;
            return (
              <button
                key={section.id}
                onClick={() => scrollTo(section.id)}
                className={clsx(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all text-left",
                  isActive 
                    ? "bg-blue-500/20 text-blue-400 font-medium" 
                    : "text-gray-400 hover:bg-white/5 hover:text-gray-200"
                )}
              >
                <Icon size={16} className={isActive ? "text-blue-400" : "text-gray-500"} />
                <span className="truncate">{section.title}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* 📖 RIGHT SIDE (CONTENT) */}
      <div className="flex-1 overflow-y-auto custom-scrollbar scroll-smooth p-6 lg:p-12">
        <div className="max-w-4xl mx-auto space-y-24 pb-32">
          
          {/* Cover Header */}
          <div className="space-y-4 border-b border-white/10 pb-12">
            <h1 className="text-4xl lg:text-5xl font-bold text-white tracking-tight">
              Feed Forward Neural Network
            </h1>
            <p className="text-xl text-gray-400 font-light">
              The complete learning hub combining theory, intuition, and interactive visuals.
            </p>
          </div>

          {/* 1. Introduction */}
          <section id="intro" className="scroll-mt-12 space-y-6">
            <h2 className="text-3xl font-bold text-white flex items-center gap-3">
              <Info className="text-blue-500" /> 1. Introduction
            </h2>
            <div className="bg-white/[0.03] border border-white/10 p-6 rounded-2xl text-gray-300 leading-relaxed space-y-4">
              <p>
                A <strong>Feed Forward Neural Network (FFNN)</strong> is the simplest type of artificial neural network. In this network, the information moves in only one direction—forward—from the input nodes, through the hidden nodes (if any), and to the output nodes. There are no cycles or loops.
              </p>
              <div className="bg-blue-900/20 border border-blue-500/30 p-4 rounded-xl flex gap-4">
                <Lightbulb className="text-blue-400 shrink-0 mt-1" />
                <p className="text-blue-100 text-sm">
                  <strong>Intuition:</strong> Think of an FFNN as a committee of experts. The inputs are evidence presented to junior analysts (first layer). They summarize their findings and pass them to senior managers (hidden layers), who finally give a recommendation to the CEO (output layer) to make the final decision.
                </p>
              </div>
            </div>
          </section>

          {/* 2. Neural Network Structure */}
          <section id="structure" className="scroll-mt-12 space-y-6">
            <h2 className="text-3xl font-bold text-white flex items-center gap-3">
              <Layers className="text-blue-500" /> 2. Neural Network Structure
            </h2>
            <div className="grid md:grid-cols-2 gap-8 items-center bg-white/[0.03] border border-white/10 p-6 rounded-2xl">
              <div className="space-y-4 text-gray-300">
                <p>An FFNN is organized into distinct layers:</p>
                <ul className="list-disc pl-5 space-y-2">
                  <li><strong className="text-blue-400">Input Layer:</strong> Receives raw data (e.g., pixel values, logic gate bits).</li>
                  <li><strong className="text-amber-400">Hidden Layers:</strong> The "black box" where abstraction happens. They extract patterns from the inputs.</li>
                  <li><strong className="text-emerald-400">Output Layer:</strong> Produces the final prediction or classification.</li>
                </ul>
              </div>
              <div className="bg-[#0A0A0B] border border-white/10 rounded-xl aspect-video flex items-center justify-center relative overflow-hidden">
                {/* Minimal SVG Diagram of NN Structure */}
                <svg viewBox="0 0 200 100" className="w-full h-full opacity-80" stroke="rgba(255,255,255,0.3)" strokeWidth="1">
                  <circle cx="40" cy="30" r="8" fill="#1F2937" stroke="#3B82F6" strokeWidth="2" />
                  <circle cx="40" cy="70" r="8" fill="#1F2937" stroke="#3B82F6" strokeWidth="2" />
                  <circle cx="100" cy="20" r="8" fill="#1F2937" stroke="#F59E0B" strokeWidth="2" />
                  <circle cx="100" cy="50" r="8" fill="#1F2937" stroke="#F59E0B" strokeWidth="2" />
                  <circle cx="100" cy="80" r="8" fill="#1F2937" stroke="#F59E0B" strokeWidth="2" />
                  <circle cx="160" cy="50" r="8" fill="#1F2937" stroke="#10B981" strokeWidth="2" />
                  
                  {/* Edges from Input to Hidden */}
                  <line x1="48" y1="30" x2="92" y2="20" /><line x1="48" y1="30" x2="92" y2="50" /><line x1="48" y1="30" x2="92" y2="80" />
                  <line x1="48" y1="70" x2="92" y2="20" /><line x1="48" y1="70" x2="92" y2="50" /><line x1="48" y1="70" x2="92" y2="80" />
                  {/* Edges from Hidden to Output */}
                  <line x1="108" y1="20" x2="152" y2="50" />
                  <line x1="108" y1="50" x2="152" y2="50" />
                  <line x1="108" y1="80" x2="152" y2="50" />
                </svg>
                <div className="absolute top-2 w-full flex justify-between px-6 text-[10px] font-mono font-bold">
                  <span className="text-blue-500/80">INPUT</span>
                  <span className="text-amber-500/80">HIDDEN</span>
                  <span className="text-emerald-500/80">OUTPUT</span>
                </div>
              </div>
            </div>
          </section>

          {/* 3. Neuron Model */}
          <section id="neuron" className="scroll-mt-12 space-y-6">
            <h2 className="text-3xl font-bold text-white flex items-center gap-3">
              <Cpu className="text-blue-500" /> 3. Neuron Model
            </h2>
            <div className="bg-white/[0.03] border border-white/10 p-6 rounded-2xl text-gray-300">
              <p className="mb-6">
                A single artificial neuron is the building block. It performs a simple mathematical operation in two steps: a <strong>weighted sum</strong> followed by an <strong>activation function</strong>.
              </p>
              
              <div className="grid lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="bg-[#111827] border border-white/10 p-4 rounded-xl font-mono text-center">
                    <div className="text-lg text-white mb-2">z = (w₁x₁ + w₂x₂ + ... + wₙxₙ) + b</div>
                    <div className="text-lg text-emerald-400">a = f(z)</div>
                  </div>
                  <ul className="text-sm space-y-2">
                    <li><strong className="text-white">x (Input):</strong> The data coming in.</li>
                    <li><strong className="text-purple-400">w (Weight):</strong> The importance of that specific input.</li>
                    <li><strong className="text-amber-400">b (Bias):</strong> A threshold value that delays or triggers the neuron (like a baseline offset).</li>
                    <li><strong className="text-emerald-400">f() (Activation):</strong> A function that squishes the result to a usable range.</li>
                  </ul>
                </div>
                
                <div className="bg-blue-900/20 border border-blue-500/30 p-4 rounded-xl flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-blue-300 font-bold mb-2">
                    <Lightbulb size={18} /> Analogy: Buying a House
                  </div>
                  <p className="text-blue-200/80 text-sm">
                    <strong>x₁</strong> = Distance to work. <strong>w₁</strong> = Very important (weight = 10).<br/><br/>
                    <strong>x₂</strong> = Has a pool. <strong>w₂</strong> = Not important (weight = 1).<br/><br/>
                    <strong>Bias (b)</strong> = Even if it's far and has no pool, the house is so cheap you are baseline tempted (bias = +5).<br/><br/>
                    <strong>Activation (a)</strong> = If the total score &gt; 50, output "Buy", else "Don't Buy".
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* 4. Activation Functions */}
          <section id="activations" className="scroll-mt-12 space-y-6">
            <h2 className="text-3xl font-bold text-white flex items-center gap-3">
              <Activity className="text-blue-500" /> 4. Activation Functions
            </h2>
            <div className="bg-white/[0.03] border border-white/10 p-6 rounded-2xl text-gray-300 space-y-6">
              <p>
                Without activation functions, a neural network is just a linear regression model, no matter how many layers it has. Activation functions introduce <strong>non-linearity</strong>, allowing networks to learn complex patterns (like XOR).
              </p>

              <div className="grid md:grid-cols-3 gap-4">
                {/* Sigmoid */}
                <div className="bg-[#111827] border border-white/10 p-4 rounded-xl flex flex-col items-center text-center gap-2">
                  <h4 className="font-bold text-white">Sigmoid</h4>
                  <div className="text-xs text-blue-400 font-mono bg-blue-500/10 px-2 py-1 rounded">f(z) = 1 / (1 + e⁻ᶻ)</div>
                  <p className="text-xs text-gray-400 mt-2">Squishes outputs to (0, 1). Great for final probability outputs.</p>
                </div>
                {/* ReLU */}
                <div className="bg-[#111827] border border-white/10 p-4 rounded-xl flex flex-col items-center text-center gap-2">
                  <h4 className="font-bold text-white">ReLU</h4>
                  <div className="text-xs text-blue-400 font-mono bg-blue-500/10 px-2 py-1 rounded">f(z) = max(0, z)</div>
                  <p className="text-xs text-gray-400 mt-2">Outputs input if positive, 0 if negative. Extremely fast to compute. Standard for hidden layers.</p>
                </div>
                {/* Tanh */}
                <div className="bg-[#111827] border border-white/10 p-4 rounded-xl flex flex-col items-center text-center gap-2">
                  <h4 className="font-bold text-white">Tanh</h4>
                  <div className="text-xs text-blue-400 font-mono bg-blue-500/10 px-2 py-1 rounded">f(z) = (eᶻ - e⁻ᶻ) / (eᶻ + e⁻ᶻ)</div>
                  <p className="text-xs text-gray-400 mt-2">Squishes outputs to (-1, 1). Centers data at zero, often performs better than sigmoid.</p>
                </div>
              </div>
            </div>
          </section>

          {/* 5. Forward Propagation */}
          <section id="forward" className="scroll-mt-12 space-y-6">
            <h2 className="text-3xl font-bold text-white flex items-center gap-3">
              <ArrowRight className="text-blue-500" /> 5. Forward Propagation
            </h2>
            <div className="bg-white/[0.03] border border-white/10 p-6 rounded-2xl text-gray-300">
              <p className="mb-4">
                Forward propagation is the process of pushing data from the inputs all the way to the output node to get a prediction. It literally "flows forward".
              </p>
              <ol className="list-decimal pl-5 space-y-3 bg-[#111827] p-5 rounded-xl border border-white/5 font-mono text-sm">
                <li>Load inputs <span className="text-emerald-400">X₁, X₂</span> into the Input Layer.</li>
                <li>For each hidden neuron, compute the weighted sum: <span className="text-blue-400">Z₁ = (W₁*X₁ + W₂*X₂) + b₁</span></li>
                <li>Apply the activation function: <span className="text-purple-400">A₁ = ReLU(Z₁)</span></li>
                <li>Pass <span className="text-purple-400">A₁</span> as the input to the next layer.</li>
                <li>Repeat until the final Output Node produces <span className="text-yellow-400">Y_pred</span>.</li>
              </ol>
            </div>
          </section>

          {/* 6. Loss Function */}
          <section id="loss" className="scroll-mt-12 space-y-6">
            <h2 className="text-3xl font-bold text-white flex items-center gap-3">
              <Target className="text-blue-500" /> 6. Loss Function
            </h2>
            <div className="bg-white/[0.03] border border-white/10 p-6 rounded-2xl text-gray-300">
              <p className="mb-4">
                Once the network predicts a value (<code>Y_pred</code>), we need to know how wrong it was compared to the actual truth (<code>Y_actual</code>). The <strong>Loss Function</strong> calculates this error.
              </p>
              
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1 bg-[#111827] p-5 rounded-xl border border-rose-500/20">
                  <h4 className="text-rose-400 font-bold mb-2">Mean Squared Error (MSE)</h4>
                  <div className="font-mono text-xs text-white/80 bg-white/5 p-2 rounded mb-2 text-center">Loss = ½ (Y_pred - Y_actual)²</div>
                  <p className="text-xs text-gray-400">Used mostly for <strong>Regression</strong> (predicting continuous numbers like house prices).</p>
                </div>
                <div className="flex-1 bg-[#111827] p-5 rounded-xl border border-emerald-500/20">
                  <h4 className="text-emerald-400 font-bold mb-2">Binary Cross-Entropy</h4>
                  <div className="font-mono text-xs text-white/80 bg-white/5 p-2 rounded mb-2 text-center">Loss = -[y*log(p) + (1-y)*log(1-p)]</div>
                  <p className="text-xs text-gray-400">Used mostly for <strong>Classification</strong> (predicting categories, like True/False logic gates!).</p>
                </div>
              </div>
            </div>
          </section>

          {/* 7. Training & Backpropagation */}
          <section id="training" className="scroll-mt-12 space-y-6">
            <h2 className="text-3xl font-bold text-white flex items-center gap-3">
              <RefreshCw className="text-blue-500" /> 7. Training & Backpropagation
            </h2>
            <div className="bg-white/[0.03] border border-white/10 p-6 rounded-2xl text-gray-300 space-y-4">
              <p>
                <strong>Training</strong> is the process of updating the weights and biases to reduce the Loss. 
                We use an algorithm called <strong>Backpropagation</strong> combined with Gradient Descent.
              </p>
              
              <div className="bg-purple-900/20 border border-purple-500/30 p-5 rounded-xl flex gap-4">
                <Lightbulb className="text-purple-400 shrink-0 mt-1" />
                <div className="text-sm">
                  <strong className="text-purple-300 block mb-1">Intuition: The Shower Dial</strong>
                  <p className="text-purple-100/80">
                    Imagine trying to get the perfect shower temperature. You turn the dial (forward propagation) and feel the water. It's too hot (calculating loss). You send a signal back to your hand to turn the dial slightly to the cold side (backpropagation & gradient descent). You repeat this until it's perfect!
                  </p>
                </div>
              </div>

              <p className="text-sm border-l-2 border-blue-500 pl-4 py-1">
                <strong>Learning Rate:</strong> Determines how big of an adjustment you make to the weights at each step. Too small = takes forever. Too big = overshoots the perfect temperature.
              </p>
            </div>
          </section>

          {/* 8. Matrix Representation */}
          <section id="matrix" className="scroll-mt-12 space-y-6">
            <h2 className="text-3xl font-bold text-white flex items-center gap-3">
              <Grid className="text-blue-500" /> 8. Matrix Representation
            </h2>
            <div className="bg-white/[0.03] border border-white/10 p-6 rounded-2xl text-gray-300">
              <p className="mb-4">
                Instead of calculating neurons one by one, neural networks use linear algebra to compute <strong>an entire layer at once</strong> using matrices. This is why GPUs are used for AI!
              </p>
              
              <div className="flex justify-center my-6">
                <div className="bg-[#111827] text-white/90 p-6 rounded-xl border border-white/10 font-mono text-xl flex items-center gap-4 shadow-lg shadow-black/50">
                  <span className="text-emerald-400 font-bold">Z</span> = 
                  <span className="text-blue-400 font-bold">W</span> · 
                  <span className="text-purple-400 font-bold">X</span> + 
                  <span className="text-amber-400 font-bold">B</span>
                </div>
              </div>

              <ul className="text-sm space-y-2 grid sm:grid-cols-2 gap-4">
                <li><strong className="text-emerald-400">Z (Matrix)</strong>: Outputs for all neurons in the layer.</li>
                <li><strong className="text-blue-400">W (Matrix)</strong>: Rows represent neurons, columns represent previous inputs.</li>
                <li><strong className="text-purple-400">X (Vector)</strong>: All inputs from the previous layer.</li>
                <li><strong className="text-amber-400">B (Vector)</strong>: All biases for the current layer.</li>
              </ul>
            </div>
          </section>

          {/* 9. Decision Boundaries */}
          <section id="boundaries" className="scroll-mt-12 space-y-6">
            <h2 className="text-3xl font-bold text-white flex items-center gap-3">
              <Layout className="text-blue-500" /> 9. Decision Boundaries
            </h2>
            <div className="bg-white/[0.03] border border-white/10 p-6 rounded-2xl text-gray-300">
              <p className="mb-6">
                A decision boundary is a line (in 2D space) or a plane (in 3D space) that separates different classes of data. 
                In our playground, it separates the inputs that output "0" from those that output "1".
              </p>

              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="space-y-4">
                  <div>
                    <h4 className="text-white font-bold mb-1">Linear Separation (AND / OR)</h4>
                    <p className="text-sm text-gray-400">A single straight line can split the answers perfectly. A network without hidden layers can solve this simply by rotating that single line.</p>
                  </div>
                  <div>
                    <h4 className="text-white font-bold mb-1">Non-Linear Separation (XOR)</h4>
                    <p className="text-sm text-gray-400">Cannot be split by a straight line! We must bend the space. Hidden layers allow the network to "fold" the coordinate system so a line *can* divide the states.</p>
                  </div>
                </div>
                
                <div className="flex gap-4 items-center justify-center">
                  <div className="relative w-32 h-32 border border-white/20 rounded bg-[#111827] overflow-hidden">
                    <div className="absolute inset-x-0 bottom-0 top-1/2 bg-blue-500/20" />
                    <div className="absolute inset-x-0 top-0 bottom-1/2 bg-rose-500/20 border-b-2 border-white/50" />
                    <span className="absolute bottom-2 left-2 text-[10px] text-white">OR Gate</span>
                  </div>
                  <div className="relative w-32 h-32 border border-white/20 rounded bg-[#111827] overflow-hidden group">
                    {/* Fake curved XOR boundary */}
                    <svg viewBox="0 0 100 100" className="w-full h-full">
                      <path d="M 0 50 Q 50 100 100 50 L 100 0 L 0 0 Z" fill="rgba(244, 63, 94, 0.2)" />
                      <path d="M 0 50 Q 50 100 100 50 L 100 100 L 0 100 Z" fill="rgba(59, 130, 246, 0.2)" />
                      <path d="M 0 50 Q 50 100 100 50" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2" />
                    </svg>
                    <span className="absolute bottom-2 left-2 text-[10px] text-white">XOR Gate</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 10. Logic Gates Case Study */}
          <section id="logic-gates" className="scroll-mt-12 space-y-6">
            <h2 className="text-3xl font-bold text-white flex items-center gap-3">
              <Cpu className="text-blue-500" /> 10. Logic Gates Case Study (Solved)
            </h2>
            <div className="bg-white/[0.03] border border-white/10 p-6 lg:p-8 rounded-2xl">
              <p className="text-gray-300 mb-6">
                Let's manually solve the famous <strong>XOR problem</strong>. We use an architecture of 2 Inputs → 2 Hidden (ReLU) → 1 Output (Sigmoid).
              </p>
              
              <div className="space-y-6">
                <div className="bg-[#111827] border border-white/10 p-4 rounded-xl">
                  <h4 className="text-emerald-400 font-bold mb-2">Step 1: The Given God Mode Parameters</h4>
                  <ul className="grid grid-cols-2 gap-4 text-xs font-mono text-gray-300">
                    <li>Input: X₁ = 1, X₂ = 0</li>
                    <li>Hidden Node 1: w=[1,1], b=0</li>
                    <li>Hidden Node 2: w=[1,1], b=-1</li>
                    <li>Output Node: w=[2,-4], b=-1</li>
                  </ul>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-[#111827] border border-white/10 p-4 rounded-xl text-sm font-mono text-gray-300">
                    <h4 className="text-blue-400 font-bold mb-2 font-sans">Neuron 1 Calculation</h4>
                    z₁ = (1×1) + (1×0) + 0 = 1 <br/>
                    a₁ = ReLU(1) = 1
                  </div>
                  <div className="bg-[#111827] border border-white/10 p-4 rounded-xl text-sm font-mono text-gray-300">
                    <h4 className="text-blue-400 font-bold mb-2 font-sans">Neuron 2 Calculation</h4>
                    z₂ = (1×1) + (1×0) - 1 = 0 <br/>
                    a₂ = ReLU(0) = 0
                  </div>
                </div>

                <div className="bg-emerald-900/20 border border-emerald-500/30 p-4 rounded-xl text-sm font-mono">
                  <h4 className="text-emerald-400 font-bold mb-2 font-sans">Final Output Calculation</h4>
                  <p className="text-emerald-100/90 mb-2">Using outputs of Hidden Layer (1 and 0) as inputs for the Output Node:</p>
                  <p className="text-white">z₃ = (2×1) + (-4×0) - 1 = 1</p>
                  <p className="text-white font-bold text-lg mt-2">Y_pred = Sigmoid(1) ≈ 0.731</p>
                  <p className="text-emerald-300/80 text-xs mt-2 italic">Result leans towards 1, which perfectly matches our XOR Truth Table for [1,0]!</p>
                </div>
              </div>
            </div>
          </section>

          {/* 11. Parameters */}
          <section id="parameters" className="scroll-mt-12 space-y-6">
            <h2 className="text-3xl font-bold text-white flex items-center gap-3">
              <Sliders className="text-blue-500" /> 11. Parameters
            </h2>
            <div className="bg-white/[0.03] border border-white/10 p-6 rounded-2xl text-gray-300">
              <p className="mb-4">
                The "learnable" parts of the network are its Parameters (Weights and Biases). 
                When scaling up networks, calculating the total parameters helps estimate computing requirements.
              </p>
              <div className="bg-[#111827] p-4 rounded-xl border border-white/5 font-mono text-sm text-center mb-6">
                Total Params between Layer A and Layer B = (Nodes_A × Nodes_B) + Nodes_B
              </div>
              <p className="text-sm text-gray-400">
                <strong>Example:</strong> In a network converting a 28x28 pixel image (784 inputs) to a 10-node hidden layer, the connections alone are: (784 × 10) = 7,840 weights. Plus 10 biases = 7,850 total parameters just for that one layer! Latest LLMs have hundreds of billions.
              </p>
            </div>
          </section>

          {/* 12. FAQs */}
          <section id="faqs" className="scroll-mt-12 space-y-6">
            <h2 className="text-3xl font-bold text-white flex items-center gap-3">
              <HelpCircle className="text-blue-500" /> 12. Frequently Asked Questions
            </h2>
            <div className="space-y-3">
              
              <details className="group bg-white/[0.02] border border-white/10 rounded-xl">
                <summary className="flex justify-between items-center font-bold font-sans cursor-pointer list-none p-5 text-gray-200">
                  <span>Why XOR cannot be solved with one neuron?</span>
                  <span className="transition group-open:rotate-180">
                    <svg fill="none" height="24" shape-rendering="geometricPrecision" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                  </span>
                </summary>
                <div className="text-gray-400 p-5 pt-0 text-sm leading-relaxed border-t border-white/5 mt-2">
                  A single neuron produces a single straight line decision boundary. XOR requires a boundary that encircles points or creates an angle (combining two lines). Without a hidden layer to combine two distinct lines, it is mathematically impossible to isolate the true XOR outputs [0,1] and [1,0] from the false ones [0,0] and [1,1].
                </div>
              </details>

              <details className="group bg-white/[0.02] border border-white/10 rounded-xl">
                <summary className="flex justify-between items-center font-bold font-sans cursor-pointer list-none p-5 text-gray-200">
                  <span>What is the exact role of Bias?</span>
                  <span className="transition group-open:rotate-180">
                    <svg fill="none" height="24" shape-rendering="geometricPrecision" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                  </span>
                </summary>
                <div className="text-gray-400 p-5 pt-0 text-sm leading-relaxed border-t border-white/5 mt-2">
                  Weights dictate the steepness of the activation line, but Bias lets you shift the activation curve left or right. Without bias, every line MUST pass through the origin (0,0). Bias allows the network to say "don't activate until the input reaches a threshold of 5".
                </div>
              </details>

              <details className="group bg-white/[0.02] border border-white/10 rounded-xl">
                <summary className="flex justify-between items-center font-bold font-sans cursor-pointer list-none p-5 text-gray-200">
                  <span>Difference between training and prediction?</span>
                  <span className="transition group-open:rotate-180">
                    <svg fill="none" height="24" shape-rendering="geometricPrecision" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                  </span>
                </summary>
                <div className="text-gray-400 p-5 pt-0 text-sm leading-relaxed border-t border-white/5 mt-2">
                  <strong>Training</strong> runs forward propagation, checks the loss, and then runs backpropagation to change the weights. <strong>Prediction (Inference)</strong> only runs forward propagation to get an answer using already-established weights. Training is slow; prediction is fast.
                </div>
              </details>

              <details className="group bg-white/[0.02] border border-white/10 rounded-xl">
                <summary className="flex justify-between items-center font-bold font-sans cursor-pointer list-none p-5 text-gray-200">
                  <span>Why start with random weights?</span>
                  <span className="transition group-open:rotate-180">
                    <svg fill="none" height="24" shape-rendering="geometricPrecision" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                  </span>
                </summary>
                <div className="text-gray-400 p-5 pt-0 text-sm leading-relaxed border-t border-white/5 mt-2">
                  If we start with all weights at 0, every neuron in a hidden layer performs the exact same calculation during backpropagation. They will all update identically and remain exactly the same forever (Symmetry Problem). Random weights break this symmetry, allowing neurons to specialize in detecting different features.
                </div>
              </details>

            </div>
          </section>

        </div>
      </div>

    </div>
  );
}
