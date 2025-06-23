
import React, { useState, useEffect } from 'react';
// ────────────────────────────────────────────────────────────
// Simple global cache so every StatsPanel instance can share
// the latest info for each HALO device type without overwriting
// each other when multiple devices are live.
//
// We hang it on `window` so React fast‑refresh and page reloads
// don’t wipe it during the session.
// ────────────────────────────────────────────────────────────
const globalDeviceStats: Record<string, any> =
  (typeof window !== 'undefined'
    ? ((window as any).__haloGlobalStatsStore ||= {})
    : {});
import { Activity, Battery, Cpu, Zap, TrendingUp, AlertTriangle, CheckCircle2, ArrowUp, ArrowDown } from 'lucide-react';
import { Progress } from "@/components/ui/progress";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { 
  Wifi, 
  Thermometer, 
  Signal,
  Timer,
  Target,
  Footprints
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface StatsPanelProps {
  deviceType: string;
  selectedBelt?: {
    id: string;
    battery: number;
    role: string;
    status: string;
  } | null;
}

const StatsPanel: React.FC<StatsPanelProps> = ({ deviceType, selectedBelt: selectedBeltProp }) => {
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

  // liveStats state: initialize from global cache, then localStorage
  const [liveStats, setLiveStats] = useState<any>(() => {
    // 1) in‑memory cache first
    if (globalDeviceStats[deviceType]) return globalDeviceStats[deviceType];
    // 2) fall back to localStorage
    const saved = localStorage.getItem(`halo-liveStats-${deviceType}`);
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    const handler = (_event: any, updatedDevice: any) => {
      console.log('Received device-status-update:', updatedDevice);
      // always update global cache
      if (updatedDevice?.type) {
        globalDeviceStats[updatedDevice.type] = updatedDevice;
      }
      // update local state when this panel cares
      if (
        updatedDevice?.type === deviceType ||
        updatedDevice?.name?.toLowerCase().includes(deviceType.toLowerCase())
      ) {
        setLiveStats(updatedDevice);
      }
    };

    // Handler for periodic update-connection-status (heartbeat array)
    const listHandler = (_e: any, devices: any[]) => {
      if (!Array.isArray(devices)) return;
      // keep the global cache fresh for every device in the list
      devices.forEach(d => {
        if (d?.type) globalDeviceStats[d.type] = {
          ...(globalDeviceStats[d.type] || {}),
          ...d
        };
      });
      // find the matching deviceType and update local stats if present
      const match = devices.find(d => d?.type === deviceType ||
                                      d?.name?.toLowerCase().includes(deviceType.toLowerCase()));
      if (match) setLiveStats(prev => ({ ...(prev || {}), ...match }));
    };

    window.electron?.ipcRenderer?.on?.('device-status-update', handler);
    window.electron?.ipcRenderer?.on?.('update-connection-status', listHandler);

    return () => {
      const ipc = (window.electron?.ipcRenderer as any) || {};
      if (typeof ipc.removeListener === 'function') {
        ipc.removeListener('device-status-update', handler);
      } else if (typeof ipc.off === 'function') {
        ipc.off('device-status-update', handler);
      } else if (typeof ipc.removeAllListeners === 'function') {
        // fallback — removes all listeners for this channel
        ipc.removeAllListeners('device-status-update');
      }
      // cleanup for update-connection-status
      if (typeof ipc.removeListener === 'function') {
        ipc.removeListener('update-connection-status', listHandler);
      } else if (typeof ipc.off === 'function') {
        ipc.off('update-connection-status', listHandler);
      } else if (typeof ipc.removeAllListeners === 'function') {
        ipc.removeAllListeners('update-connection-status');
      }
    };
  }, [deviceType]);

  // Save liveStats to global cache and localStorage on change
  useEffect(() => {
    if (liveStats) {
      globalDeviceStats[deviceType] = liveStats;       // keep cache fresh
      localStorage.setItem(`halo-liveStats-${deviceType}`, JSON.stringify(liveStats));
    }
  }, [liveStats, deviceType]);
// Simulated liveStats object for demonstration; replace with real data as needed

const getDeviceStats = () => {
  switch (deviceType) {
    case 'shoe':
      return {
        battery: liveStats?.battery ?? 0,
        status:
          liveStats?.isConnected &&
          liveStats?.name?.toLowerCase().includes('shoe')
            ? 'Connected'
            : 'Disconnected',
        temperature: liveStats?.temperature ?? 30,
        pressure: liveStats?.pressure ?? '12.5 PSI',
        steps: liveStats?.steps ?? 0,
        distance: liveStats?.distance ?? '0.0 km',
        jitter: liveStats?.jitter ?? 2.3,
        upload: liveStats?.upload ?? 24.5,
        download: liveStats?.download ?? 156.8,
      };
    case 'gun':
      return {
        battery: liveStats?.battery ?? 0,
        temperature: liveStats?.temperature ?? 30,
        status:
          liveStats?.isConnected &&
          liveStats?.name?.toLowerCase().includes('gun')
            ? 'Connected'
            : 'Disconnected',
        accuracy: liveStats?.accuracy ?? '92%',
        shots: liveStats?.shots ?? 1289,
        mode: liveStats?.mode ?? 'Burst',
        jitter: liveStats?.jitter ?? 2.3,
        upload: liveStats?.upload ?? 24.5,
        download: liveStats?.download ?? 156.8,
      };
    case 'suit':
      return {
        battery: liveStats?.battery ?? 0,
        status:
          liveStats?.isConnected &&
          liveStats?.name?.toLowerCase().includes('suit')
            ? 'Connected'
            : 'Disconnected',
        temperature: liveStats?.temperature ?? 36,
        coverage: liveStats?.coverage ?? 'Upper Body',
        impacts: liveStats?.impacts ?? 34,
        zones: liveStats?.zones ?? 'Chest, Arms, Shoulders',
        jitter: liveStats?.jitter ?? 2.3,
        upload: liveStats?.upload ?? 24.5,
        download: liveStats?.download ?? 156.8,
      };
    default:
      return {
        battery: 0,
        status: 'Disconnected',
        temperature: 0,
        pressure: '--',
        steps: 0,
        distance: '0.0 km',
        jitter: 0,
        upload: 0,
        download: 0,
      };
  }
};

  // Use the prop value for selectedBelt
  const selectedBelt = selectedBeltProp;

  const renderBeltStats = () => {
    if (!selectedBelt) {
      return (
        <div className="text-center text-gray-400 py-8">
          <p>No belt selected</p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {/* Belt Info */}
        <Card className="bg-black bg-opacity-40 border-halo-accent border-opacity-20">
          <CardHeader className="pb-3">
            <CardTitle className="text-halo-accent flex items-center text-sm">
              <Cpu className="w-4 h-4 mr-2" />
              Belt Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-300 text-sm">Belt ID</span>
              <span className="text-white font-mono">{selectedBelt.id}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300 text-sm">Assigned Role</span>
              <Badge variant="outline" className="border-halo-accent text-halo-accent">
                {selectedBelt.role}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300 text-sm">Status</span>
              <span className={`text-sm ${selectedBelt.status === 'Connected' ? 'text-green-400' : 'text-orange-400'}`}>
                {selectedBelt.status}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Battery */}
        <Card className="bg-black bg-opacity-40 border-halo-accent border-opacity-20">
          <CardHeader className="pb-3">
            <CardTitle className="text-halo-accent flex items-center text-sm">
              <Battery className="w-4 h-4 mr-2" />
              Power Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-300 text-sm">Battery Level</span>
              <span className="text-white">{selectedBelt.battery}%</span>
            </div>
            <Progress value={selectedBelt.battery} className="h-2" />
            <div className="flex justify-between items-center">
              <span className="text-gray-300 text-sm">Estimated runtime</span>
              <span className="text-white">{selectedBelt.battery > 50 ? '8-12 hrs' : selectedBelt.battery > 20 ? '3-6 hrs' : '<2 hrs'}</span>
            </div>
          </CardContent>
        </Card>

                {/* Sensor Status */}
        <Card className="bg-black bg-opacity-40 border-halo-accent border-opacity-20">
          <CardHeader className="pb-3">
            <CardTitle className="text-halo-accent flex items-center text-sm">
              <Activity className="w-4 h-4 mr-2" />
              Sensor Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-300 text-sm">IMU Sensor</span>
              <span className="text-green-400">Active</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300 text-sm">Vibration Motor</span>
              <span className="text-green-400">Ready</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300 text-sm">Temperature</span>
              <span className="text-white">36°C</span>
            </div>
          </CardContent>
        </Card>

        {/* Connection */}
        <Card className="bg-black bg-opacity-40 border-halo-accent border-opacity-20">
          <CardHeader className="pb-3">
            <CardTitle className="text-halo-accent flex items-center text-sm">
              <Wifi className="w-4 h-4 mr-2" />
              Connection
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-300 text-sm">Signal</span>
              <div className="flex items-center space-x-2">
                <Signal className="w-4 h-4 text-green-400" />
                <span className="text-white">Strong</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300 text-sm">Latency</span>
              <span className="text-white">12ms</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300 text-sm">Last Sync</span>
              <span className="text-white">Just now</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
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
if (deviceType === 'belt') {
  return (
    <div className="w-80 bg-black bg-opacity-40 backdrop-blur-lg border-l border-halo-accent border-opacity-20 p-6 overflow-y-auto">
      <h2 className="text-lg font-semibold text-white mb-4">HALO SENSOR BELT</h2>
      {renderBeltStats()}
    </div>
  );
}
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

          {stats.status === 'Connected' && (
            <>
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
                </>
              )}

              {/* Real-time Graph Placeholder */}
              {/* <div className="p-4 rounded-lg bg-black bg-opacity-30 border border-halo-accent border-opacity-20">
                <h3 className="text-sm font-medium text-white mb-3">Performance</h3>
                <div className="h-20 bg-halo-accent bg-opacity-10 rounded flex items-center justify-center">
                  <span className="text-xs text-white opacity-50">Real-time data visualization</span>
                </div>
              </div> */}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatsPanel;
