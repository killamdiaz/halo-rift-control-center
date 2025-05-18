
import React from 'react';
import { Battery, Signal, Thermometer, Activity, Wifi } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Card } from '@/components/ui/card';

interface StatsPanelProps {
  deviceType: string;
}

const StatsPanel: React.FC<StatsPanelProps> = ({ deviceType }) => {
  // Mock data - would be dynamic in a real app
  const stats = {
    battery: 78,
    signal: 85,
    temperature: 37,
    latency: 24,
    jitter: 3.2,
    networkSpeed: 56.8,
  };
  
  return (
    <div className="w-64 h-full border-l border-halo-accent border-opacity-20 bg-black bg-opacity-40 backdrop-blur-lg p-4 overflow-y-auto flex flex-col gap-4 pt-20 z-10">
      <h3 className="text-halo-accent text-lg font-semibold tracking-wider neon-text">
        {deviceType.charAt(0).toUpperCase() + deviceType.slice(1)} Stats
      </h3>
      
      {/* Battery */}
      <Card className="bg-halo-darker bg-opacity-70 p-3 border-halo-accent border-opacity-20">
        <div className="flex items-center mb-1">
          <Battery className="text-halo-accent mr-2 h-5 w-5" />
          <span className="text-sm font-medium">Battery</span>
        </div>
        <Progress value={stats.battery} className="h-2 mb-1" />
        <div className="text-right text-xs text-halo-accent">{stats.battery}%</div>
      </Card>
      
      {/* Signal Strength */}
      <Card className="bg-halo-darker bg-opacity-70 p-3 border-halo-accent border-opacity-20">
        <div className="flex items-center mb-1">
          <Signal className="text-halo-accent mr-2 h-5 w-5" />
          <span className="text-sm font-medium">Signal</span>
        </div>
        <Progress value={stats.signal} className="h-2 mb-1" />
        <div className="text-right text-xs text-halo-accent">{stats.signal}%</div>
      </Card>
      
      {/* Temperature */}
      <Card className="bg-halo-darker bg-opacity-70 p-3 border-halo-accent border-opacity-20">
        <div className="flex items-center mb-1">
          <Thermometer className="text-halo-accent mr-2 h-5 w-5" />
          <span className="text-sm font-medium">Temperature</span>
        </div>
        <Progress value={(stats.temperature / 50) * 100} className="h-2 mb-1" />
        <div className="text-right text-xs text-halo-accent">{stats.temperature}°C</div>
      </Card>
      
      {/* Latency Graph */}
      <Card className="bg-halo-darker bg-opacity-70 p-3 border-halo-accent border-opacity-20">
        <div className="flex items-center mb-1">
          <Activity className="text-halo-accent mr-2 h-5 w-5" />
          <span className="text-sm font-medium">Latency</span>
        </div>
        <div className="h-16 bg-black bg-opacity-30 rounded-md border border-gray-800 overflow-hidden">
          <div className="latency-graph h-full w-full relative">
            {/* Mock latency graph */}
            <svg className="w-full h-full" viewBox="0 0 100 30" preserveAspectRatio="none">
              <path 
                d="M0,15 L10,10 L20,18 L30,12 L40,15 L50,8 L60,22 L70,15 L80,19 L90,5 L100,15" 
                fill="none" 
                stroke="#00ccff" 
                strokeWidth="1" 
                className="glow-effect"
              />
            </svg>
          </div>
        </div>
        <div className="text-right text-xs text-halo-accent mt-1">{stats.latency}ms</div>
      </Card>
      
      {/* Network Speed */}
      <Card className="bg-halo-darker bg-opacity-70 p-3 border-halo-accent border-opacity-20">
        <div className="flex items-center mb-1">
          <Wifi className="text-halo-accent mr-2 h-5 w-5" />
          <span className="text-sm font-medium">Network Speed</span>
        </div>
        <div className="flex justify-between text-xs">
          <span>Upload: 5.4 Mbps</span>
          <span>Download: {stats.networkSpeed} Mbps</span>
        </div>
      </Card>
    </div>
  );
};

export default StatsPanel;
