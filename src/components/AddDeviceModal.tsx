
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Footprints, Gamepad2, ShirtIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

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
  name: string;
  type: string;
  ip: string;
}

const AddDeviceModal: React.FC<AddDeviceModalProps> = ({ open, onOpenChange }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [scannedDevices, setScannedDevices] = useState<ScannedDevice[]>([]);
  
  // Options for device types with correct icons
  const deviceOptions: DeviceOption[] = [
    { id: 'shoe', label: 'Shoe', icon: Footprints },
    { id: 'gun', label: 'Gun', icon: Gamepad2 },
    { id: 'suit', label: 'Suit', icon: ShirtIcon },
  ];
  
  // Start scanning animation when modal opens
  useEffect(() => {
    if (open) {
      setIsScanning(true);
      setScannedDevices([]);
      
      // Simulate finding devices
      const timeouts = [
        setTimeout(() => {
          setScannedDevices(prev => [...prev, { 
            name: 'HALO Shoe', 
            type: 'shoe', 
            ip: '192.168.1.5' 
          }]);
        }, 2000),
        setTimeout(() => {
          setScannedDevices(prev => [...prev, { 
            name: 'HALO Gun', 
            type: 'gun', 
            ip: '192.168.1.7' 
          }]);
        }, 3500),
        setTimeout(() => {
          setScannedDevices(prev => [...prev, { 
            name: 'HALO Suit', 
            type: 'suit', 
            ip: '192.168.1.9' 
          }]);
        }, 5000)
      ];
      
      return () => {
        timeouts.forEach(timeout => clearTimeout(timeout));
      };
    }
  }, [open]);
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-black bg-opacity-90 border border-halo-accent border-opacity-30 text-white max-w-2xl backdrop-blur-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold neon-text text-center">Add New HALO Device</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-3 gap-4 mt-6">
          {deviceOptions.map((option) => (
            <Card 
              key={option.id} 
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
                key={index}
                className="flex items-center justify-between bg-black bg-opacity-50 border border-halo-accent border-opacity-20 rounded-md p-3 animate-fade-in hover:border-opacity-50 hover:bg-opacity-70 transition-all duration-300"
              >
                <div className="flex items-center">
                  {device.type === 'shoe' && <Footprints className="w-5 h-5 text-halo-accent mr-2" />}
                  {device.type === 'gun' && <Gamepad2 className="w-5 h-5 text-halo-accent mr-2" />}
                  {device.type === 'suit' && <ShirtIcon className="w-5 h-5 text-halo-accent mr-2" />}
                  <span>{device.name}</span>
                </div>
                <span className="text-xs text-gray-400">{device.ip}</span>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddDeviceModal;
