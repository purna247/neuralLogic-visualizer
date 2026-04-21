import { Component, ReactNode } from 'react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export default class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0A0A0B] text-white p-10 font-sans">
          <h1 className="text-xl font-bold text-red-500 mb-4">Application Error</h1>
          <p className="text-[#9CA3AF] mb-4">Something went wrong while rendering the UI.</p>
          <pre className="bg-[#1F2937] p-4 rounded text-sm text-red-300 overflow-auto border border-red-500/20">
            {this.state.error?.message}
            {'\n'}
            {this.state.error?.stack}
          </pre>
        </div>
      );
    }

    return this.props.children;
  }
}
