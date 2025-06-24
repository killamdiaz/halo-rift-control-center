
import React, { useState, useEffect } from 'react';
import { X, Footprints, Gamepad2, ShirtIcon, Edit3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import DeviceDetailsPanel from './DeviceDetailsPanel';
import DeviceHealthMonitor from './DeviceHealthMonitor';
import { toast } from '@/hooks/use-toast';

const ipcRenderer = window.electron?.ipcRenderer as {
  send: (channel: string, data?: any) => void;
  on: (channel: string, callback: (...args: any[]) => void) => void;
  removeAllListeners?: (channel: string) => void;
  invoke?: (channel: string, data?: any) => Promise<any>;
};

interface Device {
  id: string;
  name: string;
  type: string;
  role: string;
  battery: number;
  signal: number;
  lastConnected: Date;
  isConnected: boolean;
}

const PairedDevicesManager: React.FC = () => {
  const [devices, setDevices] = useState<Device[]>([]);

useEffect(() => {
  ipcRenderer.invoke?.('get-paired-devices')
    .then((data) => {
      if (Array.isArray(data)) {
        const formatted = data.map((d: any) => ({
          ...d,
          lastConnected: new Date(Date.now() - Math.floor(Math.random() * 1000 * 60 * 60 * 24 * 7)), // Random date within last 7 days
          isConnected: d.isConnected ?? false,
          battery: typeof d.battery === 'number' ? d.battery : 73,
          signal: d.signal ?? 100,
        }));
        setDevices(formatted);
        console.log("Formatted devices:", formatted);
      }
    })
    .catch(console.error);
}, []);

useEffect(() => {
  const handleConnectionUpdate = (_event: any, updatedDevices: Device[]) => {
    const formattedDevices = updatedDevices.map((d: any) => ({
      ...d,
      lastConnected: d.lastConnected ? new Date(d.lastConnected) : new Date(),
      isConnected: d.isConnected ?? false,
      battery: typeof d.battery === 'number' ? d.battery : 73,
      signal: d.signal ?? 100,
    }));
    setDevices(formattedDevices);
  };

  ipcRenderer.on('update-connection-status', handleConnectionUpdate);

  return () => {
    ipcRenderer.removeAllListeners?.('update-connection-status');
  };
}, []);

  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [removingDeviceId, setRemovingDeviceId] = useState<string | null>(null);

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case 'shoe': return Footprints;
      case 'gun': return Gamepad2;
      case 'suit': return ShirtIcon;
      default: return Footprints;
    }
  };

  const handleUnpairDevice = async (deviceId: string) => {
    setRemovingDeviceId(deviceId);

    try {
      // Inform backend to unpair the device
      await ipcRenderer.invoke?.('unpair-device', { id: deviceId });

      ipcRenderer.send('forget-wifi', { id: deviceId });

      // Update UI
      setDevices(prev => prev.filter(d => d.id !== deviceId));
      setRemovingDeviceId(null);

      const device = devices.find(d => d.id === deviceId);
      toast({
        title: "Device Unpaired",
        description: `${device?.name || 'Device'} has been successfully unpaired.`,
      });
    } catch (error) {
      console.error('Failed to unpair device:', error);
      toast({
        title: "Unpair Failed",
        description: "Something went wrong while trying to unpair the device.",
      });
    }
  };

  const handleSaveDeviceName = async (deviceId: string, newName: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setDevices(prev => prev.map(d => 
      d.id === deviceId ? { ...d, name: newName } : d
    ));
    
    if (selectedDevice?.id === deviceId) {
      setSelectedDevice(prev => prev ? { ...prev, name: newName } : null);
    }
    
    toast({
      title: "Device Updated",
      description: `Device name changed to "${newName}".`,
    });
  };

  const connectedDevices = [...devices]
    .filter(d => d.isConnected)
    .sort((a, b) => {
      // Optional: prioritize 'shoe' over other types if needed
      if (a.type === 'shoe' && b.type !== 'shoe') return -1;
      if (b.type === 'shoe' && a.type !== 'shoe') return 1;
      return 0;
    });

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-halo-accent mb-6 flex items-center">
        <Edit3 className="w-6 h-6 mr-3" />
        Paired Devices
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {[...devices].sort((a, b) => {
          // Show connected devices first
          if (a.isConnected && !b.isConnected) return -1;
          if (!a.isConnected && b.isConnected) return 1;
          return 0;
        }).map((device) => {
          const DeviceIcon = getDeviceIcon(device.type);
          const isRemoving = removingDeviceId === device.id;
          
          return (
            <div
              key={device.id}
              className={`relative bg-black bg-opacity-40 backdrop-blur-lg border border-halo-accent border-opacity-20 rounded-lg p-4 hover:border-opacity-40 transition-all duration-300 cursor-pointer transform ${
                isRemoving ? 'animate-pulse opacity-50 scale-95' : 'hover:scale-105'
              }`}
              onClick={() => !isRemoving && setSelectedDevice(device)}
            >
              {/* Unpair Button */}
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute top-2 right-2 w-6 h-6 p-0 text-red-400 hover:text-red-300 hover:bg-red-400 hover:bg-opacity-20 z-10"
                    onClick={(e) => e.stopPropagation()}
                    disabled={isRemoving}
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="bg-black bg-opacity-90 border-halo-accent border-opacity-30">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-white">Unpair Device</AlertDialogTitle>
                    <AlertDialogDescription className="text-gray-300">
                      Are you sure you want to unpair "{device.name}"? This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="bg-gray-700 text-white hover:bg-gray-600">
                      Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => handleUnpairDevice(device.id)}
                      className="bg-red-600 text-white hover:bg-red-700"
                    >
                      Unpair Device
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              {/* Device Card Content */}
              <div className="flex items-center mb-3">
                <DeviceIcon className="w-8 h-8 text-halo-accent mr-3" />
                <div>
                  <h3 className="font-semibold text-white">{device.name}</h3>
                  <p className="text-sm text-gray-400">{device.role}</p>
                </div>
              </div>

              {/* Connection Status */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <div className={`w-2 h-2 rounded-full mr-2 ${
                    device.isConnected ? 'bg-green-400' : 'bg-red-400'
                  }`} />
                  <span className="text-xs text-gray-400">
                    {device.isConnected ? 'Connected' : 'Not Connected'}
                  </span>
                </div>
                <span className="text-xs text-gray-400">
                  Signal: {device.signal}%
                </span>
              </div>

              {/* Battery */}
              
              {device.isConnected && (
                <div className="mb-3">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-gray-400">Battery</span>
                    <span className={`text-xs font-medium ${
                      device.battery > 20 ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {device.battery}%
                    </span>
                  </div>
                  <div className="w-full h-1 bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-300 ${
                        device.battery > 20 ? 'bg-green-400' : 'bg-red-400'
                      }`}
                      style={{ width: `${device.battery}%` }}
                    />
                  </div>
                </div>
              )}

              <div className="text-xs text-gray-500">
                Click for details
              </div>
            </div>
          );
        })}
      </div>

      {/* Device Health Monitors */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {connectedDevices.map((device) => (
          <DeviceHealthMonitor
            key={`health-${device.id}`}
            deviceId={device.id}
            deviceName={device.name}
            battery={device.battery}
          />
        ))}
      </div>

      {/* Device Details Panel */}
      {selectedDevice && (
        <DeviceDetailsPanel
          device={selectedDevice}
          isOpen={!!selectedDevice}
          onClose={() => setSelectedDevice(null)}
          onSave={handleSaveDeviceName}
        />
      )}
    </div>
  );
};

export default PairedDevicesManager;
