
import React, { useState, useEffect } from 'react';
import { Activity, Battery, Cpu, Zap, TrendingUp, AlertTriangle, CheckCircle2, ArrowUp, ArrowDown } from 'lucide-react';
import { Progress } from "@/components/ui/progress";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from 'recharts';

interface StatsPanelProps {
  deviceType: string;
}

const StatsPanel: React.FC<StatsPanelProps> = ({ deviceType }) => {
  const [latencyData, setLatencyData] = useState(() => 
    Array.from({ length: 30 }, (_, i) => ({
      time: i,
      latency: 15 + Math.random() * 10
    }))
  );

  // Simulate real-time latency updates
  useEffect(() => {
    const interval = setInterval(() => {
      setLatencyData(prev => {
        const newData = [...prev.slice(1)];
        newData.push({
          time: prev[prev.length - 1].time + 1,
          latency: 15 + Math.random() * 10
        });
        return newData;
      });
    }, 1000);

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
          jitter: 2.3,
          upload: 24.5,
          download: 156.8
        };
      case 'gun':
        return {
          battery: 92,
          status: 'Ready',
          temperature: 28,
          accuracy: '94%',
          shots: 156,
          mode: 'Training'
        };
      case 'suit':
        return {
          battery: 15,
          status: 'Low Battery',
          temperature: 35,
          coverage: '89%',
          impacts: 23,
          zones: 'All Active'
        };
      default:
        return {
          battery: 0,
          status: 'Disconnected',
          temperature: 0,
          activity: '--',
          metric1: '--',
          metric2: '--'
        };
    }
  };

  const getTemperatureColor = (temp: number) => {
    if (temp <= 30) return 'from-blue-500 to-green-500';
    if (temp <= 35) return 'from-yellow-400 to-yellow-500';
    return 'from-orange-500 to-red-500';
  };

  const getTemperatureProgress = (temp: number) => {
    // Map temperature to 0-100 scale for progress bar
    const minTemp = 20;
    const maxTemp = 40;
    return Math.min(100, Math.max(0, ((temp - minTemp) / (maxTemp - minTemp)) * 100));
  };

  const stats = getDeviceStats();
  const deviceName = deviceType.charAt(0).toUpperCase() + deviceType.slice(1);
  const currentLatency = latencyData[latencyData.length - 1]?.latency || 0;

  return (
    <div className="w-80 bg-black bg-opacity-40 backdrop-blur-lg border-l border-halo-accent border-opacity-20 flex-shrink-0">
      <div className="p-6 h-full overflow-y-auto">
        <div className="space-y-6">
          {/* Device Header */}
          <div className="text-center">
            <h2 className="text-lg font-bold text-halo-accent mb-2">HALO {deviceName.toUpperCase()}</h2>
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

          {/* Battery Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Battery className="w-4 h-4 text-halo-accent" />
                <span className="text-sm text-white">Battery</span>
              </div>
              <span className="text-sm text-halo-accent font-medium">{stats.battery}%</span>
            </div>
            <Progress 
              value={stats.battery} 
              className="h-2"
            />
          </div>

          {/* Temperature with Color Bar */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Cpu className="w-4 h-4 text-halo-accent" />
                <span className="text-sm text-white">Temperature</span>
              </div>
              <span className="text-sm text-white font-medium">{stats.temperature}°C</span>
            </div>
            <div className="relative h-2 rounded-full bg-black bg-opacity-30 overflow-hidden">
              <div 
                className={`h-full bg-gradient-to-r ${getTemperatureColor(stats.temperature)} transition-all duration-500`}
                style={{ width: `${getTemperatureProgress(stats.temperature)}%` }}
              />
            </div>
          </div>

          {/* Device Specific Metrics */}
          {deviceType === 'shoe' && (
            <>
              {/* <div className="flex items-center justify-between p-3 rounded-lg bg-black bg-opacity-30 border border-halo-accent border-opacity-20">
                <div className="flex items-center space-x-2">
                  <Activity className="w-4 h-4 text-halo-accent" />
                  <span className="text-sm text-white">Pressure</span>
                </div>
                <span className="text-sm text-white font-medium">{stats.pressure}</span>
              </div> */}

              {/* Latency Graph and Jitter */}
              <div className="p-3 rounded-lg bg-black bg-opacity-30 border border-halo-accent border-opacity-20">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-white">Latency</span>
                  <span className="text-sm text-halo-accent font-medium">{currentLatency.toFixed(1)} ms</span>
                </div>
                <div className="h-16 mb-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={latencyData}>
                      <XAxis dataKey="time" hide />
                      <YAxis hide domain={['dataMin - 2', 'dataMax + 2']} />
                      <Line 
                        type="monotone" 
                        dataKey="latency" 
                        stroke="#00ccff" 
                        strokeWidth={2}
                        dot={false}
                        strokeOpacity={0.8}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div className="text-xs text-white opacity-70">
                  Jitter: {stats.jitter} ms
                </div>
              </div>

              {/* Network Stats */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-lg bg-black bg-opacity-30 border border-halo-accent border-opacity-20 text-center">
                  <div className="flex items-center justify-center mb-1">
                    <ArrowUp className="w-3 h-3 text-halo-accent mr-1" />
                  </div>
                  <div className="text-lg font-bold text-halo-accent">{stats.upload}</div>
                  <div className="text-xs text-white opacity-70">Mbps Up</div>
                </div>
                <div className="p-3 rounded-lg bg-black bg-opacity-30 border border-halo-accent border-opacity-20 text-center">
                  <div className="flex items-center justify-center mb-1">
                    <ArrowDown className="w-3 h-3 text-halo-accent mr-1" />
                  </div>
                  <div className="text-lg font-bold text-halo-accent">{stats.download}</div>
                  <div className="text-xs text-white opacity-70">Mbps Down</div>
                </div>
              </div>
              
              {/* Steps and Distance */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-lg bg-black bg-opacity-30 border border-halo-accent border-opacity-20 text-center">
                  <div className="text-lg font-bold text-halo-accent">{stats.steps}</div>
                  <div className="text-xs text-white opacity-70">Steps</div>
                </div>
                <div className="p-3 rounded-lg bg-black bg-opacity-30 border border-halo-accent border-opacity-20 text-center">
                  <div className="text-lg font-bold text-halo-accent">{stats.distance}</div>
                  <div className="text-xs text-white opacity-70">Distance</div>
                </div>
              </div>
            </>
          )}

          {deviceType === 'gun' && (
            <>
              <div className="flex items-center justify-between p-3 rounded-lg bg-black bg-opacity-30 border border-halo-accent border-opacity-20">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-4 h-4 text-halo-accent" />
                  <span className="text-sm text-white">Accuracy</span>
                </div>
                <span className="text-sm text-white font-medium">{stats.accuracy}</span>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-lg bg-black bg-opacity-30 border border-halo-accent border-opacity-20 text-center">
                  <div className="text-lg font-bold text-halo-accent">{stats.shots}</div>
                  <div className="text-xs text-white opacity-70">Shots</div>
                </div>
                <div className="p-3 rounded-lg bg-black bg-opacity-30 border border-halo-accent border-opacity-20 text-center">
                  <div className="text-lg font-bold text-halo-accent">{stats.mode}</div>
                  <div className="text-xs text-white opacity-70">Mode</div>
                </div>
              </div>
            </>
          )}

          {deviceType === 'suit' && (
            <>
              <div className="flex items-center justify-between p-3 rounded-lg bg-black bg-opacity-30 border border-halo-accent border-opacity-20">
                <div className="flex items-center space-x-2">
                  <Zap className="w-4 h-4 text-halo-accent" />
                  <span className="text-sm text-white">Coverage</span>
                </div>
                <span className="text-sm text-white font-medium">{stats.coverage}</span>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-lg bg-black bg-opacity-30 border border-halo-accent border-opacity-20 text-center">
                  <div className="text-lg font-bold text-halo-accent">{stats.impacts}</div>
                  <div className="text-xs text-white opacity-70">Impacts</div>
                </div>
                <div className="p-3 rounded-lg bg-black bg-opacity-30 border border-halo-accent border-opacity-20 text-center">
                  <div className="text-lg font-bold text-halo-accent">{stats.zones}</div>
                  <div className="text-xs text-white opacity-70">Zones</div>
                </div>
              </div>
            </>
          )}

          {/* Real-time Graph Placeholder */}
          {/* <div className="p-4 rounded-lg bg-black bg-opacity-30 border border-halo-accent border-opacity-20">
            <h3 className="text-sm font-medium text-white mb-3">Performance</h3>
            <div className="h-20 bg-halo-accent bg-opacity-10 rounded flex items-center justify-center">
              <span className="text-xs text-white opacity-50">Real-time data visualization</span>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default StatsPanel;
