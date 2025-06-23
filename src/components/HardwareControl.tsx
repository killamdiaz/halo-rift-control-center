
import React, { useState } from 'react';
import IMUSettings from './settings/IMUSettings';
import MCUSettings from './settings/MCUSettings';
import BatterySettings from './settings/BatterySettings';
import GunSettings from './settings/GunSettings';
import SuitSettings from './settings/SuitSettings';
import { AspectRatio } from '@/components/ui/aspect-ratio';

// New bg-removed image paths
const shoePath = '/lovable-uploads/47ba7ad1-45f4-455c-a117-0fc8c8dfb9c4.png';
const gunPath = '/lovable-uploads/11858e66-a4f4-46cb-9343-7f171eb41af9.png';
const suitPath = '/lovable-uploads/76c2f682-3b6b-434d-b819-e810ec01daff.png';

interface HardwareControlProps {
  deviceType: string;
}

type Hotspot = {
  id: string;
  label: string;
  sublabel: string;
  position: { top: string; left: string };
  linePosition?: { length: string; angle: string; top: string; left: string };
};

const deviceHotspots = {
  shoe: [
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
  ],
  gun: [
    { 
      id: 'trigger',
      label: 'TRIGGER',
      sublabel: 'Sensitivity',
      position: { top: '60%', left: '75%' },
      linePosition: { length: '80px', angle: '45deg', top: '65%', left: '70%' }
    },
    { 
      id: 'haptic', 
      label: 'HAPTIC',
      sublabel: 'Feedback',
      position: { top: '30%', left: '40%' },
      linePosition: { length: '70px', angle: '135deg', top: '35%', left: '45%' }
    },
    { 
      id: 'battery', 
      label: 'BATTERY',
      sublabel: 'Power Mode',
      position: { top: '50%', left: '20%' },
      linePosition: { length: '60px', angle: '180deg', top: '50%', left: '25%' }
    }
  ],
  suit: [
    { 
      id: 'vibration',
      label: 'VIBRATION',
      sublabel: 'Feedback',
      position: { top: '35%', left: '30%' },
      linePosition: { length: '70px', angle: '135deg', top: '40%', left: '35%' }
    },
    { 
      id: 'sensors', 
      label: 'SENSORS',
      sublabel: 'Calibration',
      position: { top: '50%', left: '70%' },
      linePosition: { length: '80px', angle: '0deg', top: '50%', left: '65%' }
    },
    { 
      id: 'battery', 
      label: 'BATTERY',
      sublabel: 'Power Mode',
      position: { top: '75%', left: '50%' },
      linePosition: { length: '60px', angle: '90deg', top: '70%', left: '50%' }
    }
  ]
};

const deviceImages = {
  shoe: shoePath,
  gun: gunPath,
  suit: suitPath
};

const HardwareControl: React.FC<HardwareControlProps> = ({ deviceType = 'shoe' }) => {
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null);
  
  const hotspots: Hotspot[] = deviceHotspots[deviceType as keyof typeof deviceHotspots] || [];
  const imagePath = deviceImages[deviceType as keyof typeof deviceImages] || shoePath;

  const toggleHotspot = (id: string) => {
    setActiveHotspot(activeHotspot === id ? null : id);
  };

  const renderSettingsPanel = () => {
    if (!activeHotspot) return null;

    switch (`${deviceType}-${activeHotspot}`) {
      // Shoe settings
      case 'shoe-imu':
        return <IMUSettings onClose={() => setActiveHotspot(null)} />;
      case 'shoe-mcu':
        return <MCUSettings onClose={() => setActiveHotspot(null)} />;
      case 'shoe-battery':
        return <BatterySettings onClose={() => setActiveHotspot(null)} />;
      
      // Gun settings
      case 'gun-trigger':
        return <GunSettings type="trigger" onClose={() => setActiveHotspot(null)} />;
      case 'gun-haptic':
        return <GunSettings type="haptic" onClose={() => setActiveHotspot(null)} />;
      case 'gun-battery':
        return <BatterySettings onClose={() => setActiveHotspot(null)} />;
      
      // Suit settings
      case 'suit-vibration':
        return <SuitSettings type="vibration" onClose={() => setActiveHotspot(null)} />;
      case 'suit-sensors':
        return <SuitSettings type="sensors" onClose={() => setActiveHotspot(null)} />;
      case 'suit-battery':
        return <BatterySettings onClose={() => setActiveHotspot(null)} />;
      
      default:
        return null;
    }
  };

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden p-6">
      {/* Background grid effect */}
      <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
      
      {/* Device image container with responsive sizing */}
      <div className="relative w-full h-full flex items-center justify-center">
        <div className="relative max-w-4xl w-full h-full flex items-center justify-center">
          {/* Responsive image container */}
          <div className="relative flex items-center justify-center w-full h-full">
            <div className="relative" style={{ maxHeight: '90vh' }}>
              <img 
                src={imagePath} 
                alt={`HALO ${deviceType}`} 
                className="object-contain max-h-[90vh] transition-opacity duration-300 ease-in-out"
                style={{ maxWidth: '100%', height: 'auto' }}
              />

              {/* Hotspots positioned relative to the image container */}
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
        </div>
      </div>

      {/* Settings panels */}
      {renderSettingsPanel()}
    </div>
  );
};

export default HardwareControl;
