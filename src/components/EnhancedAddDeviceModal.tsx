
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Footprints, Gamepad2, ShirtIcon, Wifi, CheckCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface EnhancedAddDeviceModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface DiscoveredDevice {
  id: string;
  name: string;
  type: string;
  signal: number;
  suggestedRole: string;
}

const roleOptions = [
  { value: 'left-shoe', label: 'Left Shoe', icon: Footprints },
  { value: 'right-shoe', label: 'Right Shoe', icon: Footprints },
  { value: 'gun', label: 'Gun', icon: Gamepad2 },
  { value: 'suit', label: 'Suit', icon: ShirtIcon }
];

const EnhancedAddDeviceModal: React.FC<EnhancedAddDeviceModalProps> = ({ 
  open, 
  onOpenChange 
}) => {
  const [isScanning, setIsScanning] = useState(false);
  const [discoveredDevices, setDiscoveredDevices] = useState<DiscoveredDevice[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>('');
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [isPairing, setIsPairing] = useState(false);

  const startScanning = () => {
    setIsScanning(true);
    setDiscoveredDevices([]);
    
    // Simulate device discovery
    setTimeout(() => {
      setDiscoveredDevices([
        {
          id: 'halo-shoe-rx-002',
          name: 'HALO Shoe RX-002',
          type: 'shoe',
          signal: 85,
          suggestedRole: 'right-shoe'
        },
        {
          id: 'halo-gun-alpha-001', 
          name: 'HALO Gun Alpha-001',
          type: 'gun',
          signal: 92,
          suggestedRole: 'gun'
        }
      ]);
      setIsScanning(false);
    }, 3000);
  };

  const handlePairDevice = async () => {
    if (!selectedDeviceId || !selectedRole) return;
    
    setIsPairing(true);
    
    // Simulate pairing process
    setTimeout(() => {
      const device = discoveredDevices.find(d => d.id === selectedDeviceId);
      const role = roleOptions.find(r => r.value === selectedRole);
      
      toast({
        title: "Device Paired Successfully",
        description: `${device?.name} has been paired as ${role?.label}.`,
      });
      
      setIsPairing(false);
      setSelectedDeviceId('');
      setSelectedRole('');
      setDiscoveredDevices([]);
      onOpenChange(false);
    }, 2000);
  };

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case 'shoe': return Footprints;
      case 'gun': return Gamepad2;
      case 'suit': return ShirtIcon;
      default: return Wifi;
    }
  };

  const selectedDevice = discoveredDevices.find(d => d.id === selectedDeviceId);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-black bg-opacity-90 backdrop-blur-lg border-halo-accent border-opacity-30 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-halo-accent">Add HALO Device</DialogTitle>
          <DialogDescription className="text-gray-300">
            Scan for nearby HALO devices and pair them with role assignment.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Scan Button */}
          {discoveredDevices.length === 0 && (
            <Button
              onClick={startScanning}
              disabled={isScanning}
              className="w-full bg-halo-accent text-black hover:bg-halo-accent hover:opacity-80"
            >
              {isScanning ? (
                <>
                  <Wifi className="w-4 h-4 mr-2 animate-pulse" />
                  Scanning for devices...
                </>
              ) : (
                <>
                  <Wifi className="w-4 h-4 mr-2" />
                  Start Device Scan
                </>
              )}
            </Button>
          )}

          {/* Discovered Devices */}
          {discoveredDevices.length > 0 && (
            <div className="space-y-4">
              <Label className="text-white">Select Device</Label>
              <div className="space-y-2">
                {discoveredDevices.map((device) => {
                  const DeviceIcon = getDeviceIcon(device.type);
                  const isSelected = selectedDeviceId === device.id;
                  
                  return (
                    <div
                      key={device.id}
                      className={`p-3 rounded-lg border cursor-pointer transition-all ${
                        isSelected 
                          ? 'border-halo-accent bg-halo-accent bg-opacity-20' 
                          : 'border-gray-600 hover:border-halo-accent hover:border-opacity-50'
                      }`}
                      onClick={() => {
                        setSelectedDeviceId(device.id);
                        setSelectedRole(device.suggestedRole);
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <DeviceIcon className="w-5 h-5 text-halo-accent mr-3" />
                          <div>
                            <p className="text-white font-medium">{device.name}</p>
                            <p className="text-xs text-gray-400">Signal: {device.signal}%</p>
                          </div>
                        </div>
                        {isSelected && (
                          <CheckCircle className="w-5 h-5 text-halo-accent" />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Role Assignment */}
          {selectedDevice && (
            <div className="space-y-2">
              <Label className="text-white">Assign Role</Label>
              <Select value={selectedRole} onValueChange={setSelectedRole}>
                <SelectTrigger className="bg-black bg-opacity-50 border-halo-accent border-opacity-30 text-white">
                  <SelectValue placeholder="Select device role" />
                </SelectTrigger>
                <SelectContent className="bg-black border-halo-accent border-opacity-30">
                  {roleOptions.map((role) => (
                    <SelectItem 
                      key={role.value} 
                      value={role.value}
                      className="text-white hover:bg-halo-accent hover:bg-opacity-20"
                    >
                      <div className="flex items-center">
                        <role.icon className="w-4 h-4 mr-2 text-halo-accent" />
                        {role.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedDevice.suggestedRole === selectedRole && (
                <p className="text-xs text-green-400">
                  ✓ Recommended role based on device type
                </p>
              )}
            </div>
          )}

          {/* Pair Button */}
          {selectedDevice && selectedRole && (
            <Button
              onClick={handlePairDevice}
              disabled={isPairing}
              className="w-full bg-halo-accent text-black hover:bg-halo-accent hover:opacity-80"
            >
              {isPairing ? (
                <>
                  <Wifi className="w-4 h-4 mr-2 animate-spin" />
                  Pairing Device...
                </>
              ) : (
                'Pair Device'
              )}
            </Button>
          )}

          {discoveredDevices.length > 0 && (
            <Button
              variant="outline"
              onClick={startScanning}
              className="w-full border-halo-accent border-opacity-30 text-white hover:bg-halo-accent hover:bg-opacity-20"
            >
              <Wifi className="w-4 h-4 mr-2" />
              Scan Again
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EnhancedAddDeviceModal;
