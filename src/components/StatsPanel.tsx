
import React, { useState, useEffect } from 'react';
import { Battery, Wifi, Thermometer, Activity, BarChart4, Globe } from 'lucide-react';

interface DeviceStats {
  battery: number;
  signal: number;
  temperature: number;
  latency: number[];
  jitter: number;
  networkSpeed: { upload: number; download: number };
}

const StatsPanel: React.FC<{ deviceType: string }> = ({ deviceType }) => {
  const [stats, setStats] = useState<DeviceStats>({
    battery: 85,
    signal: 78,
    temperature: 36.5,
    latency: Array(30).fill(0).map(() => Math.random() * 20 + 10),
    jitter: 2.3,
    networkSpeed: { upload: 12.4, download: 45.7 }
  });

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prevStats => {
        // Update latency graph with new value
        const newLatency = [...prevStats.latency.slice(1), Math.random() * 20 + 10];
        
        // Random slight fluctuations for other values
        return {
          battery: Math.max(0, Math.min(100, prevStats.battery + (Math.random() * 2 - 1))),
          signal: Math.max(0, Math.min(100, prevStats.signal + (Math.random() * 3 - 1.5))),
          temperature: Math.max(20, Math.min(45, prevStats.temperature + (Math.random() * 0.4 - 0.2))),
          latency: newLatency,
          jitter: Math.max(0.5, Math.min(10, prevStats.jitter + (Math.random() * 0.6 - 0.3))),
          networkSpeed: {
            upload: Math.max(5, Math.min(20, prevStats.networkSpeed.upload + (Math.random() * 1 - 0.5))),
            download: Math.max(20, Math.min(60, prevStats.networkSpeed.download + (Math.random() * 2 - 1)))
          }
        };
      });
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);

  const getStatColor = (value: number, type: string): string => {
    if (type === 'battery') {
      return value > 50 ? 'text-green-400' : value > 20 ? 'text-yellow-400' : 'text-red-400';
    }
    
    if (type === 'signal') {
      return value > 60 ? 'text-green-400' : value > 30 ? 'text-yellow-400' : 'text-red-400';
    }
    
    if (type === 'temperature') {
      return value < 40 ? 'text-blue-400' : value < 50 ? 'text-yellow-400' : 'text-red-400';
    }
    
    return 'text-halo-accent';
  };

  return (
    <div className="h-full w-full md:w-64 lg:w-72 xl:w-80 bg-black bg-opacity-40 backdrop-blur-lg border-l border-halo-accent border-opacity-20">
      <div className="p-4">
        <h3 className="text-lg font-medium text-halo-accent mb-6 text-center">
          {deviceType.toUpperCase()} DIAGNOSTICS
        </h3>
        
        {/* Battery */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <Battery className="w-4 h-4 mr-2 text-halo-accent" />
              <span className="text-sm text-white">Battery</span>
            </div>
            <span className={`text-sm font-bold ${getStatColor(stats.battery, 'battery')}`}>
              {Math.round(stats.battery)}%
            </span>
          </div>
          <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full ${getStatColor(stats.battery, 'battery')}`}
              style={{ width: `${stats.battery}%`, boxShadow: `0 0 5px ${stats.battery > 50 ? '#4ade80' : stats.battery > 20 ? '#facc15' : '#f87171'}` }}
            ></div>
          </div>
        </div>
        
        {/* Signal Strength */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <Wifi className="w-4 h-4 mr-2 text-halo-accent" />
              <span className="text-sm text-white">Signal</span>
            </div>
            <span className={`text-sm font-bold ${getStatColor(stats.signal, 'signal')}`}>
              {Math.round(stats.signal)}%
            </span>
          </div>
          <div className="flex justify-between gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <div 
                key={i} 
                className={`w-full h-${i+2} rounded-sm ${stats.signal > i * 20 ? getStatColor(stats.signal, 'signal') : 'bg-gray-700'}`}
              ></div>
            ))}
          </div>
        </div>
        
        {/* Temperature */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <Thermometer className="w-4 h-4 mr-2 text-halo-accent" />
              <span className="text-sm text-white">Temperature</span>
            </div>
            <span className={`text-sm font-bold ${getStatColor(stats.temperature, 'temperature')}`}>
              {stats.temperature.toFixed(1)}°C
            </span>
          </div>
          <div className="w-full h-2 bg-gradient-to-r from-blue-400 via-yellow-400 to-red-400 rounded-full overflow-hidden relative">
            <div 
              className="absolute top-0 w-1 h-full bg-white"
              style={{ 
                left: `${((stats.temperature - 20) / 25) * 100}%`,
                boxShadow: '0 0 5px rgba(255, 255, 255, 0.8)'
              }}
            ></div>
          </div>
        </div>
        
        {/* Latency Graph */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <Activity className="w-4 h-4 mr-2 text-halo-accent" />
              <span className="text-sm text-white">Latency</span>
            </div>
            <span className="text-sm font-bold text-halo-accent">
              {stats.latency[stats.latency.length-1].toFixed(1)} ms
            </span>
          </div>
          <div className="w-full h-20 bg-black bg-opacity-30 rounded-md p-2 border border-halo-accent border-opacity-20">
            <svg width="100%" height="100%" viewBox="0 0 100 40">
              <polyline
                points={stats.latency.map((value, i) => `${i * (100 / (stats.latency.length - 1))},${40 - (value / 30) * 40}`).join(' ')}
                fill="none"
                stroke="#00ccff"
                strokeWidth="1"
                className="glow-effect"
              />
            </svg>
          </div>
        </div>
        
        {/* Jitter */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <BarChart4 className="w-4 h-4 mr-2 text-halo-accent" />
              <span className="text-sm text-white">Jitter</span>
            </div>
            <span className="text-sm font-bold text-halo-accent">
              {stats.jitter.toFixed(1)} ms
            </span>
          </div>
        </div>
        
        {/* Network Speed */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <Globe className="w-4 h-4 mr-2 text-halo-accent" />
              <span className="text-sm text-white">Network</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <span className="text-xs text-gray-400">Upload</span>
              <p className="text-sm font-bold text-halo-accent">{stats.networkSpeed.upload.toFixed(1)} Mbps</p>
            </div>
            <div className="text-center">
              <span className="text-xs text-gray-400">Download</span>
              <p className="text-sm font-bold text-halo-accent">{stats.networkSpeed.download.toFixed(1)} Mbps</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsPanel;
