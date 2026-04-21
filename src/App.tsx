import { useState, useEffect } from 'react';
import { Joyride, Step, STATUS } from 'react-joyride';
import { HelpCircle } from 'lucide-react';
import { createNetwork, NetworkState, TRUTH_TABLES, forwardPropagate, trainEpoch, ForwardResult } from './lib/nn';
import ControlPanel from './components/ControlPanel';
import NetworkGraph from './components/NetworkGraph';
import ComputationPanel from './components/ComputationPanel';
import ChartsPanel from './components/ChartsPanel';
import Sidebar from './components/Sidebar';
import Docs from './pages/Docs';

export type GateType = 'AND' | 'OR' | 'XOR';
import { Activation } from './lib/nn';

export default function App() {
  const [currentPage, setCurrentPage] = useState<'playground' | 'docs'>('playground');
  const [gateType, setGateType] = useState<GateType>('XOR');
  const [x1, setX1] = useState<0 | 1>(1);
  const [x2, setX2] = useState<0 | 1>(0);
  const [hiddenLayers, setHiddenLayers] = useState<number[]>([2]);
  const [hiddenActivation, setHiddenActivation] = useState<Activation>('sigmoid');
  const [outputActivation, setOutputActivation] = useState<Activation>('sigmoid');
  const [learningRate, setLearningRate] = useState<number | string>(0.2);
  const [maxEpochs, setMaxEpochs] = useState<number | string>(50000);
  
  const [network, setNetwork] = useState<NetworkState | null>(null);
  const [forwardResult, setForwardResult] = useState<ForwardResult | null>(null);
  const [lossHistory, setLossHistory] = useState<{epoch: number, loss: number}[]>([]);
  const [isTraining, setIsTraining] = useState(false);
  const [epochCount, setEpochCount] = useState(0);

  const [runTour, setRunTour] = useState(false);

  const tourSteps: Step[] = [
    {
      target: 'body',
      content: 'Welcome to NeuralLogic Visualizer! Let\'s take a quick tour of how to use this playground to learn Neural Networks.',
      placement: 'center',
    },
    {
      target: '#tour-controls',
      content: 'This is the Control Panel. Here you can configure the neural network\'s architecture, change the Logic Gate to train on, and manually toggle test inputs (x1, x2).',
      placement: 'right',
    },
    {
      target: '#tour-training',
      content: 'Here you can adjust the Learning Rate and Max Epochs. Click "Train Network" to watch the model learn automatically!',
      placement: 'right',
    },
    {
      target: '#tour-architecture',
      content: 'This is the Architecture Graph. As the model trains, the connections (weights) will change color (green for positive, blue for negative). You can also click on any weight or bias to manually edit it!',
      placement: 'bottom',
    },
    {
      target: '#tour-computation',
      content: 'The Computation Panel shows exactly what is happening under the hood. It displays the step-by-step matrix math and activation outputs for the current forward pass.',
      placement: 'left',
    },
    {
      target: '#tour-charts',
      content: 'Finally, the Charts Panel tracks the Loss over time, and shows the 2D Decision Boundary space so you can visually see how the network is separating the data classes!',
      placement: 'top',
    }
  ];

  const initNetwork = (gate: GateType, layers: number[], hAct: Activation, oAct: Activation) => {
    let newNet: NetworkState;
    if (layers.length === 0) {
      newNet = createNetwork([2, 1], [oAct]);
    } else {
      newNet = createNetwork([2, ...layers, 1], [...layers.map(() => hAct), oAct]);
    }
    setNetwork(newNet);
    setLossHistory([]);
    setEpochCount(0);
    setIsTraining(false);
    updateForwardPass(newNet, x1, x2);
  };

  const updateForwardPass = (net: NetworkState, in1: number, in2: number) => {
    const res = forwardPropagate(net, [in1, in2]);
    setForwardResult(res);
  };

  const setNetworkWeight = (layer: number, neuron: number, prevNeuron: number, weight: number) => {
    if (!network) return;
    const newNet = { ...network };
    newNet.weights[layer][neuron][prevNeuron] = weight;
    setNetwork(newNet);
    updateForwardPass(newNet, x1, x2);
  };

  const setNetworkBias = (layer: number, neuron: number, bias: number) => {
    if (!network) return;
    const newNet = { ...network };
    newNet.biases[layer][neuron] = bias;
    setNetwork(newNet);
    updateForwardPass(newNet, x1, x2);
  };

  useEffect(() => {
    initNetwork(gateType, hiddenLayers, hiddenActivation, outputActivation);
  }, [gateType, hiddenLayers.join(','), hiddenActivation, outputActivation]);

  useEffect(() => {
    // Auto-predict immediately when inputs change for a more responsive UI
    if (network && !isTraining) {
      updateForwardPass(network, x1, x2);
    }
  }, [x1, x2, network, isTraining]);

  useEffect(() => {
    let animationFrameId: number;
    let currentEpoch = epochCount;
    let localLossHistory = [...lossHistory];

    const trainStep = () => {
      if (!isTraining || !network) return;

      const data = TRUTH_TABLES[gateType];
      
      const currentLr = typeof learningRate === 'number' ? learningRate : (Number(learningRate) || 0.05);
      const currentMaxEpochs = typeof maxEpochs === 'number' ? maxEpochs : (Number(maxEpochs) || 10000);
      
      let loss = 0;
      // Increased from 10 to 50 epochs per animation frame for dramatically faster UI training
      for(let i=0; i<50; i++){
        loss = trainEpoch(network, data.inputs, data.outputs, currentLr);
        currentEpoch++;
      }
      
      localLossHistory.push({ epoch: currentEpoch, loss });
      
      setEpochCount(currentEpoch);
      if (localLossHistory.length > 200) {
        localLossHistory = localLossHistory.filter((_, i) => i % 2 === 0);
      }
      setLossHistory([...localLossHistory]);
      
      setNetwork({ ...network });
      updateForwardPass(network, x1, x2);

      // Stop training if loss is very close to 0 (early stopping) or we hit max epochs
      if (loss < 0.0001 || currentEpoch >= currentMaxEpochs) {
        setIsTraining(false);
      } else {
        animationFrameId = requestAnimationFrame(trainStep);
      }
    };

    if (isTraining) {
      animationFrameId = requestAnimationFrame(trainStep);
    }

    return () => cancelAnimationFrame(animationFrameId);
  }, [isTraining, gateType, learningRate, maxEpochs]);

  if (!network || !forwardResult) return <div className="min-h-screen bg-[#0A0A0B] text-white p-10 font-sans">Loading Network State...</div>;

  return (
    <div className="flex h-[100dvh] lg:h-screen w-full bg-[#0A0A0B] font-sans overflow-hidden">
      <Joyride
        {...({
          steps: tourSteps,
          run: runTour,
          continuous: true,
          showProgress: true,
          showSkipButton: true,
          styles: {
            options: {
              arrowColor: '#1F2937',
              backgroundColor: '#1F2937',
              overlayColor: 'rgba(0, 0, 0, 0.7)',
              primaryColor: '#3B82F6',
              textColor: '#E5E7EB',
              width: 400,
              zIndex: 1000,
            },
            tooltipContainer: {
              textAlign: 'left'
            },
            buttonNext: {
              backgroundColor: '#3B82F6'
            },
            buttonBack: {
              color: '#9CA3AF'
            }
          },
          callback: (data: any) => {
            const { status } = data;
            if (([STATUS.FINISHED, STATUS.SKIPPED] as string[]).includes(status)) {
              setRunTour(false);
            }
          }
        } as any)}
      />
      <Sidebar 
        currentPage={currentPage} 
        setCurrentPage={setCurrentPage} 
        onStartTour={() => setRunTour(true)}
      />
      
      {currentPage === 'playground' ? (
        <div className="flex-1 text-[#E5E7EB] p-4 lg:p-[20px] box-border overflow-x-hidden overflow-y-auto custom-scrollbar">
          <div className="flex flex-col lg:grid lg:grid-cols-[260px_1fr_260px] lg:grid-rows-[auto_minmax(0,2fr)_minmax(0,1fr)] gap-[16px] lg:h-full max-w-[1280px] mx-auto pb-10 lg:pb-0">
            
            {/* Header */}
            <header className="order-1 lg:order-none lg:col-span-3 bg-white/[0.03] border border-white/10 rounded-[16px] px-[24px] py-[16px] lg:py-0 lg:h-[60px] flex flex-col sm:flex-row justify-between items-center gap-4 lg:gap-0 bg-gradient-to-r from-blue-500/10 to-transparent shrink-0">
              <div>
                <h1 className="text-[18px] font-bold m-0 text-white flex items-center gap-3">
                  NeuralLogic <span className="font-light opacity-60">Visualizer</span>
                  <button 
                    onClick={() => setRunTour(true)}
                    className="ml-2 flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-wider bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 px-3 py-1.5 rounded-full transition-colors border border-blue-500/30"
                  >
                    <HelpCircle size={12} />
                    Start Tour
                  </button>
                </h1>
              </div>
              <div className="flex flex-wrap justify-center gap-[12px] sm:gap-[20px] text-[12px] items-center">
                <span className="text-[#9CA3AF] inline">Epoch: {epochCount.toLocaleString()} / {Number(maxEpochs || 0).toLocaleString()}</span>
                <span className="text-[#9CA3AF] hidden sm:inline">Learning Rate: {Number(learningRate || 0).toFixed(3)}</span>
              </div>
            </header>

            {/* Center Panel (Graph) */}
            <main id="tour-architecture" className="order-2 lg:order-none bg-white/[0.03] border border-white/10 rounded-[16px] p-[20px] overflow-hidden flex flex-col relative lg:col-start-2 lg:row-start-2 min-h-[400px] lg:min-h-0 shrink-0">
              <NetworkGraph network={network} forwardResult={forwardResult} setNetworkWeight={setNetworkWeight} setNetworkBias={setNetworkBias} />
            </main>

            {/* Left Panel (Controls) */}
            <aside id="tour-controls" className="order-3 lg:order-none bg-white/[0.03] border border-white/10 rounded-[16px] p-[20px] overflow-visible lg:overflow-y-auto custom-scrollbar flex flex-col lg:col-start-1 lg:row-start-2 lg:row-span-2 shrink-0">
              <ControlPanel
                gateType={gateType}
                setGateType={setGateType}
                x1={x1}
                setX1={setX1}
                x2={x2}
                setX2={setX2}
                hiddenLayers={hiddenLayers}
                setHiddenLayers={setHiddenLayers}
                hiddenActivation={hiddenActivation}
                setHiddenActivation={setHiddenActivation}
                outputActivation={outputActivation}
                setOutputActivation={setOutputActivation}
                learningRate={learningRate}
                setLearningRate={setLearningRate}
                maxEpochs={maxEpochs}
                setMaxEpochs={setMaxEpochs}
                isTraining={isTraining}
                setIsTraining={setIsTraining}
                resetNetwork={() => initNetwork(gateType, hiddenLayers, hiddenActivation, outputActivation)}
                prediction={forwardResult.a[forwardResult.a.length - 1][0]}
              />
            </aside>

            {/* Right Panel (Computation) */}
            <section id="tour-computation" className="order-4 lg:order-none bg-white/[0.03] border border-white/10 rounded-[16px] p-[20px] overflow-visible lg:overflow-y-auto flex flex-col lg:col-start-3 lg:row-start-2 shrink-0">
              <ComputationPanel network={network} forwardResult={forwardResult} x1={x1} x2={x2} />
            </section>

            {/* Bottom Panel */}
            <ChartsPanel 
              network={network} 
              lossHistory={lossHistory} 
              gateType={gateType} 
              forwardResult={forwardResult}
            />
          </div>
        </div>
      ) : (
        <Docs />
      )}
    </div>
  );
}

