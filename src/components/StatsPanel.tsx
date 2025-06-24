import React, { useState } from 'react';
import { Footprints, Target, ShirtIcon, Headphones, Activity, Eye, Power } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface StatsPanelProps {
  deviceType: string;
  selectedBelt?: any;
}

const StatsPanel = ({ deviceType, selectedBelt }: StatsPanelProps) => {
  const [vrMode, setVrMode] = useState(true);
  const [passthroughActive, setPassthroughActive] = useState(false);

  // Mock data for charts
  const cpuData = [
    { time: '1', value: 45 },
    { time: '2', value: 52 },
    { time: '3', value: 48 },
    { time: '4', value: 61 },
    { time: '5', value: 55 },
    { time: '6', value: 67 },
  ];

  const gpuData = [
    { time: '1', value: 30 },
    { time: '2', value: 45 },
    { time: '3', value: 38 },
    { time: '4', value: 52 },
    { time: '5', value: 48 },
    { time: '6', value: 58 },
  ];

  const getDeviceIcon = () => {
    switch(deviceType) {
      case 'shoe': return <Footprints className="w-5 h-5" />;
      case 'gun': return <Target className="w-5 h-5" />;
      case 'suit': return <ShirtIcon className="w-5 h-5" />;
      case 'belt': return <ShirtIcon className="w-5 h-5" />;
      case 'quest': return <Headphones className="w-5 h-5" />;
      default: return <Activity className="w-5 h-5" />;
    }
  };

  const getDeviceName = () => {
    switch(deviceType) {
      case 'shoe': return 'HALO Shoe';
      case 'gun': return 'HALO Gun';
      case 'suit': return 'Tactical Suit';
      case 'belt': return selectedBelt ? selectedBelt.name : 'HALO Belt';
      case 'quest': return 'Meta Quest';
      default: return 'Unknown Device';
    }
  };

  const getDeviceStats = () => {
    switch(deviceType) {
      case 'quest':
        return {
          battery: 68,
          temperature: 42,
          connectivity: 'Wi-Fi',
          status: vrMode ? 'VR Mode Active' : 'Standby',
          performance: {
            frameRate: '90 FPS',
            latency: '18ms',
            resolution: '2160x2160'
          }
        };
      case 'shoe':
        return {
          battery: 85,
          temperature: 35,
          connectivity: 'Bluetooth',
          status: 'Active',
          performance: {
            stepCount: 12345,
            strideLength: '0.75m',
            batteryHealth: 'Good'
          }
        };
      case 'gun':
        return {
          battery: 92,
          temperature: 38,
          connectivity: 'Bluetooth',
          status: 'Active',
          performance: {
            accuracy: '98%',
            recoilCompensation: 'Enabled',
            batteryHealth: 'Good'
          }
        };
      case 'suit':
        return {
          battery: 15,
          temperature: 40,
          connectivity: 'Bluetooth',
          status: 'Low Battery',
          performance: {
            sensorsActive: 12,
            batteryHealth: 'Poor',
            firmwareVersion: 'v2.3.1'
          }
        };
      case 'belt':
        return {
          battery: selectedBelt ? selectedBelt.battery : 73,
          temperature: 36,
          connectivity: 'Bluetooth',
          status: 'Active',
          performance: {
            vibrationIntensity: 'Medium',
            batteryHealth: 'Good',
            firmwareVersion: 'v1.4.0'
          }
        };
      default:
        return {
          battery: 85,
          temperature: 35,
          connectivity: 'Bluetooth',
          status: 'Active'
        };
    }
  };

  const stats = getDeviceStats();

  const renderQuestPanel = () => (
    <div className="space-y-6">
      {/* VR Mode Toggle */}
      <Card className="bg-black bg-opacity-40 border-halo-accent border-opacity-20">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm text-gray-400 uppercase tracking-wide flex items-center justify-between">
            VR Mode
            <Switch 
              checked={vrMode} 
              onCheckedChange={setVrMode}
              className={vrMode ? 'data-[state=checked]:bg-blue-500' : ''}
            />
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className={`text-lg font-medium ${vrMode ? 'text-blue-400' : 'text-gray-400'}`}>
            {vrMode ? 'Active' : 'Standby'}
          </div>
          {vrMode && (
            <div className="mt-2 flex items-center space-x-1">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <span className="text-xs text-blue-400">Live Session</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Status & Network Info */}
      <div className="grid grid-cols-1 gap-4">
        <Card className="bg-black bg-opacity-40 border-halo-accent border-opacity-20">
          <CardContent className="p-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Status</span>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-green-400">Connected</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">IP Address</span>
                <span className="text-sm font-mono">192.168.0.105</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Integration</span>
                <span className="text-sm text-halo-accent">Unity Streaming</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Passthrough View */}
      <Card className="bg-black bg-opacity-40 border-halo-accent border-opacity-20">
        <CardContent className="p-4">
          <Button 
            onClick={() => setPassthroughActive(!passthroughActive)}
            className={`w-full ${passthroughActive ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-700 hover:bg-gray-600'} transition-colors`}
          >
            <Eye className="w-4 h-4 mr-2" />
            {passthroughActive ? 'Stop Passthrough' : 'Passthrough View'}
          </Button>
          {passthroughActive && (
            <div className="mt-3 p-3 bg-blue-500 bg-opacity-20 rounded border border-blue-500 border-opacity-30">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-blue-400">Live Feed Active</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* GPU/CPU Levels */}
      <div className="grid grid-cols-1 gap-4">
        <Card className="bg-black bg-opacity-40 border-halo-accent border-opacity-20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-400 uppercase tracking-wide">CPU Usage</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl font-bold text-orange-400">67%</span>
              <span className="text-xs text-gray-400">Real-time</span>
            </div>
            <div className="h-16">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={cpuData}>
                  <defs>
                    <linearGradient id="cpuGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f97316" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <Area 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#f97316" 
                    strokeWidth={2}
                    fill="url(#cpuGradient)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black bg-opacity-40 border-halo-accent border-opacity-20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-400 uppercase tracking-wide">GPU Usage</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl font-bold text-green-400">58%</span>
              <span className="text-xs text-gray-400">Real-time</span>
            </div>
            <div className="h-16">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={gpuData}>
                  <defs>
                    <linearGradient id="gpuGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <Area 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#22c55e" 
                    strokeWidth={2}
                    fill="url(#gpuGradient)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Battery & Temperature */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-black bg-opacity-40 border-halo-accent border-opacity-20">
          <CardContent className="p-4 text-center">
            <div className="text-sm text-gray-400 uppercase tracking-wide mb-1">Battery</div>
            <div className="text-xl font-bold text-halo-accent">{stats.battery}%</div>
          </CardContent>
        </Card>
        <Card className="bg-black bg-opacity-40 border-halo-accent border-opacity-20">
          <CardContent className="p-4 text-center">
            <div className="text-sm text-gray-400 uppercase tracking-wide mb-1">Temp</div>
            <div className="text-xl font-bold text-yellow-400">{stats.temperature}°C</div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Metrics */}
      {stats.performance && (
        <Card className="bg-black bg-opacity-40 border-halo-accent border-opacity-20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-400 uppercase tracking-wide">Performance</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-2">
              {Object.entries(stats.performance).map(([key, value]) => (
                <div key={key} className="flex justify-between items-center">
                  <span className="text-sm capitalize text-gray-300">
                    {key.replace(/([A-Z])/g, ' $1')}
                  </span>
                  <span className="text-sm font-medium text-white">{value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const renderDefaultPanel = () => (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm text-gray-400 uppercase tracking-wide">Battery</h3>
        <p className="text-lg font-medium">{stats.battery}%</p>
      </div>
      <div>
        <h3 className="text-sm text-gray-400 uppercase tracking-wide">Temperature</h3>
        <p className="text-lg font-medium">{stats.temperature}°C</p>
      </div>
      <div>
        <h3 className="text-sm text-gray-400 uppercase tracking-wide">Connectivity</h3>
        <p className="text-lg font-medium">{stats.connectivity}</p>
      </div>
      <div>
        <h3 className="text-sm text-gray-400 uppercase tracking-wide">Status</h3>
        <p className="text-lg font-medium">{stats.status}</p>
      </div>

      {stats.performance && (
        <div>
          <h3 className="text-sm text-gray-400 uppercase tracking-wide mb-2">Performance</h3>
          <ul className="text-sm space-y-1">
            {Object.entries(stats.performance).map(([key, value]) => (
              <li key={key} className="flex justify-between">
                <span className="capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                <span className="font-medium">{value}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );

  return (
    <aside className="w-80 bg-black bg-opacity-40 backdrop-blur-lg border-l border-halo-accent border-opacity-20 p-6 flex flex-col space-y-6">
      <div className="flex items-center space-x-3">
        {getDeviceIcon()}
        <h2 className="text-xl font-semibold">{getDeviceName()}</h2>
      </div>

      {deviceType === 'quest' ? renderQuestPanel() : renderDefaultPanel()}
    </aside>
  );
};

export default StatsPanel;
