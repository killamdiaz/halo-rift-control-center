
import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Progress } from "@/components/ui/progress";

interface MCUSettingsProps {
  onClose: () => void;
}

const MCUSettings: React.FC<MCUSettingsProps> = ({ onClose }) => {
  const [firmwareVersion] = useState("v2.3.4");
  const [updateAvailable] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [progress, setProgress] = useState(0);
  
  const handleUpdate = () => {
    setUpdating(true);
    // Simulate update progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + 20;
        if (newProgress >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setUpdating(false);
          }, 500);
          return 100;
        }
        return newProgress;
      });
    }, 600);
  };
  
  return (
    <div className="setting-panel top-1/2 right-1/4 transform translate-x-1/4 w-80">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold neon-text">MCU Settings</h3>
        <button 
          onClick={onClose}
          className="text-white opacity-70 hover:opacity-100 hover:text-halo-accent transition-colors"
        >
          <X size={18} />
        </button>
      </div>
      
      <div className="space-y-4">
        <div className="p-3 rounded-md bg-black bg-opacity-50 border border-white border-opacity-10">
          <div className="flex justify-between mb-1">
            <span className="text-sm text-white opacity-70">Current version</span>
            <span className="text-sm text-halo-accent">{firmwareVersion}</span>
          </div>
          
          {updateAvailable && !updating && (
            <div className="mt-3 text-xs text-white opacity-70">
              Update available: v2.4.0
            </div>
          )}
          
          {updating && (
            <div className="mt-3 space-y-2">
              <Progress value={progress} className="h-1" />
              <span className="text-xs text-white opacity-70">
                Updating... {progress}%
              </span>
            </div>
          )}
          
          {!updating && (
            <div className="mt-3">
              <button
                onClick={handleUpdate}
                className={`w-full py-1.5 rounded-md text-xs font-medium ${updateAvailable 
                  ? 'bg-halo-accent text-black hover:bg-opacity-80' 
                  : 'bg-gray-600 text-gray-300'}`}
                disabled={!updateAvailable}
              >
                {updateAvailable ? "Update Firmware" : "Up to Date"}
              </button>
            </div>
          )}
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-white">Device Info</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2 rounded-md bg-black bg-opacity-50 border border-white border-opacity-10">
              <span className="block text-white opacity-50">Model</span>
              <span className="text-white">HALO Smart Shoe</span>
            </div>
            <div className="p-2 rounded-md bg-black bg-opacity-50 border border-white border-opacity-10">
              <span className="block text-white opacity-50">Serial</span>
              <span className="text-white">HSS-00325867</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MCUSettings;
