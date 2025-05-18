
import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, LineChart, Line, Tooltip } from 'recharts';
import { Card, CardContent } from '@/components/ui/card';

// Mock data generation functions
const generateMockTimeSeriesData = (length = 30, baselines = [50, 60, 40, 55]) => {
  return Array.from({ length }).map((_, i) => ({
    time: i,
    leftToePressure: Math.max(0, Math.min(100, baselines[0] + Math.sin(i / 3) * 20 + Math.random() * 15)),
    leftHeelPressure: Math.max(0, Math.min(100, baselines[1] + Math.cos(i / 4) * 15 + Math.random() * 10)),
    rightToePressure: Math.max(0, Math.min(100, baselines[2] + Math.sin(i / 3 + 1) * 25 + Math.random() * 12)),
    rightHeelPressure: Math.max(0, Math.min(100, baselines[3] + Math.cos(i / 4 + 2) * 18 + Math.random() * 10))
  }));
};

const generateMockGunData = (length = 30) => {
  return Array.from({ length }).map((_, i) => ({
    time: i,
    pitch: Math.sin(i / 5) * 45 + Math.random() * 5, // -45 to 45 degrees
    yaw: Math.cos(i / 7) * 60 + Math.random() * 8    // -60 to 60 degrees
  }));
};

const generateMockSignalData = (length = 30) => {
  const baseSignal = 75; // Base signal strength percentage
  return Array.from({ length }).map((_, i) => ({
    time: i,
    signal: Math.max(0, Math.min(100, baseSignal + Math.sin(i / 4) * 15 + (Math.random() * 10 - 5)))
  }));
};

type GaugeProps = {
  value: number;
  max: number;
  label: string;
  color: string;
};

// Circular gauge component for showing real-time values
const CircularGauge: React.FC<GaugeProps> = ({ value, max, label, color }) => {
  const percentage = (value / max) * 100;
  const circumference = 2 * Math.PI * 40; // r = 40
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-24 h-24">
        {/* Background circle */}
        <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
          <circle 
            cx="50" 
            cy="50" 
            r="40" 
            fill="none" 
            stroke="#111" 
            strokeWidth="8"
          />
          {/* Progress circle with glow effect */}
          <circle 
            cx="50" 
            cy="50" 
            r="40" 
            fill="none" 
            stroke={color} 
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="glow-effect"
            style={{ filter: `drop-shadow(0 0 4px ${color})` }}
          />
        </svg>
        {/* Value text in center */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xl font-bold text-white">{Math.round(value)}</span>
        </div>
      </div>
      <span className="mt-2 text-sm text-gray-300">{label}</span>
    </div>
  );
};

