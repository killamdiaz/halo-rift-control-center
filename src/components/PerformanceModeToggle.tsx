
import React, { useState } from 'react';
import { Zap, Target, Settings } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

type PerformanceMode = 'warp' | 'halo-pro';

interface PerformanceModeToggleProps {
  currentMode: PerformanceMode;
  onModeChange: (mode: PerformanceMode) => void;
}

const PerformanceModeToggle: React.FC<PerformanceModeToggleProps> = ({ 
  currentMode, 
  onModeChange 
}) => {
  const [isTransitioning, setIsTransitioning] = useState(false);

  const modes = {
    warp: {
      name: 'Warp Mode',
      icon: Zap,
      description: 'Maps your physical movement to keyboard & mouse input. Use this for any game, no SDK needed.',
      features: ['Universal game compatibility', 'Low latency input mapping', 'No developer integration required', 'Plug-and-play setup'],
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-400',
      borderColor: 'border-yellow-400'
    },
    'halo-pro': {
      name: 'HALO Pro Mode',
      icon: Target,
      description: 'Full-body tracking and native integration with HALO-compatible games for the ultimate experience.',
      features: ['Full-body motion tracking', 'Native game integration', 'Advanced gesture recognition', 'Professional-grade precision'],
      color: 'text-halo-accent',
      bgColor: 'bg-halo-accent',
      borderColor: 'border-halo-accent'
    }
  };

  const switchMode = async (mode: PerformanceMode) => {
    if (mode === currentMode || isTransitioning) return;
    
    setIsTransitioning(true);
    
    // Simulate mode switch delay
    setTimeout(() => {
      onModeChange(mode);
      setIsTransitioning(false);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-halo-accent flex items-center">
          <Settings className="w-5 h-5 mr-2" />
          Performance Mode
        </h3>
        <Badge variant="outline" className={`${modes[currentMode].color} ${modes[currentMode].borderColor}`}>
          {isTransitioning ? 'Switching...' : modes[currentMode].name}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {(Object.keys(modes) as PerformanceMode[]).map((mode) => {
          const modeConfig = modes[mode];
          const isActive = currentMode === mode;
          const IconComponent = modeConfig.icon;
          
          return (
            <Card
              key={mode}
              className={`relative transition-all duration-300 cursor-pointer ${
                isActive
                  ? `${modeConfig.borderColor} bg-opacity-20 shadow-lg ${modeConfig.bgColor}`
                  : 'border-gray-600 hover:border-gray-500 bg-black bg-opacity-40'
              }`}
              onClick={() => switchMode(mode)}
            >
              {isActive && (
                <div className="absolute top-2 right-2">
                  <div className={`w-3 h-3 rounded-full ${modeConfig.bgColor}`} />
                </div>
              )}
              
              <CardHeader className="pb-3">
                <CardTitle className={`flex items-center ${isActive ? modeConfig.color : 'text-white'}`}>
                  <IconComponent className="w-5 h-5 mr-2" />
                  {modeConfig.name}
                </CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-300">
                  {modeConfig.description}
                </p>
                
                <div className="space-y-2">
                  <div className="text-xs font-medium text-gray-400 uppercase tracking-wide">
                    Features
                  </div>
                  <ul className="space-y-1">
                    {modeConfig.features.map((feature, index) => (
                      <li key={index} className="text-xs text-gray-300 flex items-center">
                        <div className={`w-1.5 h-1.5 rounded-full mr-2 ${isActive ? modeConfig.bgColor : 'bg-gray-500'}`} />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                
                {!isActive && (
                  <Button
                    className={`w-full ${modeConfig.bgColor} text-black hover:opacity-80`}
                    disabled={isTransitioning}
                  >
                    Switch to {modeConfig.name}
                  </Button>
                )}
                
                {isActive && isTransitioning && (
                  <div className="flex items-center justify-center py-2">
                    <div className="animate-spin w-4 h-4 border-2 border-current border-t-transparent rounded-full mr-2" />
                    <span className="text-sm">Activating mode...</span>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default PerformanceModeToggle;
