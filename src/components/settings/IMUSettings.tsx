
import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";

interface IMUSettingsProps {
  onClose: () => void;
}

const IMUSettings: React.FC<IMUSettingsProps> = ({ onClose }) => {
  const [sensitivity, setSensitivity] = useState<number[]>([75]);
  const [filteringEnabled, setFilteringEnabled] = useState(true);
  
  return (
    <div className="setting-panel top-1/3 left-1/4 transform -translate-x-1/4 w-80">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold neon-text">IMU Settings</h3>
        <button 
          onClick={onClose}
          className="text-white opacity-70 hover:opacity-100 hover:text-halo-accent transition-colors"
        >
          <X size={18} />
        </button>
      </div>
      
      <div className="space-y-6">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-sm text-white">Sensitivity</label>
            <span className="text-xs text-halo-accent">{sensitivity[0]}%</span>
          </div>
          <Slider 
            value={sensitivity} 
            onValueChange={setSensitivity}
            max={100}
            step={1}
            className="slider-track"
          />
        </div>
        
        <div className="pt-4 border-t border-white border-opacity-10 space-y-4">
          <label className="flex items-center justify-between text-sm cursor-pointer">
            <span className="text-white">Calibration</span>
            <button className="px-3 py-1 text-xs rounded-md bg-halo-accent bg-opacity-20 text-halo-accent hover:bg-opacity-30 transition-colors">
              Run
            </button>
          </label>
          
          <label className="flex items-center justify-between text-sm cursor-pointer">
            <span className="text-white">Filtering</span>
            <Switch 
              checked={filteringEnabled} 
              onCheckedChange={setFilteringEnabled} 
            />
          </label>
        </div>
      </div>
    </div>
  );
};

export default IMUSettings;