const DiagnosticsPanel: React.FC = () => {
  const [pressureData, setPressureData] = useState(() => generateMockTimeSeriesData());
  const [gunRotationData, setGunRotationData] = useState(() => generateMockGunData());
  const [signalData, setSignalData] = useState(() => generateMockSignalData());
  const [latestPressures, setLatestPressures] = useState({
    leftToe: 0,
    leftHeel: 0,
    rightToe: 0,
    rightHeel: 0
  });
  const [latestGunRotation, setLatestGunRotation] = useState({ pitch: 0, yaw: 0 });
  const [latestSignal, setLatestSignal] = useState(0);

  // Update data at regular intervals
  useEffect(() => {
    const interval = setInterval(() => {
      // Generate and append new data points
      setPressureData(prev => {
        const newData = [...prev.slice(1), {
          time: prev[prev.length - 1].time + 1,
          leftToePressure: Math.max(0, Math.min(100, prev[prev.length - 1].leftToePressure + (Math.random() * 10 - 5))),
          leftHeelPressure: Math.max(0, Math.min(100, prev[prev.length - 1].leftHeelPressure + (Math.random() * 10 - 5))),
          rightToePressure: Math.max(0, Math.min(100, prev[prev.length - 1].rightToePressure + (Math.random() * 10 - 5))),
          rightHeelPressure: Math.max(0, Math.min(100, prev[prev.length - 1].rightHeelPressure + (Math.random() * 10 - 5)))
        }];
        
        // Update latest values
        setLatestPressures({
          leftToe: newData[newData.length - 1].leftToePressure,
          leftHeel: newData[newData.length - 1].leftHeelPressure,
          rightToe: newData[newData.length - 1].rightToePressure,
          rightHeel: newData[newData.length - 1].rightHeelPressure
        });
        
        return newData;
      });
      
      setGunRotationData(prev => {
        const newData = [...prev.slice(1), {
          time: prev[prev.length - 1].time + 1,
          pitch: Math.max(-45, Math.min(45, prev[prev.length - 1].pitch + (Math.random() * 10 - 5))),
          yaw: Math.max(-60, Math.min(60, prev[prev.length - 1].yaw + (Math.random() * 12 - 6)))
        }];
        
        setLatestGunRotation({
          pitch: newData[newData.length - 1].pitch,
          yaw: newData[newData.length - 1].yaw
        });
        
        return newData;
      });
      
      setSignalData(prev => {
        const newData = [...prev.slice(1), {
          time: prev[prev.length - 1].time + 1,
          signal: Math.max(0, Math.min(100, prev[prev.length - 1].signal + (Math.random() * 8 - 4)))
        }];
        
        setLatestSignal(newData[newData.length - 1].signal);
        
        return newData;
      });
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="w-full mt-16 p-4 bg-black bg-opacity-70 border border-halo-accent border-opacity-30 rounded-lg backdrop-blur-md">
      <h2 className="text-xl font-bold text-halo-accent text-center mb-4 neon-text">LIVE DIAGNOSTICS</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* FSR Pressure Panel */}
        <Card className="bg-black bg-opacity-50 border border-halo-accent border-opacity-30">
          <CardContent className="p-4">
            <h3 className="text-halo-accent font-medium mb-2">FSR PRESSURE</h3>
            
            <div className="h-40 mb-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={pressureData}>
                  <XAxis dataKey="time" hide />
                  <YAxis hide domain={[0, 100]} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.8)', border: '1px solid #00ccff', borderRadius: '4px' }}
                    labelStyle={{ color: '#00ccff' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="leftToePressure" 
                    stroke="#00ccff" 
                    fill="#00ccff20" 
                    strokeWidth={2}
                    isAnimationActive={false}
                    name="Left Toe"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="leftHeelPressure" 
                    stroke="#4d88ff" 
                    fill="#4d88ff20" 
                    strokeWidth={2}
                    isAnimationActive={false}
                    name="Left Heel"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="rightToePressure" 
                    stroke="#00ffcc" 
                    fill="#00ffcc20" 
                    strokeWidth={2}
                    isAnimationActive={false}
                    name="Right Toe"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="rightHeelPressure" 
                    stroke="#33ff88" 
                    fill="#33ff8820" 
                    strokeWidth={2}
                    isAnimationActive={false}
                    name="Right Heel"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            
            <div className="grid grid-cols-4 gap-2">
              <CircularGauge value={latestPressures.leftToe} max={100} label="L Toe" color="#00ccff" />
              <CircularGauge value={latestPressures.leftHeel} max={100} label="L Heel" color="#4d88ff" />
              <CircularGauge value={latestPressures.rightToe} max={100} label="R Toe" color="#00ffcc" />
              <CircularGauge value={latestPressures.rightHeel} max={100} label="R Heel" color="#33ff88" />
            </div>
          </CardContent>
        </Card>
        
        {/* Gun Rotation Panel */}
        <Card className="bg-black bg-opacity-50 border border-halo-accent border-opacity-30">
          <CardContent className="p-4">
            <h3 className="text-halo-accent font-medium mb-2">GUN ROTATION</h3>
            
            <div className="h-40 mb-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={gunRotationData}>
                  <XAxis dataKey="time" hide />
                  <YAxis hide domain={[-60, 60]} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.8)', border: '1px solid #00ccff', borderRadius: '4px' }}
                    labelStyle={{ color: '#00ccff' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="pitch" 
                    stroke="#ff66cc" 
                    strokeWidth={2}
                    isAnimationActive={false}
                    dot={false}
                    name="Pitch (°)"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="yaw" 
                    stroke="#ffcc00" 
                    strokeWidth={2}
                    isAnimationActive={false}
                    dot={false}
                    name="Yaw (°)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              {/* Gun rotation visualization */}
              <div className="flex flex-col items-center">
                <div className="relative w-24 h-24 border border-halo-accent border-opacity-40 rounded-lg flex items-center justify-center">
                  {/* Pitch indicator */}
                  <div 
                    className="absolute w-16 h-2 bg-ff66cc border border-white border-opacity-20 rounded-full"
                    style={{ 
                      transform: `rotateX(${latestGunRotation.pitch}deg)`,
                      backgroundColor: '#ff66cc30',
                      boxShadow: '0 0 5px rgba(255, 102, 204, 0.5)'
                    }}
                  ></div>
                  
                  {/* Yaw indicator */}
                  <div 
                    className="absolute w-2 h-16 bg-ffcc00 border border-white border-opacity-20 rounded-full"
                    style={{ 
                      transform: `rotateY(${latestGunRotation.yaw}deg)`,
                      backgroundColor: '#ffcc0030',
                      boxShadow: '0 0 5px rgba(255, 204, 0, 0.5)'
                    }}
                  ></div>
                  
                  <div className="h-4 w-4 rounded-full bg-white opacity-50"></div>
                </div>
                <span className="mt-2 text-sm text-gray-300">Visual</span>
              </div>
              
              <div className="flex flex-col space-y-4">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span>Pitch</span>
                    <span className="text-ff66cc">{Math.round(latestGunRotation.pitch)}°</span>
                  </div>
                  <div className="h-2 bg-black rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-ff66cc rounded-full"
                      style={{ 
                        width: `${((latestGunRotation.pitch + 45) / 90) * 100}%`,
                        boxShadow: '0 0 5px rgba(255, 102, 204, 0.7)'
                      }}
                    ></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span>Yaw</span>
                    <span className="text-ffcc00">{Math.round(latestGunRotation.yaw)}°</span>
                  </div>
                  <div className="h-2 bg-black rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-ffcc00 rounded-full"
                      style={{ 
                        width: `${((latestGunRotation.yaw + 60) / 120) * 100}%`,
                        boxShadow: '0 0 5px rgba(255, 204, 0, 0.7)'
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* BLE Signal Strength Panel */}
        <Card className="bg-black bg-opacity-50 border border-halo-accent border-opacity-30">
          <CardContent className="p-4">
            <h3 className="text-halo-accent font-medium mb-2">BLE SIGNAL STRENGTH</h3>
            
            <div className="h-40 mb-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={signalData}>
                  <XAxis dataKey="time" hide />
                  <YAxis hide domain={[0, 100]} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.8)', border: '1px solid #00ccff', borderRadius: '4px' }}
                    labelStyle={{ color: '#00ccff' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="signal" 
                    stroke="#00ff88" 
                    strokeWidth={2}
                    isAnimationActive={false}
                    dot={false}
                    name="Signal (%)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            
            <div className="flex justify-center">
              <div className="w-64">
                <CircularGauge value={latestSignal} max={100} label="Signal Strength" color="#00ff88" />
                
                <div className="mt-4 flex justify-between items-center px-4">
                  <div className="w-16 h-16 relative">
                    <div className="absolute inset-0 rounded-full border border-halo-accent opacity-20"></div>
                    <div className="absolute inset-0 rounded-full border border-halo-accent opacity-40"
                         style={{ clipPath: 'polygon(0 0, 100% 0, 100% 50%, 0 50%)' }}></div>
                    <div className="absolute inset-0 rounded-full border border-halo-accent opacity-60"
                         style={{ clipPath: 'polygon(0 0, 100% 0, 100% 30%, 0 30%)' }}></div>
                    <div className="absolute inset-0 rounded-full border border-halo-accent opacity-80"
                         style={{ clipPath: 'polygon(0 0, 100% 0, 100% 15%, 0 15%)' }}></div>
                    
                    {/* Signal bar indicators that light up based on signal strength */}
                    <div className={`absolute bottom-0 left-1/4 w-1 h-2 rounded-t ${latestSignal > 20 ? 'bg-green-400' : 'bg-gray-600'}`}></div>
                    <div className={`absolute bottom-0 left-2/4 w-1 h-4 rounded-t ${latestSignal > 40 ? 'bg-green-400' : 'bg-gray-600'}`}></div>
                    <div className={`absolute bottom-0 left-3/4 w-1 h-6 rounded-t ${latestSignal > 60 ? 'bg-green-400' : 'bg-gray-600'}`}></div>
                    <div className={`absolute bottom-0 right-1/4 w-1 h-8 rounded-t ${latestSignal > 80 ? 'bg-green-400' : 'bg-gray-600'}`}></div>
                    
                    {/* Radar sweep animation */}
                    <div 
                      className="absolute inset-0 flex items-center"
                      style={{ 
                        transform: 'rotate(-45deg)',
                        transformOrigin: 'center'
                      }}
                    >
                      <div className="h-px w-1/2 bg-gradient-to-r from-transparent to-halo-accent animate-radar-sweep"
                           style={{ transformOrigin: 'left center' }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-sm text-gray-300 mb-1">Status</div>
                    <div className="flex items-center">
                      <div className={`w-2 h-2 rounded-full mr-2 ${latestSignal > 60 ? 'bg-green-500' : latestSignal > 30 ? 'bg-yellow-500' : 'bg-red-500'}`}></div>
                      <span className="text-sm">
                        {latestSignal > 60 ? 'Excellent' : latestSignal > 30 ? 'Fair' : 'Poor'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DiagnosticsPanel;
