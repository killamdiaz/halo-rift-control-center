
import React, { useState, useEffect } from 'react';
import { Wifi, Activity } from 'lucide-react';

interface DevicePosition {
  id: string;
  name: string;
  type: string;
  x: number;
  y: number;
  signalStrength: number;
  pingDelay: number;
  isConnected: boolean;
}

const LiveDeviceMap: React.FC = () => {
  const [devices, setDevices] = useState<DevicePosition[]>([
    {
      id: 'pc-001',
      name: 'HALO Hub',
      type: 'hub',
      x: 50,
      y: 50,
      signalStrength: 100,
      pingDelay: 0,
      isConnected: true
    },
    {
      id: 'shoe-left-001',
      name: 'Left Shoe',
      type: 'shoe',
      x: 30,
      y: 80,
      signalStrength: 78,
      pingDelay: 12,
      isConnected: true
    },
    {
      id: 'gun-001',
      name: 'Gun',
      type: 'gun',
      x: 70,
      y: 30,
      signalStrength: 88,
      pingDelay: 8,
      isConnected: true
    },
    {
      id: 'suit-001',
      name: 'Suit',
      type: 'suit',
      x: 20,
      y: 20,
      signalStrength: 65,
      pingDelay: 18,
      isConnected: false
    }
  ]);

  const [pulses, setPulses] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate slight movement and signal changes
      setDevices(prev => prev.map(device => ({
        ...device,
        signalStrength: Math.max(30, Math.min(100, device.signalStrength + (Math.random() * 6 - 3))),
        pingDelay: Math.max(5, Math.min(50, device.pingDelay + (Math.random() * 4 - 2)))
      })));

      // Trigger random pulses
      if (Math.random() > 0.7) {
        const deviceIds = devices.filter(d => d.isConnected && d.type !== 'hub').map(d => d.id);
        if (deviceIds.length > 0) {
          const randomDevice = deviceIds[Math.floor(Math.random() * deviceIds.length)];
          setPulses(prev => ({ ...prev, [randomDevice]: Date.now() }));
        }
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [devices]);

  const getSignalColor = (strength: number): string => {
    if (strength > 70) return '#4ade80';
    if (strength > 40) return '#facc15';
    return '#f87171';
  };

  const getDeviceIcon = (type: string): string => {
    switch (type) {
      case 'hub': return '🖥️';
      case 'shoe': return '👟';
      case 'gun': return '🔫';
      case 'suit': return '👔';
      default: return '📱';
    }
  };

  return (
    <div className="bg-black bg-opacity-40 backdrop-blur-lg border border-halo-accent border-opacity-20 rounded-lg p-6">
      <h3 className="text-lg font-medium text-halo-accent mb-4 flex items-center">
        <Activity className="w-5 h-5 mr-2" />
        Live Device Network
      </h3>
      
      <div className="relative w-full h-80 bg-gradient-to-br from-gray-900 to-black rounded-lg border border-halo-accent border-opacity-10 overflow-hidden">
        {/* Grid Background */}
        <svg className="absolute inset-0 w-full h-full opacity-20">
          <defs>
            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#00ccff" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>

        {/* Connection Lines */}
        {devices.filter(d => d.type !== 'hub' && d.isConnected).map(device => {
          const hub = devices.find(d => d.type === 'hub');
          if (!hub) return null;
          
          const color = getSignalColor(device.signalStrength);
          const opacity = device.isConnected ? 0.6 : 0.2;
          
          return (
            <svg key={`line-${device.id}`} className="absolute inset-0 w-full h-full">
              <line
                x1={`${hub.x}%`}
                y1={`${hub.y}%`}
                x2={`${device.x}%`}
                y2={`${device.y}%`}
                stroke={color}
                strokeWidth="2"
                strokeOpacity={opacity}
                strokeDasharray={device.isConnected ? "none" : "5,5"}
              />
              
              {/* Animated Pulse */}
              {pulses[device.id] && (
                <circle
                  r="3"
                  fill={color}
                  opacity="0.8"
                >
                  <animateMotion
                    dur="1s"
                    path={`M${hub.x * 3.2},${hub.y * 3.2} L${device.x * 3.2},${device.y * 3.2}`}
                    onAnimationEnd={() => setPulses(prev => {
                      const newPulses = { ...prev };
                      delete newPulses[device.id];
                      return newPulses;
                    })}
                  />
                </circle>
              )}
            </svg>
          );
        })}

        {/* Device Nodes */}
        {devices.map(device => (
          <div
            key={device.id}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 group"
            style={{ left: `${device.x}%`, top: `${device.y}%` }}
          >
            {/* Device Icon */}
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center text-xl border-2 transition-all duration-300 ${
                device.isConnected
                  ? 'bg-halo-accent bg-opacity-20 border-halo-accent shadow-lg'
                  : 'bg-red-500 bg-opacity-20 border-red-500'
              }`}
              style={{
                boxShadow: device.isConnected 
                  ? `0 0 20px ${getSignalColor(device.signalStrength)}50`
                  : '0 0 20px #f8717150'
              }}
            >
              {getDeviceIcon(device.type)}
            </div>

            {/* Device Info Tooltip */}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-black bg-opacity-90 backdrop-blur-lg border border-halo-accent border-opacity-30 rounded-lg px-3 py-2 text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
              <div className="font-medium">{device.name}</div>
              <div className="flex items-center mt-1 space-x-3">
                <div className="flex items-center">
                  <Wifi className="w-3 h-3 mr-1" style={{ color: getSignalColor(device.signalStrength) }} />
                  {Math.round(device.signalStrength)}%
                </div>
                <div className="text-gray-400">
                  {device.pingDelay.toFixed(1)}ms
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LiveDeviceMap;
