
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

interface ActionMapping {
  id: string;
  action: string;
  key: string;
}

const MappingPanel: React.FC = () => {
  const [mappingMode, setMappingMode] = useState<'keyboard' | 'mouse'>('keyboard');
  const [actionMappings, setActionMappings] = useState<ActionMapping[]>([
    { id: '1', action: 'Walk Forward', key: 'W' },
    { id: '2', action: 'Walk Backward', key: 'S' },
    { id: '3', action: 'Strafe Left', key: 'A' },
    { id: '4', action: 'Strafe Right', key: 'D' },
    { id: '5', action: 'Jump', key: 'Space' },
    { id: '6', action: 'Run', key: 'Shift' },
    { id: '7', action: 'Primary Fire', key: 'Mouse 1' },
    { id: '8', action: 'Secondary Fire', key: 'Mouse 2' },
  ]);

  const [selectedAction, setSelectedAction] = useState<string | null>(null);

  const handleKeySelection = (actionId: string, key: string) => {
    setActionMappings(prevMappings => 
      prevMappings.map(mapping => 
        mapping.id === actionId ? { ...mapping, key } : mapping
      )
    );
    setSelectedAction(null);
  };

  return (
    <div className="flex flex-col items-center w-full h-full p-6 overflow-auto">
      <h2 className="text-2xl font-bold text-center text-halo-accent mb-6 tracking-wider neon-text">
        HALO CONTROL MAPPING
      </h2>
      
      {/* Toggle between keyboard and mouse */}
      <ToggleGroup type="single" value={mappingMode} onValueChange={(value) => value && setMappingMode(value as 'keyboard' | 'mouse')} className="mb-8">
        <ToggleGroupItem value="keyboard" className="bg-halo-darker data-[state=on]:bg-halo-accent data-[state=on]:text-black">
          Keyboard
        </ToggleGroupItem>
        <ToggleGroupItem value="mouse" className="bg-halo-darker data-[state=on]:bg-halo-accent data-[state=on]:text-black">
          Mouse
        </ToggleGroupItem>
      </ToggleGroup>
      
      {/* Keyboard/Mouse Visualization */}
      <div className="relative w-full max-w-4xl h-64 mb-12 flex justify-center">
        {mappingMode === 'keyboard' ? (
          <div className="keyboard-container relative w-full h-full border border-halo-accent border-opacity-30 rounded-lg bg-black bg-opacity-40 backdrop-blur-sm">
            {/* Keyboard layout visualization */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 grid grid-cols-12 gap-1 w-4/5">
              {/* Function keys */}
              {Array.from({ length: 12 }, (_, i) => (
                <div key={`f${i+1}`} className="w-8 h-8 rounded bg-black border border-white border-opacity-20 text-xs flex items-center justify-center text-white">
                  F{i+1}
                </div>
              ))}
              
              {/* Main keyboard */}
              <div className="col-span-12 grid grid-cols-15 gap-1 mt-2">
                {["Esc", "`", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "=", "⌫"].map((key) => (
                  <div 
                    key={key} 
                    className="w-8 h-8 rounded bg-black border border-white border-opacity-20 text-xs flex items-center justify-center text-white hover:border-halo-accent hover:text-halo-accent transition-colors cursor-pointer"
                  >
                    {key}
                  </div>
                ))}
              </div>

              {/* QWERTY row */}
              <div className="col-span-12 grid grid-cols-15 gap-1 mt-1">
                {["Tab", "Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P", "[", "]", "\\", "Del"].map((key) => (
                  <div 
                    key={key} 
                    className={`w-8 h-8 rounded border text-xs flex items-center justify-center cursor-pointer transition-all ${
                      key === 'W' ? 'bg-halo-accent bg-opacity-30 border-halo-accent text-white glow-effect' : 'bg-black border-white border-opacity-20 text-white hover:border-halo-accent hover:text-halo-accent'
                    }`}
                  >
                    {key}
                  </div>
                ))}
              </div>

              {/* ASDF row */}
              <div className="col-span-12 grid grid-cols-15 gap-1 mt-1">
                {["Caps", "A", "S", "D", "F", "G", "H", "J", "K", "L", ";", "'", "Enter", "Enter", "PgUp"].map((key, idx) => (
                  <div 
                    key={`${key}-${idx}`} 
                    className={`w-8 h-8 rounded border text-xs flex items-center justify-center cursor-pointer transition-all ${
                      key === 'A' || key === 'S' || key === 'D' ? 'bg-halo-accent bg-opacity-30 border-halo-accent text-white glow-effect' : 'bg-black border-white border-opacity-20 text-white hover:border-halo-accent hover:text-halo-accent'
                    } ${key === 'Enter' && idx === 13 ? 'col-span-2' : ''}`}
                  >
                    {key}
                  </div>
                ))}
              </div>

              {/* ZXCV row */}
              <div className="col-span-12 grid grid-cols-15 gap-1 mt-1">
                {["Shift", "Shift", "Z", "X", "C", "V", "B", "N", "M", ",", ".", "/", "Shift", "↑", "PgDn"].map((key, idx) => (
                  <div 
                    key={`${key}-${idx}`}
                    className={`w-8 h-8 rounded border text-xs flex items-center justify-center cursor-pointer transition-all ${
                      key === 'Shift' && idx === 0 ? 'col-span-2' : ''
                    } ${
                      key === 'Shift' ? 'bg-halo-accent bg-opacity-30 border-halo-accent text-white glow-effect' : 'bg-black border-white border-opacity-20 text-white hover:border-halo-accent hover:text-halo-accent'
                    }`}
                  >
                    {key}
                  </div>
                ))}
              </div>

              {/* Spacebar row */}
              <div className="col-span-12 grid grid-cols-15 gap-1 mt-1">
                {["Ctrl", "Win", "Alt", "Space", "Space", "Space", "Space", "Space", "Space", "Alt", "Fn", "Menu", "Ctrl", "←", "↓", "→"].map((key, idx) => (
                  <div 
                    key={`${key}-${idx}`}
                    className={`w-8 h-8 rounded border text-xs flex items-center justify-center cursor-pointer transition-all ${
                      key === 'Space' ? 'col-span-1' : ''
                    } ${
                      key === 'Space' ? 'bg-halo-accent bg-opacity-30 border-halo-accent text-white glow-effect' : 'bg-black border-white border-opacity-20 text-white hover:border-halo-accent hover:text-halo-accent'
                    }`}
                  >
                    {key === 'Space' ? '' : key}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="mouse-container relative w-64 h-full border border-halo-accent border-opacity-30 rounded-lg bg-black bg-opacity-40 backdrop-blur-sm">
            {/* Mouse visualization */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="w-40 h-64 rounded-3xl border-2 border-white border-opacity-30 bg-black bg-opacity-60 flex flex-col items-center justify-start relative">
                {/* Left click area */}
                <div className="w-1/2 h-20 border-r border-white border-opacity-20 absolute top-0 left-0 rounded-tl-3xl hover:bg-halo-accent hover:bg-opacity-20 cursor-pointer transition-all">
                  <span className="absolute bottom-2 right-2 text-xs text-white opacity-70">M1</span>
                </div>
                
                {/* Right click area */}
                <div className="w-1/2 h-20 absolute top-0 right-0 rounded-tr-3xl hover:bg-halo-accent hover:bg-opacity-20 cursor-pointer transition-all">
                  <span className="absolute bottom-2 left-2 text-xs text-white opacity-70">M2</span>
                </div>
                
                {/* Scroll wheel */}
                <div className="w-8 h-8 rounded-full border border-white border-opacity-40 absolute top-24 left-1/2 transform -translate-x-1/2 hover:border-halo-accent cursor-pointer transition-all">
                  <span className="absolute inset-0 flex items-center justify-center text-xs text-white">M3</span>
                </div>
                
                {/* Side buttons */}
                <div className="absolute left-0 top-1/3 w-2 h-8 border border-white border-opacity-30 rounded-r hover:border-halo-accent hover:bg-halo-accent hover:bg-opacity-20 cursor-pointer transition-all">
                  <span className="absolute top-0 right-0 text-[8px] text-white opacity-70">M4</span>
                </div>
                <div className="absolute left-0 top-1/2 w-2 h-8 border border-white border-opacity-30 rounded-r hover:border-halo-accent hover:bg-halo-accent hover:bg-opacity-20 cursor-pointer transition-all">
                  <span className="absolute top-0 right-0 text-[8px] text-white opacity-70">M5</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Mapping Configuration */}
      <div className="w-full max-w-4xl">
        <h3 className="text-lg font-medium mb-4 text-white">Action Mappings</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {actionMappings.map((mapping) => (
            <Card key={mapping.id} className="bg-halo-darker bg-opacity-70 border border-halo-accent border-opacity-30 text-white">
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{mapping.action}</span>
                  <div 
                    className="px-3 py-1 rounded bg-black border border-halo-accent text-halo-accent hover:bg-halo-accent hover:bg-opacity-20 cursor-pointer transition-all"
                    onClick={() => setSelectedAction(selectedAction === mapping.id ? null : mapping.id)}
                  >
                    {mapping.key}
                  </div>
                </div>
                
                {selectedAction === mapping.id && (
                  <div className="mt-3 grid grid-cols-4 gap-2">
                    {['W', 'A', 'S', 'D', 'Space', 'Shift', 'Mouse 1', 'Mouse 2'].map((key) => (
                      <div 
                        key={key}
                        className={`px-2 py-1 text-xs border border-white border-opacity-30 rounded text-center cursor-pointer hover:bg-halo-accent hover:text-black transition-all ${
                          mapping.key === key ? 'bg-halo-accent text-black' : 'bg-black'
                        }`}
                        onClick={() => handleKeySelection(mapping.id, key)}
                      >
                        {key}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MappingPanel;
