import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Component } from 'react';

/**
 * Error Boundary para capturar errores en la app
 * Muestra una UI amigable en lugar de crash
 */
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error capturado por ErrorBoundary:', error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.href = '/home';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-wahu-50 to-orange-50 p-4">
          <div className="max-w-md w-full">
            <div className="bg-white rounded-xl shadow-lg p-8 text-center space-y-6">
              {/* Icono */}
              <div className="flex justify-center">
                <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
                  <AlertTriangle size={32} className="text-red-600" />
                </div>
              </div>

              {/* Mensaje */}
              <div className="space-y-2">
                <h1 className="text-2xl font-bold text-gray-900">
                  ¡Oops! Algo salió mal
                </h1>
                <p className="text-gray-600 text-sm">
                  Parece que encontramos un error inesperado. Nuestro equipo ha sido notificado.
                </p>
              </div>

              {/* Detalles del error (solo en desarrollo) */}
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <div className="bg-gray-100 rounded-lg p-4 text-left space-y-2 max-h-48 overflow-y-auto">
                  <p className="font-mono text-xs text-red-600 font-bold">
                    {this.state.error.toString()}
                  </p>
                  {this.state.errorInfo?.componentStack && (
                    <details className="text-xs text-gray-600">
                      <summary className="cursor-pointer font-semibold">
                        Stack de componentes
                      </summary>
                      <pre className="mt-2 whitespace-pre-wrap break-words">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    </details>
                  )}
                </div>
              )}

              {/* Acciones */}
              <div className="flex gap-3">
                <button
                  onClick={this.handleReset}
                  className="flex-1 flex items-center justify-center gap-2 bg-wahu-500 hover:bg-wahu-600 text-white font-medium py-2.5 rounded-lg transition-colors"
                >
                  <RefreshCw size={18} />
                  Ir al inicio
                </button>
                <button
                  onClick={() => window.location.reload()}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2.5 rounded-lg transition-colors"
                >
                  Recargar
                </button>
              </div>

              {/* Contacto */}
              <p className="text-xs text-gray-500">
                Si el problema persiste, contacta a{' '}
                <a href="mailto:support@wahu.com" className="text-wahu-500 hover:underline">
                  support@wahu.com
                </a>
              </p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
