
import React, { useState } from 'react';
import { X } from 'lucide-react';

interface SuitSettingsProps {
  type: 'vibration' | 'sensors';
  onClose: () => void;
}

const SuitSettings: React.FC<SuitSettingsProps> = ({ type, onClose }) => {
  const [intensity, setIntensity] = useState(65);
  const [sensorMode, setSensorMode] = useState('standard');
  
  const handleIntensityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIntensity(parseInt(e.target.value));
  };

  return (
    <div className="setting-panel left-4 top-1/4 w-72">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold neon-text">
          {type === 'vibration' ? 'VIBRATION FEEDBACK' : 'SENSORS CALIBRATION'}
        </h3>
        <button 
          onClick={onClose}
          className="p-1 rounded-full hover:bg-halo-accent hover:bg-opacity-20"
        >
          <X className="w-5 h-5 text-halo-accent" />
        </button>
      </div>

      <div className="space-y-6">
        {type === 'vibration' && (
          <>
            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-sm text-gray-300">Intensity</label>
                <span className="text-sm text-halo-accent">{intensity}%</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={intensity}
                onChange={handleIntensityChange}
                className="w-full appearance-none h-1 rounded-full slider-track"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm text-gray-300">Feedback Zones</label>
              <div className="grid grid-cols-2 gap-2">
                <button className="p-2 bg-halo-accent bg-opacity-20 border border-halo-accent border-opacity-40 rounded-md text-sm hover:bg-opacity-30">
                  Upper Body
                </button>
                <button className="p-2 bg-black bg-opacity-30 border border-halo-accent border-opacity-20 rounded-md text-sm hover:bg-halo-accent hover:bg-opacity-20">
                  Lower Body
                </button>
                <button className="p-2 bg-black bg-opacity-30 border border-halo-accent border-opacity-20 rounded-md text-sm hover:bg-halo-accent hover:bg-opacity-20">
                  Arms
                </button>
                <button className="p-2 bg-black bg-opacity-30 border border-halo-accent border-opacity-20 rounded-md text-sm hover:bg-halo-accent hover:bg-opacity-20">
                  Full Body
                </button>
              </div>
            </div>
          </>
        )}

        {type === 'sensors' && (
          <>
            <div className="space-y-2">
              <label className="text-sm text-gray-300">Sensor Mode</label>
              <div className="grid grid-cols-1 gap-2">
                <button 
                  className={`p-2 rounded-md text-sm ${sensorMode === 'standard' ? 'bg-halo-accent bg-opacity-20 border border-halo-accent border-opacity-40' : 'bg-black bg-opacity-30 border border-halo-accent border-opacity-20 hover:bg-halo-accent hover:bg-opacity-20'}`}
                  onClick={() => setSensorMode('standard')}
                >
                  Standard
                </button>
                <button 
                  className={`p-2 rounded-md text-sm ${sensorMode === 'highPrecision' ? 'bg-halo-accent bg-opacity-20 border border-halo-accent border-opacity-40' : 'bg-black bg-opacity-30 border border-halo-accent border-opacity-20 hover:bg-halo-accent hover:bg-opacity-20'}`}
                  onClick={() => setSensorMode('highPrecision')}
                >
                  High Precision
                </button>
                <button 
                  className={`p-2 rounded-md text-sm ${sensorMode === 'lowLatency' ? 'bg-halo-accent bg-opacity-20 border border-halo-accent border-opacity-40' : 'bg-black bg-opacity-30 border border-halo-accent border-opacity-20 hover:bg-halo-accent hover:bg-opacity-20'}`}
                  onClick={() => setSensorMode('lowLatency')}
                >
                  Low Latency
                </button>
              </div>
            </div>
            
            <div className="mt-4 p-3 bg-black bg-opacity-40 rounded-md border border-halo-accent border-opacity-20">
              <p className="text-xs text-gray-300 mb-2">Last Calibration: 3 days ago</p>
              <button className="w-full py-1.5 text-sm bg-halo-accent bg-opacity-20 neon-border rounded-md hover:bg-opacity-30 transition-all duration-300">
                Start New Calibration
              </button>
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

export default SuitSettings;
