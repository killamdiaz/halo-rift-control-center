import React, { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Footprints, Gamepad2, ShirtIcon } from 'lucide-react'
;
import { Card, CardContent } from '@/components/ui/card';

const ipcRenderer = (typeof window !== 'undefined' && window.electron?.ipcRenderer)
  ? (window.electron.ipcRenderer as {
      send: (channel: string, data?: any) => void;
      on: (channel: string, callback: (...args: any[]) => void) => void;
      removeListener: (channel: string, callback: (...args: any[]) => void) => void;
    })
  : {
      send: () => {},
      on: () => {},
      removeListener: () => {},
    };

interface AddDeviceModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface DeviceOption {
  id: string;
  label: string;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
}

interface ScannedDevice {
  id: string;
  name: string;
  role: string;
  type: string;
  ip: string;
}
const AddDeviceModal: React.FC<AddDeviceModalProps> = ({ open, onOpenChange }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [scannedDevices, setScannedDevices] = useState<ScannedDevice[]>([]);
  const [pairingDevice, setPairingDevice] = useState<ScannedDevice | null>(null);
  const [pairedDevices, setPairedDevices] = useState<ScannedDevice[]>([]);
  
  const scanInterval = useRef<NodeJS.Timeout | null>(null);

  // Options for device types with correct icons
  const deviceOptions: DeviceOption[] = [
    { id: 'shoe', label: 'Shoe', icon: Footprints },
    { id: 'gun', label: 'Gun', icon: Gamepad2 },
    { id: 'suit', label: 'Suit', icon: ShirtIcon },
  ];

  const handleBLEPairing = (type: string) => {
    if (ipcRenderer) {
      console.log("Sent BLE pairing request for type:", type);
      window.electron?.ipcRenderer?.send('start-ble-pairing', type);
    }
  };

  useEffect(() => {
  console.log('📋 scannedDevices now =', scannedDevices.length, scannedDevices);
}, [scannedDevices]);
  
useEffect(() => {
    if (!open) return;

    setIsScanning(true);
    setScannedDevices([]);

    // Poll local network devices every second
    scanInterval.current = setInterval(async () => {
      try {
        const res = await fetch('http://localhost:3000/devices');
        const data = await res.json();
        const httpDevices = data.map((d: any) => ({
          id: d.id || d.name,
          name: d.name,
          type: d.type,
          ip: d.ip,
          role: 'primary',
        }));
        setScannedDevices((prev) => {
          const merged = [...prev];
          httpDevices.forEach(d => {
            if (!merged.find(m => m.id === d.id)) merged.push(d);
          });
          return merged;
        });

        const pairedRes = await fetch('http://localhost:3000/paired');
        const pairedData = await pairedRes.json();
        const httpPaired = pairedData.map((d: any) => ({
          id: d.id || d.name,
          name: d.name,
          type: d.type,
          ip: d.ip,
          role: d.role || 'primary',
        }));
        setPairedDevices(httpPaired);
      } catch (err) {
        console.error('Local network scan failed', err);
      }
    }, 1000);

    // BLE device listeners
    let bleDeviceFoundListener: any;
    let bleDevicePairedListener: any;
    if (ipcRenderer) {
bleDeviceFoundListener = (_event: any, device: any) => {
  try {
    if (!open) return;

    const sanitized: ScannedDevice = {
      id: device.id || device.name || crypto.randomUUID(),
      name: device.name || 'Unknown Device',
      type: device.type || 'shoe',
      ip: device.ip || '',
      role: 'primary',
    };

    console.log('[Renderer]: 🔎 BLE device found', sanitized);

    setScannedDevices(prev => {
      const alreadyExists = prev.some(d => d.id === sanitized.id || d.name === sanitized.name);
      if (!alreadyExists) {
        console.log('[Renderer]: New device added to list');
        return [...prev, sanitized];
      } else {
        console.log('[Renderer]: Device already in list');
      }
      return prev;
    });
  } catch (err) {
    console.error('Failed to process BLE device', err);
  }
};
      bleDevicePairedListener = (_event: any, device: any) => {
        try {
          if (!open) return;
          const sanitized: ScannedDevice = {
            id: device.id || device.name,
            name: device.name || 'Unknown Device',
            type: device.type || 'shoe',
            ip: device.ip || '',
            role: device.role || 'primary',
          };
          console.log('[Renderer]: ✅ BLE device paired', sanitized);
          setPairedDevices(prev => {
            if (!prev.find(d => d.id === sanitized.id)) {
              return [...prev, sanitized];
            }
            return prev;
          });
        } catch (err) {
          console.error('Failed to process paired BLE device', err);
        }
      };
      window.electron?.ipcRenderer?.on('ble-device-found', bleDeviceFoundListener);
      window.electron?.ipcRenderer?.on('ble-device-paired', bleDevicePairedListener);
    }

    return () => {
      if (scanInterval.current) {
        clearInterval(scanInterval.current);
        scanInterval.current = null;
      }
      if (ipcRenderer) {
        if (bleDeviceFoundListener && typeof (ipcRenderer as any).removeListener === 'function') {
          (ipcRenderer as any).removeListener('ble-device-found', bleDeviceFoundListener);
        }
        if (bleDevicePairedListener && typeof (ipcRenderer as any).removeListener === 'function') {
          (ipcRenderer as any).removeListener('ble-device-paired', bleDevicePairedListener);
        }
        window.electron?.ipcRenderer?.send('stop-ble-pairing');
      }
    };
  }, [open]);

useEffect(() => {
  if (!open && ipcRenderer) {
    // Ensure scanning stops immediately when modal closes
    if (scanInterval.current) {
      clearInterval(scanInterval.current);
      scanInterval.current = null;
    }
    window.electron?.ipcRenderer?.send('stop-ble-pairing');
  }
}, [open]);

  const handlePair = async (device: ScannedDevice) => {
    setPairingDevice(device); // 🛠️ This sets the state
    const role = device.type === 'shoe' ? (device.name.toLowerCase().includes('left') ? 'left' : 'right') : 'primary';
    
    
    try {
      if (ipcRenderer && device.id) {
        window.electron?.ipcRenderer?.send('pair-ble-device', {
          id: device.id, // must match the `id` from `ble-device-found`
          ssid: 'MAZRS-ACT',
          password: 'Alpinetplink@412',
          role: role === 'left' ? 'L' : 'R',
        });
      }
      await fetch('http://localhost:3000/pair', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: device.name, role }),
      });
      console.log(`Paired ${device.name} as ${role}`);
    } catch (err) {
      console.error('Pairing failed', err);
    }
  
    // Optional: remove popup after 3 seconds
    setTimeout(() => setPairingDevice(null), 3000);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-black bg-opacity-90 border border-halo-accent border-opacity-30 text-white max-w-2xl backdrop-blur-lg min-h-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold neon-text text-center">Add New HALO Device</DialogTitle>
        </DialogHeader>
        {pairingDevice && (
  <div className="absolute top-6 right-6 bg-black bg-opacity-70 border border-halo-accent text-white px-4 py-2 rounded-md shadow-md z-50">
    Pairing <strong>{pairingDevice.name}</strong>...
  </div>
)}
        
        <div className="grid grid-cols-3 gap-4 mt-6">
          {deviceOptions.map((option) => (
            <Card 
              key={option.id} 
              onClick={() => handleBLEPairing(option.id)}
              className="bg-black bg-opacity-70 border border-halo-accent border-opacity-20 hover:border-opacity-60 transition-all duration-300 cursor-pointer group backdrop-blur-sm"
            >
              <CardContent className="flex flex-col items-center justify-center p-6">
                <option.icon className="w-12 h-12 text-halo-accent mb-3 group-hover:text-white transition-colors group-hover:scale-110 duration-300" />
                <h3 className="text-md font-semibold text-center">{option.label}</h3>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* Radar scanner with fixed rotation point */}
        <div className="mt-8 relative flex flex-col items-center">
          <div className="radar-container w-60 h-60 relative">
            <div className="radar-background absolute inset-0 rounded-full border border-halo-accent border-opacity-30"></div>
            <div className="radar-grid absolute inset-0 rounded-full">
              <div className="radar-circle absolute inset-8 rounded-full border border-halo-accent border-opacity-20"></div>
              <div className="radar-circle absolute inset-16 rounded-full border border-halo-accent border-opacity-20"></div>
              <div className="radar-circle absolute inset-24 rounded-full border border-halo-accent border-opacity-20"></div>
            </div>
            {isScanning && (
              <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
                <div className="radar-sweep absolute size-full origin-center">
                  <div className="absolute top-1/2 left-1/2 size-1/2 origin-top-left rotate-[270deg]">
                    <div className="absolute top-0 left-0 h-0.5 w-full bg-halo-accent shadow-[0_0_10px_rgba(0,204,255,0.7)]">
                      <div className="absolute top-0 right-0 size-16 bg-gradient-to-l from-halo-accent to-transparent opacity-40 rounded-full blur-sm" style={{ transform: 'translate(50%, -50%)' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <p className="text-center text-sm mt-4 text-halo-accent">
            {isScanning ? 'Scanning for HALO devices...' : 'Ready to scan'}
          </p>
          
          {/* Scanned devices list */}
          <div className="mt-6 w-full max-w-md space-y-2">
            
            {scannedDevices.map((device, index) => (
              <div 
                key={device.id}
                onClick={() => handlePair(device)}
                className="flex items-center justify-between bg-black bg-opacity-50 border border-halo-accent border-opacity-20 rounded-md p-3 animate-fade-in hover:border-opacity-50 hover:bg-opacity-70 transition-all duration-300"
              >
                <div className="flex items-center">
                  {device.type === 'shoe' && <Footprints className="w-5 h-5 text-halo-accent mr-2" />}
                  {device.type === 'gun' && <Gamepad2 className="w-5 h-5 text-halo-accent mr-2" />}
                  {device.type === 'suit' && <ShirtIcon className="w-5 h-5 text-halo-accent mr-2" />}
                  <span>{device.name}</span>
                </div>
                <span className="text-xs text-gray-400">{device.ip || 'BLE device'}</span>
                
              </div>
            ))}
          </div>
          {pairedDevices.length > 0 && (
            <div className="mt-6 w-full max-w-md">
              <h3 className="text-halo-accent font-semibold mb-2">Paired Devices</h3>
              {pairedDevices.map((device, index) => (
                <div 
                  key={index}
                  className="flex items-center justify-between bg-black bg-opacity-60 border border-green-600 border-opacity-40 rounded-md p-3"
                >
                  <div className="flex items-center">
                    {device.type === 'shoe' && <Footprints className="w-5 h-5 text-green-400 mr-2" />}
                    {device.type === 'gun' && <Gamepad2 className="w-5 h-5 text-green-400 mr-2" />}
                    {device.type === 'suit' && <ShirtIcon className="w-5 h-5 text-green-400 mr-2" />}
                    <div className="flex flex-col">
                      <span className="font-medium">{device.name} ({device.role})</span>
                      <span className="text-xs text-gray-400">{device.ip}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddDeviceModal;
