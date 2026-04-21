import { NetworkState, ForwardResult } from '../lib/nn';
import { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';

interface NetworkGraphProps {
  network: NetworkState;
  forwardResult: ForwardResult;
  setNetworkWeight?: (layer: number, neuron: number, prevNeuron: number, weight: number) => void;
  setNetworkBias?: (layer: number, neuron: number, bias: number) => void;
}

export default function NetworkGraph({ network, forwardResult, setNetworkWeight, setNetworkBias }: NetworkGraphProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // Node position overrides for dragging
  const [overrides, setOverrides] = useState<Record<string, {x: number, y: number}>>({});
  const [dragging, setDragging] = useState<{ layer: number, index: number } | null>(null);
  const [selectedEdge, setSelectedEdge] = useState<{ lIdx: number, targetIdx: number, sourceIdx: number, cx: number, cy: number, currentWeight: number } | null>(null);
  const [selectedNode, setSelectedNode] = useState<{ layer: number, index: number, x: number, y: number, currentBias: number } | null>(null);
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Element;
      if (popupRef.current && popupRef.current.contains(target)) return;
      if (target.closest && target.closest('.ignore-clickaway')) return;
      
      setSelectedEdge(null);
      setSelectedNode(null);
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const updateDim = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight
        });
      }
    };
    updateDim();
    window.addEventListener('resize', updateDim);
    return () => window.removeEventListener('resize', updateDim);
  }, []);

  // Reset dragged positions if network architecture physically changes
  useEffect(() => {
    setOverrides({});
    setDragging(null);
    setSelectedEdge(null);
    setSelectedNode(null);
  }, [network.layers.join(',')]);

  if (!network || !forwardResult || dimensions.width === 0) return <div ref={containerRef} className="flex-1 min-h-[300px]" />;

  const { layers } = network;
  const numLayers = layers.length;
  
  const paddingX = 60;
  const paddingY = 40;
  
  const widthAvailable = dimensions.width - paddingX * 2;
  const heightAvailable = dimensions.height - paddingY * 2;
  
  const layerSpacing = numLayers > 1 ? widthAvailable / (numLayers - 1) : 0;

  const rawNodes: { layer: number, index: number, x: number, y: number, a: number, z?: number, isBias?: boolean }[] = [];
  
  layers.forEach((numNodes, layerIdx) => {
    const x = paddingX + layerIdx * layerSpacing;
    const hasBias = layerIdx < numLayers - 1;
    const totalNodesVisual = hasBias ? numNodes + 1 : numNodes;
    
    const nodeSpacingY = totalNodesVisual > 1 ? heightAvailable / (totalNodesVisual - 1) : 0;
    
    for (let i = 0; i < numNodes; i++) {
      const y = paddingY + i * nodeSpacingY;
      rawNodes.push({
        layer: layerIdx,
        index: i,
        x,
        y: totalNodesVisual === 1 ? dimensions.height / 2 : y,
        a: forwardResult.a[layerIdx]?.[i] ?? 0,
        z: layerIdx > 0 ? forwardResult.z[layerIdx]?.[i] : undefined,
      });
    }
  });

  const nodes = rawNodes.map(n => {
    const key = `${n.layer}-${n.index}`;
    if (overrides[key]) {
      return { ...n, x: overrides[key].x, y: overrides[key].y };
    }
    return n;
  });

  const edges: { lIdx: number, targetIdx: number, sourceIdx: number, x1: number, y1: number, x2: number, y2: number, weight: number, highlight: number }[] = [];
  
  for (let l = 1; l < layers.length; l++) {
    const prevLayerNodes = nodes.filter(n => n.layer === l - 1 && !n.isBias);
    const currLayerNodes = nodes.filter(n => n.layer === l && !n.isBias);
    
    for (let j = 0; j < currLayerNodes.length; j++) {
      const targetNode = currLayerNodes[j];
      const weights = network.weights[l - 1][j];
      
      for (let k = 0; k < prevLayerNodes.length; k++) {
        const sourceNode = prevLayerNodes[k];
        const weight = weights[k];
        const activation = sourceNode.a;
        
        edges.push({
          lIdx: l - 1,
          targetIdx: j,
          sourceIdx: k,
          x1: sourceNode.x,
          y1: sourceNode.y,
          x2: targetNode.x,
          y2: targetNode.y,
          weight,
          highlight: Math.abs(weight * activation)
        });
      }
    }
  }

  const renderTooltip = (node: typeof nodes[0]) => {
    return `a: ${node.a.toFixed(3)}${node.z !== undefined ? `\nz: ${node.z.toFixed(3)}` : ''}`;
  }

  const handlePointerDown = (layer: number, index: number) => (e: React.PointerEvent) => {
    e.stopPropagation();
    (e.target as Element).setPointerCapture(e.pointerId);
    setDragging({ layer, index });
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!dragging || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setOverrides(prev => ({
      ...prev,
      [`${dragging.layer}-${dragging.index}`]: { x, y }
    }));
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (dragging) {
      if (e.target instanceof Element) e.target.releasePointerCapture(e.pointerId);
      setDragging(null);
    }
  };

  return (
    <div 
      ref={containerRef} 
      className="flex-1 relative bg-transparent overflow-hidden touch-none" 
      style={{ touchAction: 'none' }}
    >
      <span className="block text-[10px] uppercase tracking-[1px] text-[#9CA3AF] absolute top-5 left-5 pointer-events-none z-0">
        Visual Network Graph (Draggable)
      </span>

      <svg 
        width="100%" 
        height="100%" 
        className="absolute inset-0 z-0"
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
      >
        <defs>
          <filter id="glow-blue" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#3B82F6" floodOpacity="0.6"/>
          </filter>
          <filter id="glow-green" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#10B981" floodOpacity="0.6"/>
          </filter>
          <filter id="glow-amber" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#F59E0B" floodOpacity="0.6"/>
          </filter>
        </defs>

        {edges.map((edge, i) => {
          const isActive = Math.abs(edge.weight * (nodes.find(n => n.x === edge.x1 && n.y === edge.y1)?.a || 0)) > 0.5;
          const strokeColor = isActive ? (edge.weight > 0 ? '#10B981' : '#3B82F6') : 'rgba(255,255,255,0.15)';
          const strokeWidth = isActive ? Math.min(Math.max(Math.abs(edge.weight) * 1.5, 1), 3) : 1;
          const opacity = isActive ? 0.9 : 0.3;
          const cx = (edge.x1 + edge.x2) / 2;
          const cy = (edge.y1 + edge.y2) / 2;
          const isSelected = selectedEdge?.lIdx === edge.lIdx && selectedEdge?.targetIdx === edge.targetIdx && selectedEdge?.sourceIdx === edge.sourceIdx;
          
          return (
            <g key={`edge-${i}`}>
              <line 
                x1={edge.x1} 
                y1={edge.y1} 
                x2={edge.x2} 
                y2={edge.y2} 
                stroke={strokeColor} 
                strokeWidth={isSelected ? strokeWidth + 2 : strokeWidth}
                strokeOpacity={opacity}
                className="transition-colors duration-300"
              />
              <line 
                x1={edge.x1} 
                y1={edge.y1} 
                x2={edge.x2} 
                y2={edge.y2} 
                stroke="transparent" 
                strokeWidth={20}
                className="cursor-pointer hover:stroke-white/10 ignore-clickaway"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedNode(null);
                  setSelectedEdge({ lIdx: edge.lIdx, targetIdx: edge.targetIdx, sourceIdx: edge.sourceIdx, cx, cy, currentWeight: edge.weight })
                }}
              />
              
              <g transform={`translate(${cx}, ${cy})`} className="pointer-events-none">
                <rect x="-16" y="-8" width="32" height="16" fill="#111827" fillOpacity="0.8" rx="4" />
                <text textAnchor="middle" dy="0.3em" className="text-[9px] font-mono fill-[#9CA3AF]">
                  {edge.weight.toFixed(1)}
                </text>
              </g>
            </g>
          );
        })}

        {nodes.map((node, i) => {
          const isActive = node.a > 0.5;
          const isOutput = node.layer === numLayers - 1;
          const isHidden = node.layer > 0 && !isOutput;
          const isDragging = dragging?.layer === node.layer && dragging?.index === node.index;
          
          let baseStroke = '#3B82F6';
          let glowFilter = 'url(#glow-blue)';
          
          if (isOutput) {
            baseStroke = '#10B981';
            glowFilter = 'url(#glow-green)';
          } else if (isHidden) {
            baseStroke = '#F59E0B';
            glowFilter = 'url(#glow-amber)';
          }

          return (
            <g key={`node-wrapper-${i}`}>
              <g 
                key={`node-${i}`} 
                className={clsx(
                  "cursor-grab active:cursor-grabbing",
                  isDragging && "z-10"
                )}
                onPointerDown={handlePointerDown(node.layer, node.index)}
              >
                <title>{renderTooltip(node)}</title>
                <circle 
                  cx={node.x} 
                  cy={node.y} 
                  r={24} 
                  fill={isActive ? baseStroke : '#1F2937'}
                  stroke={baseStroke}
                  strokeWidth={isDragging ? 4 : 2}
                  filter={isActive || isDragging ? glowFilter : undefined}
                  className="transition-colors duration-300"
                />
                <text 
                  x={node.x} 
                  y={node.y + 1} 
                  dy="0.3em" 
                  textAnchor="middle" 
                  className={clsx(
                    "text-sm font-bold font-sans select-none pointer-events-none", 
                    isActive ? "fill-white" : "fill-[#E5E7EB]"
                  )}
                >
                  {node.layer === 0 ? `x${node.index + 1}` : (isOutput ? 'y' : `h${node.layer},${node.index + 1}`)}
                </text>
              </g>

              {node.layer > 0 && (
                <g 
                   transform={`translate(${node.x}, ${node.y + 36})`} 
                   className="cursor-pointer hover:opacity-100 opacity-80 ignore-clickaway"
                   onPointerDown={(e) => {
                     e.stopPropagation();
                     setSelectedEdge(null);
                     const bias = network.biases[node.layer - 1][node.index];
                     setSelectedNode({ layer: node.layer - 1, index: node.index, x: node.x, y: node.y, currentBias: bias });
                   }}
                >
                  <rect x="-20" y="-10" width="40" height="20" fill="#111827" fillOpacity="0.9" rx="4" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
                  <text textAnchor="middle" dy="0.3em" className="text-[9px] font-mono fill-[#3B82F6]">
                    b={(network.biases[node.layer - 1][node.index] || 0).toFixed(1)}
                  </text>
                </g>
              )}
            </g>
          );
        })}
      </svg>

      {(selectedEdge || selectedNode) && (
        <div ref={popupRef} className="absolute z-20 pointer-events-auto">
          {selectedEdge && (
            <div 
              className="absolute bg-[#111827] border border-white/20 p-3 rounded-[8px] shadow-xl flex flex-col gap-3 items-center"
              style={{ 
                left: selectedEdge.cx, 
                top: selectedEdge.cy, 
                transform: 'translate(-50%, -100%)',
                marginTop: '-10px'
              }}
            >
              <div className="flex justify-between w-full text-[10px] items-center">
                <span className="text-[#9CA3AF] uppercase tracking-wider">Weight</span>
                <button className="ml-2 text-white/50 hover:text-white pb-1" onClick={() => setSelectedEdge(null)}>✕</button>
              </div>
              <div className="flex gap-2 items-center">
                <input 
                  type="range" 
                  min="-10" 
                  max="10" 
                  step="0.01" 
                  value={selectedEdge.currentWeight}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    setSelectedEdge({ ...selectedEdge, currentWeight: val });
                    setNetworkWeight?.(selectedEdge.lIdx, selectedEdge.targetIdx, selectedEdge.sourceIdx, val);
                  }}
                  className="w-24 outline-none accent-blue-500"
                />
                <input 
                  type="number"
                  step="0.1"
                  value={parseFloat(selectedEdge.currentWeight.toFixed(3))}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value) || 0;
                    setSelectedEdge({ ...selectedEdge, currentWeight: val });
                    setNetworkWeight?.(selectedEdge.lIdx, selectedEdge.targetIdx, selectedEdge.sourceIdx, val);
                  }}
                  className="w-16 bg-[#1F2937] border border-white/10 text-white text-xs px-2 py-1 rounded outline-none focus:border-blue-500"
                />
              </div>
            </div>
          )}

          {selectedNode && (
            <div 
              className="absolute bg-[#111827] border border-white/20 p-3 rounded-[8px] shadow-xl flex flex-col gap-3 items-center"
              style={{ 
                left: selectedNode.x, 
                top: selectedNode.y + 45, 
                transform: 'translate(-50%, 0)'
              }}
            >
              <div className="flex justify-between w-full text-[10px] items-center">
                <span className="text-[#9CA3AF] uppercase tracking-wider">Bias</span>
                <button className="ml-2 text-white/50 hover:text-white pb-1" onClick={() => setSelectedNode(null)}>✕</button>
              </div>
              <div className="flex gap-2 items-center">
                <input 
                  type="range" 
                  min="-10" 
                  max="10" 
                  step="0.01" 
                  value={selectedNode.currentBias}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    setSelectedNode({ ...selectedNode, currentBias: val });
                    setNetworkBias?.(selectedNode.layer, selectedNode.index, val);
                  }}
                  className="w-24 outline-none accent-blue-500"
                />
                <input 
                  type="number"
                  step="0.1"
                  value={parseFloat(selectedNode.currentBias.toFixed(3))}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value) || 0;
                    setSelectedNode({ ...selectedNode, currentBias: val });
                    setNetworkBias?.(selectedNode.layer, selectedNode.index, val);
                  }}
                  className="w-16 bg-[#1F2937] border border-white/10 text-white text-xs px-2 py-1 rounded outline-none focus:border-blue-500"
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
