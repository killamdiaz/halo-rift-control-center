
import React, { useState, useEffect } from 'react';
import { Brain, AlertCircle, CheckCircle, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DiagnosticAlert {
  id: string;
  deviceId: string;
  deviceName: string;
  severity: 'error' | 'warning' | 'info';
  message: string;
  suggestion: string;
  timestamp: Date;
}

const SmartDiagnostics: React.FC = () => {
  const [alerts, setAlerts] = useState<DiagnosticAlert[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Simulate smart diagnostics
  useEffect(() => {
    const generateAlerts = () => {
      const possibleAlerts: Omit<DiagnosticAlert, 'id' | 'timestamp'>[] = [
        {
          deviceId: 'gun-001',
          deviceName: 'Primary Gun',
          severity: 'warning',
          message: 'Experiencing 8% packet loss',
          suggestion: 'Try reducing distance from the PC or check for interference'
        },
        {
          deviceId: 'suit-001',
          deviceName: 'Tactical Suit',
          severity: 'error',
          message: 'No pressure data detected',
          suggestion: 'Check if device is powered on and sensors are properly connected'
        },
        {
          deviceId: 'shoe-left-001',
          deviceName: 'Left Shoe',
          severity: 'warning',
          message: 'Battery level below 20%',
          suggestion: 'Consider charging device before next session'
        },
        {
          deviceId: 'gun-001',
          deviceName: 'Primary Gun',
          severity: 'info',
          message: 'Optimal performance detected',
          suggestion: 'All systems functioning within normal parameters'
        }
      ];

      // Randomly add alerts
      if (Math.random() > 0.7) {
        const randomAlert = possibleAlerts[Math.floor(Math.random() * possibleAlerts.length)];
        const newAlert: DiagnosticAlert = {
          ...randomAlert,
          id: `alert-${Date.now()}`,
          timestamp: new Date()
        };

        setAlerts(prev => {
          // Don't add duplicate alerts
          if (prev.some(alert => alert.message === newAlert.message && alert.deviceId === newAlert.deviceId)) {
            return prev;
          }
          return [newAlert, ...prev].slice(0, 5); // Keep only latest 5 alerts
        });
      }
    };

    const interval = setInterval(generateAlerts, 5000);
    return () => clearInterval(interval);
  }, []);

  const runDiagnostics = async () => {
    setIsAnalyzing(true);
    
    // Simulate analysis
    setTimeout(() => {
      setIsAnalyzing(false);
      const analysisAlert: DiagnosticAlert = {
        id: `analysis-${Date.now()}`,
        deviceId: 'system',
        deviceName: 'HALO System',
        severity: 'info',
        message: 'Diagnostic scan completed',
        suggestion: 'All devices analyzed. Check individual alerts for recommendations.',
        timestamp: new Date()
      };
      setAlerts(prev => [analysisAlert, ...prev].slice(0, 5));
    }, 3000);
  };

  const dismissAlert = (alertId: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== alertId));
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'error': return <AlertCircle className="w-4 h-4 text-red-400" />;
      case 'warning': return <AlertCircle className="w-4 h-4 text-yellow-400" />;
      case 'info': return <Info className="w-4 h-4 text-blue-400" />;
      default: return <CheckCircle className="w-4 h-4 text-green-400" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'error': return 'border-red-400 bg-red-400';
      case 'warning': return 'border-yellow-400 bg-yellow-400';
      case 'info': return 'border-blue-400 bg-blue-400';
      default: return 'border-green-400 bg-green-400';
    }
  };

  return (
    <div className="bg-black bg-opacity-40 backdrop-blur-lg border border-halo-accent border-opacity-20 rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-halo-accent flex items-center">
          <Brain className="w-5 h-5 mr-2" />
          Smart Diagnostics AI
        </h3>
        <Button
          onClick={runDiagnostics}
          disabled={isAnalyzing}
          className="bg-halo-accent text-black hover:bg-halo-accent hover:opacity-80"
          size="sm"
        >
          {isAnalyzing ? (
            <>
              <div className="animate-spin w-4 h-4 border-2 border-black border-t-transparent rounded-full mr-2" />
              Analyzing...
            </>
          ) : (
            'Run Diagnostics'
          )}
        </Button>
      </div>

      <div className="space-y-3">
        {alerts.length === 0 && !isAnalyzing && (
          <div className="text-center py-8 text-gray-400">
            <CheckCircle className="w-8 h-8 mx-auto mb-2 text-green-400" />
            <p>All systems optimal</p>
            <p className="text-sm">No diagnostic alerts</p>
          </div>
        )}

        {alerts.map(alert => (
          <div
            key={alert.id}
            className={`p-4 rounded-lg border bg-opacity-10 ${getSeverityColor(alert.severity)}`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3">
                {getSeverityIcon(alert.severity)}
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-white">{alert.deviceName}</span>
                    <span className="text-xs text-gray-400">
                      {alert.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-sm text-white mt-1">{alert.message}</p>
                  <p className="text-xs text-gray-300 mt-2">{alert.suggestion}</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => dismissAlert(alert.id)}
                className="text-gray-400 hover:text-white p-1"
              >
                ×
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SmartDiagnostics;
