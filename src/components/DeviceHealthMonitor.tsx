
import React, { useState, useEffect } from 'react';
import { Activity, Wifi, Download, Upload, AlertTriangle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface DeviceHealthData {
  deviceId: string;
  packetLoss: number; // percentage
  dataRateIn: number; // kbps
  dataRateOut: number; // kbps
  reconnectionEvents: number;
  jitter: number; // ms
}

interface DeviceHealthMonitorProps {
  deviceId: string;
  deviceName: string;
  battery: number;
}

const DeviceHealthMonitor: React.FC<DeviceHealthMonitorProps> = ({ 
  deviceId, 
  deviceName, 
  battery 
}) => {
  const [healthData, setHealthData] = useState<DeviceHealthData>({
    deviceId,
    packetLoss: 0.2,
    dataRateIn: 124.5,
    dataRateOut: 89.3,
    reconnectionEvents: 0,
    jitter: 2.1
  });

  // Simulate real-time health data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setHealthData(prev => ({
        ...prev,
        packetLoss: Math.max(0, Math.min(5, prev.packetLoss + (Math.random() * 0.4 - 0.2))),
        dataRateIn: Math.max(50, Math.min(200, prev.dataRateIn + (Math.random() * 20 - 10))),
        dataRateOut: Math.max(30, Math.min(150, prev.dataRateOut + (Math.random() * 15 - 7.5))),
        jitter: Math.max(0.5, Math.min(10, prev.jitter + (Math.random() * 0.8 - 0.4)))
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const getHealthColor = (value: number, type: 'packetLoss' | 'dataRate' | 'jitter') => {
    switch (type) {
      case 'packetLoss':
        return value < 1 ? 'text-green-400' : value < 3 ? 'text-yellow-400' : 'text-red-400';
      case 'dataRate':
        return value > 100 ? 'text-green-400' : value > 50 ? 'text-yellow-400' : 'text-red-400';
      case 'jitter':
        return value < 3 ? 'text-green-400' : value < 7 ? 'text-yellow-400' : 'text-red-400';
      default:
        return 'text-white';
    }
  };

  const formatDataRate = (kbps: number) => {
    return kbps >= 1000 ? `${(kbps / 1000).toFixed(1)} Mbps` : `${kbps.toFixed(1)} kbps`;
  };

  return (
    <TooltipProvider>
      <div className="bg-black bg-opacity-40 backdrop-blur-lg border border-halo-accent border-opacity-20 rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-halo-accent flex items-center">
            <Activity className="w-4 h-4 mr-2" />
            {deviceName} Health
          </h3>
          {battery < 20 && (
            <Tooltip>
              <TooltipTrigger>
                <AlertTriangle className="w-4 h-4 text-red-400 animate-pulse" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Low battery warning: {battery}%</p>
              </TooltipContent>
            </Tooltip>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs">
          {/* Packet Loss */}
          <Tooltip>
            <TooltipTrigger>
              <div className="bg-halo-darker bg-opacity-30 rounded-md p-2">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Packet Loss</span>
                  <span className={`font-bold transition-colors duration-300 ${getHealthColor(healthData.packetLoss, 'packetLoss')}`}>
                    {healthData.packetLoss.toFixed(1)}%
                  </span>
                </div>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Percentage of data packets that failed to reach their destination</p>
            </TooltipContent>
          </Tooltip>

          {/* Jitter */}
          <Tooltip>
            <TooltipTrigger>
              <div className="bg-halo-darker bg-opacity-30 rounded-md p-2">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Jitter</span>
                  <span className={`font-bold transition-colors duration-300 ${getHealthColor(healthData.jitter, 'jitter')}`}>
                    {healthData.jitter.toFixed(1)}ms
                  </span>
                </div>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Variation in packet arrival times - lower is better</p>
            </TooltipContent>
          </Tooltip>

          {/* Data Rate In */}
          <Tooltip>
            <TooltipTrigger>
              <div className="bg-halo-darker bg-opacity-30 rounded-md p-2">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 flex items-center">
                    <Download className="w-3 h-3 mr-1" />
                    In
                  </span>
                  <span className={`font-bold transition-colors duration-300 ${getHealthColor(healthData.dataRateIn, 'dataRate')}`}>
                    {formatDataRate(healthData.dataRateIn)}
                  </span>
                </div>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Incoming data rate from device</p>
            </TooltipContent>
          </Tooltip>

          {/* Data Rate Out */}
          <Tooltip>
            <TooltipTrigger>
              <div className="bg-halo-darker bg-opacity-30 rounded-md p-2">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 flex items-center">
                    <Upload className="w-3 h-3 mr-1" />
                    Out
                  </span>
                  <span className={`font-bold transition-colors duration-300 ${getHealthColor(healthData.dataRateOut, 'dataRate')}`}>
                    {formatDataRate(healthData.dataRateOut)}
                  </span>
                </div>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Outgoing data rate to device</p>
            </TooltipContent>
          </Tooltip>

          {/* Reconnection Events */}
          <div className="col-span-2 bg-halo-darker bg-opacity-30 rounded-md p-2">
            <div className="flex items-center justify-between">
              <span className="text-gray-400 flex items-center">
                <Wifi className="w-3 h-3 mr-1" />
                Reconnections
              </span>
              <span className="text-white font-bold">{healthData.reconnectionEvents}</span>
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default DeviceHealthMonitor;
