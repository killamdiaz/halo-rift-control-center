
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';

const TestModePanel: React.FC = () => {
  const [testState, setTestState] = useState<'idle' | 'calibrating' | 'shoe' | 'gun' | 'suit'>('idle');
  const [progress, setProgress] = useState(0);

  const startCalibration = () => {
    setTestState('calibrating');
    setProgress(0);
    
    // Simulate calibration steps
    const steps = ['calibrating', 'shoe', 'gun', 'suit'];
    let currentStep = 0;
    
    const interval = setInterval(() => {
      currentStep++;
      if (currentStep >= steps.length) {
        clearInterval(interval);
        setTimeout(() => {
          setTestState('idle');
        }, 2000);
      } else {
        setTestState(steps[currentStep] as any);
      }
    }, 3000);
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-full p-6">
      <h2 className="text-2xl font-bold text-center text-halo-accent mb-8 tracking-wider neon-text">
        HALO DIAGNOSTIC TEST SUITE
      </h2>

      <div className="w-full max-w-3xl">
        {testState === 'idle' ? (
          <div className="flex flex-col items-center">
            <p className="mb-6 text-white text-center max-w-xl">
              Begin system-wide calibration and diagnostics of all connected HALO devices.
              This process will test sensors, actuators, and responsiveness of your equipment.
            </p>
            
            <Button 
              onClick={startCalibration}
              className="px-8 py-6 bg-black border border-halo-accent text-halo-accent text-lg hover:bg-halo-accent hover:text-black transition-all duration-300 rounded-md"
            >
              Start Calibration
            </Button>
          </div>
        ) : (
          <div className="relative h-[60vh] w-full border border-halo-accent border-opacity-30 rounded-lg bg-black bg-opacity-40 backdrop-blur-sm flex items-center justify-center">
            {testState === 'calibrating' && (
              <div className="flex flex-col items-center">
                <div className="w-32 h-32 border-4 border-halo-accent border-opacity-20 rounded-full flex items-center justify-center relative">
                  <div className="w-24 h-24 border-2 border-halo-accent border-opacity-40 rounded-full animate-ping absolute"></div>
                  <div className="text-lg text-halo-accent font-bold">SCAN</div>
                </div>
                <p className="mt-6 text-white text-center">Initializing calibration sequence...</p>
              </div>
            )}
            
            {testState === 'shoe' && (
              <div className="w-full h-full flex items-center justify-center">
                <div className="relative">
                  <img 
                    src="/lovable-uploads/47ba7ad1-45f4-455c-a117-0fc8c8dfb9c4.png" 
                    alt="Shoe" 
                    className="max-h-[40vh] object-contain"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    {/* Pulsing circles representing shoe sensors */}
                    <div className="absolute top-1/3 left-1/3 w-12 h-12 border-2 border-halo-accent rounded-full animate-ping"></div>
                    <div className="absolute bottom-1/3 right-1/3 w-10 h-10 border-2 border-halo-accent rounded-full animate-ping" style={{ animationDelay: '0.5s' }}></div>
                  </div>
                </div>
                <p className="absolute bottom-8 text-center text-white">Testing shoe sensors and pressure mapping...</p>
              </div>
            )}
            
            {testState === 'gun' && (
              <div className="w-full h-full flex items-center justify-center">
                <div className="relative">
                  <img 
                    src="/lovable-uploads/11858e66-a4f4-46cb-9343-7f171eb41af9.png" 
                    alt="Gun" 
                    className="max-h-[40vh] object-contain"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    {/* Pulsing trigger area */}
                    <div className="absolute top-1/2 right-1/3 w-8 h-8 bg-halo-accent rounded-full animate-pulse opacity-50"></div>
                    <div className="absolute top-1/3 left-1/2 w-16 h-16 border-2 border-halo-accent rounded-full animate-ping" style={{ animationDelay: '0.3s' }}></div>
                  </div>
                </div>
                <p className="absolute bottom-8 text-center text-white">Calibrating gun trigger and haptic feedback...</p>
              </div>
            )}
            
            {testState === 'suit' && (
              <div className="w-full h-full flex items-center justify-center">
                <div className="relative">
                  <img 
                    src="/lovable-uploads/76c2f682-3b6b-434d-b819-e810ec01daff.png" 
                    alt="Suit" 
                    className="max-h-[40vh] object-contain"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    {/* Multiple pulsing zones across the suit */}
                    <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 w-12 h-12 border-2 border-halo-accent rounded-full animate-ping"></div>
                    <div className="absolute top-1/2 left-1/3 w-10 h-10 border-2 border-halo-accent rounded-full animate-ping" style={{ animationDelay: '0.7s' }}></div>
                    <div className="absolute top-1/2 right-1/3 w-10 h-10 border-2 border-halo-accent rounded-full animate-ping" style={{ animationDelay: '1.2s' }}></div>
                    <div className="absolute bottom-1/3 left-1/2 transform -translate-x-1/2 w-14 h-14 border-2 border-halo-accent rounded-full animate-ping" style={{ animationDelay: '0.3s' }}></div>
                  </div>
                </div>
                <p className="absolute bottom-8 text-center text-white">Testing suit vibration zones and feedback systems...</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TestModePanel;
