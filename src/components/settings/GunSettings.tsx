
import React, { useState } from 'react';
import { X } from 'lucide-react';

interface GunSettingsProps {
  type: 'trigger' | 'haptic';
  onClose: () => void;
}

const GunSettings: React.FC<GunSettingsProps> = ({ type, onClose }) => {
  const [sensitivity, setSensitivity] = useState(50);
  const [power, setPower] = useState(75);
  
  const handleSensitivityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSensitivity(parseInt(e.target.value));
  };

  const handlePowerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPower(parseInt(e.target.value));
  };

  return (
    <div className="setting-panel right-4 top-1/4 w-72">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold neon-text">
          {type === 'trigger' ? 'TRIGGER SETTINGS' : 'HAPTIC SETTINGS'}
        </h3>
        <button 
          onClick={onClose}
          className="p-1 rounded-full hover:bg-halo-accent hover:bg-opacity-20"
        >
          <X className="w-5 h-5 text-halo-accent" />
        </button>
      </div>

      <div className="space-y-6">
        {type === 'trigger' && (
          <div className="space-y-2">
            <div className="flex justify-between">
              <label className="text-sm text-gray-300">Sensitivity</label>
              <span className="text-sm text-halo-accent">{sensitivity}%</span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="100" 
              value={sensitivity}
              onChange={handleSensitivityChange}
              className="w-full appearance-none h-1 rounded-full slider-track"
            />
            <p className="text-xs text-gray-400">Adjust the trigger pull sensitivity</p>
          </div>
        )}

        {type === 'haptic' && (
          <>
            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-sm text-gray-300">Feedback Power</label>
                <span className="text-sm text-halo-accent">{power}%</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={power}
                onChange={handlePowerChange}
                className="w-full appearance-none h-1 rounded-full slider-track"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm text-gray-300">Feedback Pattern</label>
              <div className="grid grid-cols-2 gap-2">
                <button className="p-2 bg-halo-accent bg-opacity-20 border border-halo-accent border-opacity-40 rounded-md text-sm hover:bg-opacity-30">
                  Pulse
                </button>
                <button className="p-2 bg-black bg-opacity-30 border border-halo-accent border-opacity-20 rounded-md text-sm hover:bg-halo-accent hover:bg-opacity-20">
                  Constant
                </button>
              </div>
            </div>
          </>
        )}
        
        <button className="w-full py-2 bg-halo-accent bg-opacity-20 neon-border rounded-md hover:bg-opacity-30 transition-all duration-300">
          Apply Settings
        </button>
      </div>
    </div>
  );
};

export default GunSettings;
