export type Activation = 'sigmoid' | 'relu' | 'tanh' | 'linear';

export function sigmoid(x: number): number {
  return 1 / (1 + Math.exp(-x));
}

export function sigmoidDerivative(x: number): number {
  const s = sigmoid(x);
  return s * (1 - s);
}

export function relu(x: number): number {
  return Math.max(0, x);
}

export function reluDerivative(x: number): number {
  return x > 0 ? 1 : 0;
}

export function tanh(x: number): number {
  return Math.tanh(x);
}

export function tanhDerivative(x: number): number {
  const t = Math.tanh(x);
  return 1 - t * t;
}

export function linear(x: number): number {
  return x;
}

export function linearDerivative(x: number): number {
  return 1;
}

export function activate(x: number, type: Activation): number {
  switch (type) {
    case 'sigmoid': return sigmoid(x);
    case 'relu': return relu(x);
    case 'tanh': return tanh(x);
    case 'linear': return linear(x);
  }
}

export function activateDerivative(x: number, type: Activation): number {
  switch (type) {
    case 'sigmoid': return sigmoidDerivative(x);
    case 'relu': return reluDerivative(x);
    case 'tanh': return tanhDerivative(x);
    case 'linear': return linearDerivative(x);
  }
}

export interface NetworkState {
  layers: number[];
  weights: number[][][]; // weights[layer][neuron][prevNeuron]
  biases: number[][];    // biases[layer][neuron]
  activations: Activation[];
}

export interface ForwardResult {
  a: number[][]; // Activations per layer
  z: number[][]; // Weighted sums per layer
}

export function createNetwork(layers: number[], activations: Activation[]): NetworkState {
  const weights: number[][][] = [];
  const biases: number[][] = [];

  for (let i = 1; i < layers.length; i++) {
    const layerWeights: number[][] = [];
    const layerBiases: number[] = [];
    for (let j = 0; j < layers[i]; j++) {
      const prevWeights: number[] = [];
      for (let k = 0; k < layers[i - 1]; k++) {
        // Initialize with random numbers between -1 and 1
        prevWeights.push(Math.random() * 2 - 1);
      }
      layerWeights.push(prevWeights);
      layerBiases.push(Math.random() * 2 - 1);
    }
    weights.push(layerWeights);
    biases.push(layerBiases);
  }

  return { layers, weights, biases, activations };
}

export function forwardPropagate(network: NetworkState, input: number[]): ForwardResult {
  const a: number[][] = [input];
  const z: number[][] = [[]]; // Input layer has no z

  for (let i = 0; i < network.weights.length; i++) {
    const layerWeights = network.weights[i];
    const layerBiases = network.biases[i];
    const activationFunc = network.activations[i];
    
    const prevA = a[i];
    const currentZ: number[] = [];
    const currentA: number[] = [];

    for (let j = 0; j < layerWeights.length; j++) {
      let sum = layerBiases[j];
      for (let k = 0; k < layerWeights[j].length; k++) {
        sum += layerWeights[j][k] * prevA[k];
      }
      currentZ.push(sum);
      currentA.push(activate(sum, activationFunc));
    }

    z.push(currentZ);
    a.push(currentA);
  }

  return { a, z };
}

export function backPropagate(
  network: NetworkState,
  input: number[],
  target: number[],
  learningRate: number = 0.5
): number {
  const { a, z } = forwardPropagate(network, input);
  
  // Weights and biases gradients
  const dW: number[][][] = [];
  const db: number[][] = [];
  
  for (let i = 0; i < network.weights.length; i++) {
    dW.push(network.weights[i].map(row => row.map(() => 0)));
    db.push(network.biases[i].map(() => 0));
  }

  // Calculate output layer errors (delta)
  const numLayers = network.weights.length;
  let delta: number[] = [];
  const outputA = a[numLayers];
  const outputZ = z[numLayers];
  const outputErr: number[] = [];
  
  // Mean Squared Error derivative for output layer
  for (let j = 0; j < target.length; j++) {
    const error = (outputA[j] - target[j]);
    outputErr.push(error);
    const deriv = activateDerivative(outputZ[j], network.activations[numLayers - 1]);
    delta.push(error * deriv);
  }

  const loss = outputErr.reduce((sum, err) => sum + err * err, 0) / target.length; // MSE component

  // Compute gradients for output layer
  for (let j = 0; j < network.weights[numLayers - 1].length; j++) {
    db[numLayers - 1][j] = delta[j];
    for (let k = 0; k < network.weights[numLayers - 1][j].length; k++) {
      dW[numLayers - 1][j][k] = delta[j] * a[numLayers - 1][k];
    }
  }

  // Backpropagate to hidden layers
  for (let i = numLayers - 2; i >= 0; i--) {
    const nextDelta = delta;
    const nextWeights = network.weights[i + 1];
    delta = [];

    for (let j = 0; j < network.weights[i].length; j++) {
      let error = 0;
      for (let k = 0; k < nextDelta.length; k++) {
        error += nextDelta[k] * nextWeights[k][j];
      }
      const deriv = activateDerivative(z[i + 1][j], network.activations[i]);
      delta.push(error * deriv);
    }

    for (let j = 0; j < network.weights[i].length; j++) {
      db[i][j] = delta[j];
      for (let k = 0; k < network.weights[i][j].length; k++) {
        dW[i][j][k] = delta[j] * a[i][k];
      }
    }
  }

  // Update weights and biases
  for (let i = 0; i < network.weights.length; i++) {
    for (let j = 0; j < network.weights[i].length; j++) {
      network.biases[i][j] -= learningRate * db[i][j];
      for (let k = 0; k < network.weights[i][j].length; k++) {
        network.weights[i][j][k] -= learningRate * dW[i][j][k];
      }
    }
  }

  return loss;
}

export function trainEpoch(
  network: NetworkState,
  inputs: number[][],
  targets: number[][],
  learningRate: number = 0.5
): number {
  let totalLoss = 0;
  for (let i = 0; i < inputs.length; i++) {
    totalLoss += backPropagate(network, inputs[i], targets[i], learningRate);
  }
  return totalLoss / inputs.length;
}

export const TRUTH_TABLES = {
  AND: {
    inputs: [[0, 0], [0, 1], [1, 0], [1, 1]],
    outputs: [[0], [0], [0], [1]],
  },
  OR: {
    inputs: [[0, 0], [0, 1], [1, 0], [1, 1]],
    outputs: [[0], [1], [1], [1]],
  },
  XOR: {
    inputs: [[0, 0], [0, 1], [1, 0], [1, 1]],
    outputs: [[0], [1], [1], [0]],
  }
};
