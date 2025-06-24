import React from 'react';
import { Footprints, Target, ShirtIcon, Headphones, Activity } from 'lucide-react';

interface StatsPanelProps {
  deviceType: string;
  selectedBelt?: any;
}

const StatsPanel = ({ deviceType, selectedBelt }: StatsPanelProps) => {
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
          status: 'VR Mode Active',
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

  return (
    <aside className="w-80 bg-black bg-opacity-40 backdrop-blur-lg border-l border-halo-accent border-opacity-20 p-6 flex flex-col space-y-6">
      <div className="flex items-center space-x-3">
        {getDeviceIcon()}
        <h2 className="text-xl font-semibold">{getDeviceName()}</h2>
      </div>

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
    </aside>
  );
};

export default StatsPanel;
