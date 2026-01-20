import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        // Update state so the next render will show the fallback UI.
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        // You can also log the error to an error reporting service
        console.error("Uncaught error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            // You can render any custom fallback UI
            return (
                <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50">
                    <div className="max-w-md w-full text-center space-y-6">
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-100 text-red-600 mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Oops! Something went wrong</h1>
                        <p className="text-gray-600 text-lg leading-relaxed">
                            We encountered an unexpected error. Please try refreshing the page or navigating back home.
                        </p>
                        <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
                            <button
                                onClick={() => window.location.reload()}
                                className="px-8 py-3 bg-black text-white font-medium tracking-widest text-sm hover:bg-gray-800 transition-colors"
                            >
                                RELOAD PAGE
                            </button>
                            <button
                                onClick={() => window.location.href = '/'}
                                className="px-8 py-3 bg-white text-black border border-gray-200 font-medium tracking-widest text-sm hover:bg-gray-50 transition-colors"
                            >
                                GO HOME
                            </button>
                        </div>
                        {process.env.NODE_ENV === 'development' && (
                            <details className="mt-8 text-left bg-white p-4 rounded-lg border border-gray-200 shadow-sm overflow-auto max-h-48 text-xs font-mono">
                                <summary className="cursor-pointer font-bold text-red-500 mb-2">Error Details (Dev Only)</summary>
                                <pre>{this.state.error?.toString()}</pre>
                            </details>
                        )}
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
