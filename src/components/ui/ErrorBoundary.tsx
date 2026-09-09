import { Component, type ErrorInfo, type ReactNode } from "react";

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

export default class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error("Uncaught error:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-(--bg-primary) px-6">
          <div className="max-w-md text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-(--accent-color) font-interface">
              TaskFlow
            </p>
            <h1 className="mt-2 text-2xl font-bold text-(--text-primary)">
              Something went wrong
            </h1>
            <p className="mt-2 text-sm text-(--text-muted) font-interface">
              An unexpected error occurred. Refresh the page to try again.
            </p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-6 rounded-lg bg-(--accent-color) px-4 py-2 text-sm font-semibold text-(--text-white)"
            >
              Reload
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}