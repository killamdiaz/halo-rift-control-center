
import React from 'react';
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { X, Download, Upload, RotateCcw } from 'lucide-react';

interface BeltSettingsProps {
  type: 'imu' | 'mcu' | 'vibration';
  onClose: () => void;
  position: { x: number; y: number };
}

const BeltSettings: React.FC<BeltSettingsProps> = ({ type, onClose, position }) => {
  const [sensitivity, setSensitivity] = React.useState([7]);
  const [vibrationIntensity, setVibrationIntensity] = React.useState([75]);
  const [isUpdating, setIsUpdating] = React.useState(false);
  const [updateProgress, setUpdateProgress] = React.useState(0);

  const handleFirmwareUpdate = () => {
    setIsUpdating(true);
    setUpdateProgress(0);
    
    const interval = setInterval(() => {
      setUpdateProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUpdating(false);
          return 100;
        }
        return prev + 2;
      });
    }, 100);
  };

  const renderContent = () => {
    switch (type) {
      case 'imu':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-halo-accent">IMU Settings</h3>
            <div className="space-y-3">
              <div>
                <label className="text-sm text-white">Sensitivity: {sensitivity[0]}</label>
                <Slider
                  value={sensitivity}
                  onValueChange={setSensitivity}
                  max={10}
                  min={1}
                  step={1}
                  className="w-full mt-2"
                />
              </div>
              <div className="flex space-x-2">
                <Button size="sm" className="bg-halo-accent text-black hover:bg-halo-accent/80">
                  Apply Settings
                </Button>
                <Button size="sm" variant="outline" className="border-halo-accent text-halo-accent">
                  <RotateCcw className="w-3 h-3 mr-1" />
                  Reset
                </Button>
              </div>
            </div>
          </div>
        );
      case 'mcu':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-halo-accent">MCU Settings</h3>
            <div className="space-y-3">
              <div>
                <label className="text-sm text-white">Current Firmware</label>
                <div className="p-2 bg-black bg-opacity-30 rounded border border-halo-accent border-opacity-20 mt-1">
                  <span className="text-sm text-white">v2.1.4</span>
                </div>
              </div>
              <div>
                <label className="text-sm text-white">Available Update</label>
                <div className="p-2 bg-black bg-opacity-30 rounded border border-green-500 border-opacity-20 mt-1">
                  <span className="text-sm text-green-400">v2.2.0 - Performance improvements</span>
                </div>
              </div>
              {isUpdating && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white">Updating firmware...</span>
                    <span className="text-halo-accent">{updateProgress}%</span>
                  </div>
                  <Progress value={updateProgress} className="h-2" />
                </div>
              )}
              <div className="flex space-x-2">
                <Button 
                  size="sm" 
                  className="bg-green-500 text-white hover:bg-green-600"
                  onClick={handleFirmwareUpdate}
                  disabled={isUpdating}
                >
                  <Download className="w-3 h-3 mr-1" />
                  {isUpdating ? 'Updating...' : 'Update Firmware'}
                </Button>
                <Button size="sm" variant="outline" className="border-halo-accent text-halo-accent">
                  <Upload className="w-3 h-3 mr-1" />
                  Upload Custom
                </Button>
              </div>
            </div>
          </div>
        );
      case 'vibration':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-halo-accent">Vibration Motor</h3>
            <div className="space-y-3">
              <div>
                <label className="text-sm text-white">Intensity: {vibrationIntensity[0]}%</label>
                <Slider
                  value={vibrationIntensity}
                  onValueChange={setVibrationIntensity}
                  max={100}
                  min={0}
                  step={5}
                  className="w-full mt-2"
                />
              </div>
              <div className="flex space-x-2">
                <Button size="sm" className="bg-halo-accent text-black hover:bg-halo-accent/80">
                  Test Vibration
                </Button>
                <Button size="sm" className="bg-green-500 text-white hover:bg-green-600">
                  Apply Settings
                </Button>
              </div>
              <div className="text-xs text-gray-400">
                Recommended: 60-80% for optimal feedback
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div 
      className="setting-panel w-80 z-50"
      style={{
        position: 'absolute',
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
    >
      <div className="flex justify-end mb-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="text-white hover:text-halo-accent"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>
      {renderContent()}
    </div>
  );
};

export default BeltSettings;
