<div align="center">
# NeuralLogic Visualizer

A gorgeous, interactive playground to build, train, and visualize Neural Networks right in your browser. Learn how models process logic gates layer-by-layer through forward and backpropagation!

</div>

---

## ✨ Features

* **Interactive Network Architecture:** Build custom networks with adjustable hidden layers and visualize the connections (weights and biases).
* **Real-time Training Animation:** Watch the network learn with live-updating weight colors and loss charts.
* **Under-the-Hood Computation:** View the exact matrix math and activation outputs for every step of the forward pass.
* **Customizable Hyperparameters:** Tweak learning rates, activation functions (Sigmoid, ReLU, Tanh, Linear), and max epochs to see how they impact training speed.
* **Built-in Tour:** A quick interactive tutorial to get you started immediately.

## 🛠 Tech Stack

* **Frontend:** React 19, TypeScript
* **Styling:** Tailwind CSS (v4) with dark glassmorphic UI elements
* **Build Tool:** Vite

## 💻 Local Installation & Setup

You can run this fully offline, right on your machine!

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd neurallogic-visualizer
   ```

2. **Install dependencies:**
   Make sure you have Node.js installed.
   ```bash
   npm install
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Open in browser:**
   Navigate to `http://localhost:3000` to start experimenting.

## 📖 How it Works

The Visualizer trains a simple multi-layer perceptron (MLP) from scratch using custom, vanilla TypeScript mathematics (no external ML libraries used for the core logic). It comes pre-loaded with truth tables for classic logic gates:
* **AND**
* **OR**
* **XOR** (The classic non-linear problem!)

You can manipulate the input values ($x_1$, $x_2$) and see how the trained network predicts the output!

## 📄 License

This project is licensed under the [MIT License](LICENSE).
