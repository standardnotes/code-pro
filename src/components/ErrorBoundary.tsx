import React, { ErrorInfo } from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

/**
 * Learn more about Error Boundaries here:
 * https://reactjs.org/docs/error-boundaries.html
 */

export default class ErrorBoundary extends React.Component<
  any,
  ErrorBoundaryState
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // You can also log the error to an error reporting service
    console.error('Error:', error, '\nError Info:', errorInfo);
    this.setState({
      error,
      errorInfo,
    });
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div className="error-boundary">
          <h1>Something went wrong.</h1>
          <p>
            Error Name: <code>{this.state.error?.name}</code>
          </p>
          <p>
            Error Message: <code>{this.state.error?.message}</code>
          </p>
          <p>
            Error Info: <code>{this.state.errorInfo}</code>
          </p>
          <p>Please see the developer console for details.</p>
          <hr></hr>
          <p>
            If the error persists and is not related to the content of your
            note, then please{' '}
            <a
              href="https://github.com/standardnotes/code-pro/issues/"
              target="_blank"
              rel="noopener noreferrer"
            >
              report the issue on GitHub
            </a>{' '}
            and we will try to fix it.
          </p>
        </div>
      );
    }

    return this.props.children;
  }
}
