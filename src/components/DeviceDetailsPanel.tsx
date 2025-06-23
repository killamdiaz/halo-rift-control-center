import React from 'react';
import { X, Save, Wifi, Battery, Clock, Hash, Globe, Cpu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface DeviceDetailsProps {
  device: {
    id: string;
    name: string;
    type: string;
    role: string;
    battery: number;
    signal: number;
    lastConnected: Date;
    firmwareVersion?: string;
    ip?: string;
    address?: string;
    uuid?: string;
  };
  isOpen: boolean;
  onClose: () => void;
  onSave: (deviceId: string, newName: string) => void;
}

const DeviceDetailsPanel: React.FC<DeviceDetailsProps> = ({ 
  device, 
  isOpen, 
  onClose, 
  onSave 
}) => {
  const batteryLevel = device.battery ?? 73; // fallback without mutating props
  const [editedName, setEditedName] = React.useState(device.name);
  const [isSaving, setIsSaving] = React.useState(false);

  const formatLastConnected = (date: Date | undefined) => {
    if (!date || isNaN(new Date(date).getTime())) return 'Unknown';

    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes} min${minutes > 1 ? 's' : ''} ago`;
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    return `${days} day${days > 1 ? 's' : ''} ago`;
  };

  const handleSave = async () => {
    if (editedName.trim() === device.name) return;
    
    setIsSaving(true);
    try {
      await onSave(device.id, editedName.trim());
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  console.log('Device props:', device);
  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <div className="relative w-96 h-full bg-black bg-opacity-70 backdrop-blur-lg border-l border-halo-accent border-opacity-30 shadow-2xl">
        <div className="p-6 h-full overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-halo-accent">Device Details</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-white hover:text-halo-accent"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Device Name Editor */}
          <div className="mb-6 p-4 bg-halo-darker bg-opacity-30 rounded-lg border border-halo-accent border-opacity-20">
            <Label htmlFor="device-name" className="text-sm text-white mb-2 block">
              Device Name
            </Label>
            <div className="flex gap-2">
              <Input
                id="device-name"
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                className="bg-black bg-opacity-50 border-halo-accent border-opacity-30 text-white"
                placeholder="Enter device name"
              />
              <Button
                onClick={handleSave}
                disabled={isSaving || editedName.trim() === device.name}
                size="sm"
                className="bg-halo-accent text-black hover:bg-halo-accent hover:opacity-80"
              >
                <Save className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Device Info Grid */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              {/* Role & Type */}
              <div className="flex items-center justify-between p-3 bg-halo-darker bg-opacity-20 rounded-lg">
                <div className="flex items-center">
                  <Cpu className="w-5 h-5 mr-3 text-halo-accent" />
                  <span className="text-white">Role</span>
                </div>
                <span className="text-halo-accent font-medium">{device.role}</span>
              </div>

              {/* Last Connected */}
              <div className="flex items-center justify-between p-3 bg-halo-darker bg-opacity-20 rounded-lg">
                <div className="flex items-center">
                  <Clock className="w-5 h-5 mr-3 text-halo-accent" />
                  <span className="text-white">Last Connected</span>
                </div>
                <span className="text-white font-medium">{formatLastConnected(device.lastConnected)}</span>
              </div>

              {/* Battery */}
              <div className="flex items-center justify-between p-3 bg-halo-darker bg-opacity-20 rounded-lg">
                <div className="flex items-center">
                  <Battery className="w-5 h-5 mr-3 text-halo-accent" />
                  <span className="text-white">Battery</span>
                </div>
                {typeof batteryLevel === 'number' && (
                  <span className={`font-medium ${batteryLevel > 20 ? 'text-green-400' : 'text-red-400'}`}>
                    {batteryLevel}%
                  </span>
                )}
              </div>

              {/* Signal Strength */}
              <div className="flex items-center justify-between p-3 bg-halo-darker bg-opacity-20 rounded-lg">
                <div className="flex items-center">
                  <Wifi className="w-5 h-5 mr-3 text-halo-accent" />
                  <span className="text-white">Signal Strength</span>
                </div>
                <span className="text-white font-medium">
                  {typeof device.signal === 'number' ? `${device.signal}%` : '—'}
                </span>
              </div>

              {/* Firmware Version */}
              <div className="flex items-center justify-between p-3 bg-halo-darker bg-opacity-20 rounded-lg">
                <div className="flex items-center">
                  <Hash className="w-5 h-5 mr-3 text-halo-accent" />
                  <span className="text-white">Firmware</span>
                </div>
                <span className="text-white font-medium">{device.firmwareVersion || 'v1.2.3'}</span>
              </div>

              {/* IP Address */}
              <div className="flex items-center justify-between p-3 bg-halo-darker bg-opacity-20 rounded-lg">
                <div className="flex items-center">
                  <Globe className="w-5 h-5 mr-3 text-halo-accent" />
                  <span className="text-white">IP Address</span>
                </div>
                <span className="text-white font-medium font-mono text-sm">
                  {device.ip && device.ip !== '' ? device.ip : 'Fetching...'}
                </span>
              </div>

              {/* MAC Address */}
              <div className="flex items-center justify-between p-3 bg-halo-darker bg-opacity-20 rounded-lg">
                <div className="flex items-center">
                  <Hash className="w-5 h-5 mr-3 text-halo-accent" />
                  <span className="text-white">MAC Address</span>
                </div>
                <span className="text-white font-medium font-mono text-sm">
                  {device.address && device.address !== '' ? device.address : 'Fetching...'}
                </span>
              </div>

              {/* Device UUID */}
              <div className="flex items-center justify-between p-3 bg-halo-darker bg-opacity-20 rounded-lg">
                <div className="flex items-center">
                  <Hash className="w-5 h-5 mr-3 text-halo-accent" />
                  <span className="text-white">Device UUID</span>
                </div>
                <span className="text-white font-medium font-mono text-xs">
                  {device.uuid || '—'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeviceDetailsPanel;
