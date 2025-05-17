
import React, { useState } from 'react';
import IMUSettings from './settings/IMUSettings';
import MCUSettings from './settings/MCUSettings';
import BatterySettings from './settings/BatterySettings';

// Placeholder image path 
const shoePath = '/lovable-uploads/8d627895-211e-4178-b05a-5320f5a5b192.png';

type Hotspot = {
  id: string;
  label: string;
  sublabel: string;
  position: { top: string; left: string };
  linePosition?: { length: string; angle: string; top: string; left: string };
};

const HardwareControl: React.FC = () => {
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null);
  
  const hotspots: Hotspot[] = [
    { 
      id: 'imu',
      label: 'IMU',
      sublabel: 'Sensitivity',
      position: { top: '35%', left: '35%' },
      linePosition: { length: '80px', angle: '135deg', top: '40%', left: '40%' }
    },
    { 
      id: 'mcu', 
      label: 'MCU',
      sublabel: 'Firmware',
      position: { top: '60%', left: '65%' },
      linePosition: { length: '60px', angle: '45deg', top: '65%', left: '60%' }
    },
    { 
      id: 'battery', 
      label: 'BATTERY',
      sublabel: 'Power Mode',
      position: { top: '75%', left: '45%' },
      linePosition: { length: '70px', angle: '90deg', top: '80%', left: '45%' }
    }
  ];

  const toggleHotspot = (id: string) => {
    setActiveHotspot(activeHotspot === id ? null : id);
  };

  const renderSettingsPanel = () => {
    switch (activeHotspot) {
      case 'imu':
        return <IMUSettings onClose={() => setActiveHotspot(null)} />;
      case 'mcu':
        return <MCUSettings onClose={() => setActiveHotspot(null)} />;
      case 'battery':
        return <BatterySettings onClose={() => setActiveHotspot(null)} />;
      default:
        return null;
    }
  };

  return (
    <div className="relative w-full h-screen pt-16 flex items-center justify-center overflow-hidden">
      {/* Background grid effect */}
      <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
      
      <div className="relative max-w-3xl mx-auto">
        {/* Main hardware image */}
        <div className="relative mx-auto max-w-lg">
          <img 
            src={shoePath} 
            alt="HALO Smart Shoe" 
            className="w-full h-auto object-contain"
          />

          {/* Hotspots */}
          {hotspots.map((hotspot) => (
            <React.Fragment key={hotspot.id}>
              {/* Connection line */}
              {hotspot.linePosition && (
                <div
                  className="hotspot-line"
                  style={{
                    top: hotspot.linePosition.top,
                    left: hotspot.linePosition.left,
                    width: hotspot.linePosition.length,
                    transform: `rotate(${hotspot.linePosition.angle})`,
                    opacity: activeHotspot === hotspot.id ? 1 : 0.5,
                    transition: 'all 0.3s ease'
                  }}
                />
              )}
              
              {/* Hotspot button */}
              <div
                className={`hotspot ${activeHotspot === hotspot.id ? 'scale-110 bg-opacity-40' : ''}`}
                style={{
                  top: hotspot.position.top,
                  left: hotspot.position.left
                }}
                onClick={() => toggleHotspot(hotspot.id)}
              >
                <span className="sr-only">{hotspot.label}</span>
              </div>

              {/* Hotspot label */}
              <div
                className="absolute flex flex-col items-center whitespace-nowrap"
                style={{
                  top: `calc(${hotspot.position.top} - 30px)`,
                  left: hotspot.position.left,
                  transform: 'translateX(-50%)',
                  opacity: activeHotspot === hotspot.id ? 1 : 0.7,
                  transition: 'all 0.3s ease'
                }}
              >
                <span className="neon-text font-bold text-sm">{hotspot.label}</span>
                <span className="text-white text-xs opacity-80">{hotspot.sublabel}</span>
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Settings panels */}
      {renderSettingsPanel()}
    </div>
  );
};

export default HardwareControl;
