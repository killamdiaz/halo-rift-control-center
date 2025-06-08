
import React, { useState, useEffect } from 'react';
import { Activity, Battery, Cpu, Zap, TrendingUp, AlertTriangle, CheckCircle2, Wifi, Upload, Download, Signal } from 'lucide-react';
import { Progress } from "@/components/ui/progress";

interface StatsPanelProps {
  deviceType: string;
}

const StatsPanel: React.FC<StatsPanelProps> = ({ deviceType }) => {
  const [latencyData, setLatencyData] = useState<number[]>([12, 15, 11, 18, 14, 13, 16, 12]);
  const [currentLatency, setCurrentLatency] = useState(12);

  // Simulate real-time latency updates
  useEffect(() => {
    const interval = setInterval(() => {
      const newLatency = Math.floor(Math.random() * 10) + 10; // 10-20ms
      setCurrentLatency(newLatency);
      setLatencyData(prev => [...prev.slice(1), newLatency]);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const getDeviceStats = () => {
    switch(deviceType) {
      case 'shoe':
        return {
          battery: 85,
          status: 'Connected',
          temperature: 32,
          pressure: '12.5 PSI',
          steps: 8743,
          distance: '6.2 km',
          signalStrength: 87,
          jitter: 2.3,
          uploadSpeed: '24.5',
          downloadSpeed: '156.8'
        };
      case 'gun':
        return {
          battery: 92,
          status: 'Ready',
          temperature: 28,
          accuracy: '94%',
          shots: 156,
          mode: 'Training',
          signalStrength: 92,
          jitter: 1.8,
          uploadSpeed: '18.2',
          downloadSpeed: '98.4'
        };
      case 'suit':
        return {
          battery: 15,
          status: 'Low Battery',
          temperature: 35,
          coverage: '89%',
          impacts: 23,
          zones: 'All Active',
          signalStrength: 45,
          jitter: 5.2,
          uploadSpeed: '8.1',
          downloadSpeed: '42.3'
        };
      default:
        return {
          battery: 0,
          status: 'Disconnected',
          temperature: 0,
          signalStrength: 0,
          jitter: 0,
          uploadSpeed: '0',
          downloadSpeed: '0'
        };
    }
  };

  const stats = getDeviceStats();
  const deviceName = deviceType.charAt(0).toUpperCase() + deviceType.slice(1);

  const getTemperatureColor = (temp: number) => {
    if (temp < 25) return 'bg-blue-500';
    if (temp < 35) return 'bg-green-500';
    if (temp < 45) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getSignalColor = (strength: number) => {
    if (strength > 80) return 'text-green-400';
    if (strength > 50) return 'text-yellow-400';
    return 'text-red-400';
  };

  const renderLatencyChart = () => {
    const maxValue = Math.max(...latencyData);
    const minValue = Math.min(...latencyData);
    const range = maxValue - minValue || 1;

    return (
      <div className="h-16 flex items-end space-x-1">
        {latencyData.map((value, index) => (
          <div
            key={index}
            className="bg-halo-accent bg-opacity-60 flex-1 min-w-1 rounded-t-sm transition-all duration-300"
            style={{
              height: `${((value - minValue) / range) * 100}%`,
              minHeight: '8px'
            }}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="w-80 bg-black bg-opacity-40 backdrop-blur-lg border-l border-halo-accent border-opacity-20 flex-shrink-0 fixed right-0 top-0 h-full">
      <div className="p-4 h-full overflow-y-auto" style={{ paddingTop: '80px' }}>
        <div className="space-y-4">
          {/* Device Header & Connection Status */}
          <div className="text-center space-y-3">
            <h2 className="text-lg font-bold text-halo-accent">HALO {deviceName.toUpperCase()}</h2>
            <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
              stats.status === 'Connected' || stats.status === 'Ready' 
                ? 'bg-green-500 bg-opacity-20 text-green-400 border border-green-500 border-opacity-30' 
                : stats.status === 'Low Battery'
                ? 'bg-orange-500 bg-opacity-20 text-orange-400 border border-orange-500 border-opacity-30'
                : 'bg-red-500 bg-opacity-20 text-red-400 border border-red-500 border-opacity-30'
            }`}>
              {stats.status === 'Connected' || stats.status === 'Ready' 
                ? <CheckCircle2 className="w-3 h-3 mr-1" />
                : <AlertTriangle className="w-3 h-3 mr-1" />
              }
              {stats.status}
            </div>
          </div>

          {/* Battery + Temperature + Signal + Pressure */}
          <div className="space-y-3">
            {/* Battery */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Battery className="w-4 h-4 text-halo-accent" />
                  <span className="text-sm text-white">Battery</span>
                </div>
                <span className="text-sm text-halo-accent font-medium">{stats.battery}%</span>
              </div>
              <Progress value={stats.battery} className="h-2" />
            </div>

            {/* Temperature */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Cpu className="w-4 h-4 text-halo-accent" />
                  <span className="text-sm text-white">Temperature</span>
                </div>
                <span className="text-sm text-white font-medium">{stats.temperature}°C</span>
              </div>
              <div className="h-2 bg-black bg-opacity-50 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${getTemperatureColor(stats.temperature)} transition-all duration-300`}
                  style={{ width: `${Math.min((stats.temperature / 50) * 100, 100)}%` }}
                />
              </div>
            </div>

            {/* Signal Strength */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Signal className="w-4 h-4 text-halo-accent" />
                <span className="text-sm text-white">Signal</span>
              </div>
              <span className={`text-sm font-medium ${getSignalColor(stats.signalStrength)}`}>
                {stats.signalStrength}%
              </span>
            </div>

            {/* Pressure (shoe only) */}
            {deviceType === 'shoe' && (
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Activity className="w-4 h-4 text-halo-accent" />
                  <span className="text-sm text-white">Pressure</span>
                </div>
                <span className="text-sm text-white font-medium">{stats.pressure}</span>
              </div>
            )}
          </div>

          {/* Latency Live Chart + Jitter */}
          <div className="p-3 rounded-lg bg-black bg-opacity-30 border border-halo-accent border-opacity-20 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-white">Latency</span>
              <span className="text-sm text-halo-accent font-medium">{currentLatency}ms</span>
            </div>
            {renderLatencyChart()}
            <div className="flex items-center justify-between pt-2 border-t border-halo-accent border-opacity-20">
              <span className="text-xs text-white opacity-70">Jitter</span>
              <span className="text-xs text-white">{stats.jitter}ms</span>
            </div>
          </div>

          {/* Network: Upload / Download */}
          <div className="grid grid-cols-2 gap-2">
            <div className="p-3 rounded-lg bg-black bg-opacity-30 border border-halo-accent border-opacity-20 text-center">
              <Upload className="w-4 h-4 text-halo-accent mx-auto mb-1" />
              <div className="text-sm font-bold text-halo-accent">{stats.uploadSpeed}</div>
              <div className="text-xs text-white opacity-70">Mbps Up</div>
            </div>
            <div className="p-3 rounded-lg bg-black bg-opacity-30 border border-halo-accent border-opacity-20 text-center">
              <Download className="w-4 h-4 text-halo-accent mx-auto mb-1" />
              <div className="text-sm font-bold text-halo-accent">{stats.downloadSpeed}</div>
              <div className="text-xs text-white opacity-70">Mbps Down</div>
            </div>
          </div>

          {/* Steps + Distance (shoe only) */}
          {deviceType === 'shoe' && (
            <div className="grid grid-cols-2 gap-2">
              <div className="p-3 rounded-lg bg-black bg-opacity-30 border border-halo-accent border-opacity-20 text-center">
                <div className="text-lg font-bold text-halo-accent">{stats.steps}</div>
                <div className="text-xs text-white opacity-70">Steps</div>
              </div>
              <div className="p-3 rounded-lg bg-black bg-opacity-30 border border-halo-accent border-opacity-20 text-center">
                <div className="text-lg font-bold text-halo-accent">{stats.distance}</div>
                <div className="text-xs text-white opacity-70">Distance</div>
              </div>
            </div>
          )}

          {/* Device Specific Metrics (gun/suit) */}
          {deviceType === 'gun' && (
            <div className="grid grid-cols-2 gap-2">
              <div className="p-3 rounded-lg bg-black bg-opacity-30 border border-halo-accent border-opacity-20 text-center">
                <div className="text-lg font-bold text-halo-accent">{stats.shots}</div>
                <div className="text-xs text-white opacity-70">Shots</div>
              </div>
              <div className="p-3 rounded-lg bg-black bg-opacity-30 border border-halo-accent border-opacity-20 text-center">
                <div className="text-lg font-bold text-halo-accent">{stats.accuracy}</div>
                <div className="text-xs text-white opacity-70">Accuracy</div>
              </div>
            </div>
          )}

          {deviceType === 'suit' && (
            <div className="grid grid-cols-2 gap-2">
              <div className="p-3 rounded-lg bg-black bg-opacity-30 border border-halo-accent border-opacity-20 text-center">
                <div className="text-lg font-bold text-halo-accent">{stats.impacts}</div>
                <div className="text-xs text-white opacity-70">Impacts</div>
              </div>
              <div className="p-3 rounded-lg bg-black bg-opacity-30 border border-halo-accent border-opacity-20 text-center">
                <div className="text-lg font-bold text-halo-accent">{stats.coverage}</div>
                <div className="text-xs text-white opacity-70">Coverage</div>
              </div>
            </div>
          )}

          {/* Performance: Real-time data visualization */}
          <div className="p-4 rounded-lg bg-black bg-opacity-30 border border-halo-accent border-opacity-20">
            <h3 className="text-sm font-medium text-white mb-3">Performance</h3>
            <div className="h-20 bg-halo-accent bg-opacity-10 rounded flex items-center justify-center">
              <span className="text-xs text-white opacity-50">Real-time data visualization</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsPanel;
