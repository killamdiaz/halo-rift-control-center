
import React, { useState } from 'react';
import { X, Battery } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface BatterySettingsProps {
  onClose: () => void;
}

const BatterySettings: React.FC<BatterySettingsProps> = ({ onClose }) => {
  const [powerMode, setPowerMode] = useState("low");
  const [batteryLevel] = useState(75);
  
  return (
    <div className="setting-panel bottom-1/4 left-1/2 transform -translate-x-1/2 w-80 z-[100]">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold neon-text">Battery Settings</h3>
        <button 
          onClick={onClose}
          className="text-white opacity-70 hover:opacity-100 hover:text-halo-accent transition-colors"
        >
          <X size={18} />
        </button>
      </div>
      
      <div className="space-y-6">
        <div className="flex items-center space-x-3">
          <Battery className="text-halo-accent" size={20} />
          <div className="flex-1 h-2.5 bg-gray-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-halo-accent transition-all duration-500 ease-in-out"
              style={{ width: `${batteryLevel}%` }}
            />
          </div>
          <span className="text-sm text-white">{batteryLevel}%</span>
        </div>
        
        <div className="space-y-2">
          <span className="text-sm text-white">Power Mode</span>
          <RadioGroup value={powerMode} onValueChange={setPowerMode} className="space-y-2">
            <div className="flex items-center space-x-2 p-2 rounded-md hover:bg-white hover:bg-opacity-5 transition-colors">
              <RadioGroupItem value="normal" id="normal" className="border-halo-accent text-halo-accent" />
              <Label htmlFor="normal" className="text-sm text-white cursor-pointer">
                Normal
                <span className="block text-xs text-white opacity-50">Standard performance</span>
              </Label>
            </div>
            <div className="flex items-center space-x-2 p-2 rounded-md hover:bg-white hover:bg-opacity-5 transition-colors">
              <RadioGroupItem value="low" id="low" className="border-halo-accent text-halo-accent" />
              <Label htmlFor="low" className="text-sm text-white cursor-pointer">
                Low Power
                <span className="block text-xs text-white opacity-50">Extended battery life</span>
              </Label>
            </div>
          </RadioGroup>
        </div>
        
        <div className="grid grid-cols-2 gap-2 pt-2 text-center text-xs">
          <div className="p-2 rounded-md bg-black bg-opacity-50 border border-white border-opacity-10">
            <span className="block text-white opacity-50">Est. Time Left</span>
            <span className="text-white">8.5 hours</span>
          </div>
          <div className="p-2 rounded-md bg-black bg-opacity-50 border border-white border-opacity-10">
            <span className="block text-white opacity-50">Health</span>
            <span className="text-white">92%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BatterySettings;
