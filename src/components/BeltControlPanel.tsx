
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle2, AlertTriangle, Battery, Cpu, Zap } from 'lucide-react';
import BeltSettings from './settings/BeltSettings';

interface Belt {
  id: string;
  battery: number;
  role: string;
  status: 'Connected' | 'Low Battery';
}

interface BeltControlPanelProps {
  onBeltSelect: (belt: Belt | null) => void;
}

const BeltControlPanel: React.FC<BeltControlPanelProps> = ({ onBeltSelect }) => {
  const [selectedBelt, setSelectedBelt] = useState<Belt | null>(null);
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null);
  const [hotspotPosition, setHotspotPosition] = useState({ x: 0, y: 0 });
  const [belts, setBelts] = useState<Belt[]>([
    { id: 'HB-1092', battery: 87, role: 'Torso', status: 'Connected' },
    { id: 'HB-0084', battery: 63, role: 'Gun', status: 'Connected' },
    { id: 'HB-2711', battery: 44, role: 'Unassigned', status: 'Low Battery' },
  ]);
  const { toast } = useToast();

  const handleBeltSelect = (belt: Belt) => {
    setSelectedBelt(belt);
    onBeltSelect(belt);
    toast({
      title: "Belt Selected",
      description: `Belt ${belt.id} selected. Ready for configuration.`,
    });
  };

  const handleHotspotClick = (type: string, event: React.MouseEvent) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setHotspotPosition({
      x: rect.right + 10,
      y: rect.top
    });
    setActiveHotspot(type);
  };

  const handleRoleChange = (beltId: string, newRole: string) => {
    setBelts(prevBelts => 
      prevBelts.map(belt => 
        belt.id === beltId ? { ...belt, role: newRole } : belt
      )
    );
    
    // Update selected belt if it's the one being changed
    if (selectedBelt?.id === beltId) {
      const updatedBelt = { ...selectedBelt, role: newRole };
      setSelectedBelt(updatedBelt);
      onBeltSelect(updatedBelt);
    }
    
    toast({
      title: "Role Updated",
      description: `Belt ${beltId} assigned to ${newRole}`,
    });
  };

  return (
    <div className="flex-1 px-6 py-6 space-y-6">
      {/* Title Section */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-halo-accent">HALO Belt</h1>
        {selectedBelt ? (
          <p className="text-halo-accent text-lg">Selected: {selectedBelt.id}</p>
        ) : (
          <p className="text-white text-lg">Select a belt from the table below</p>
        )}
      </div>

      {/* Belt Visualization */}
      {selectedBelt && (
        <div className="relative flex justify-center items-center min-h-[400px]">
          <div className="relative">
            <img 
              src="/lovable-uploads/ab62187a-da93-448e-b075-1293205e9649.png" 
              alt="HALO Belt" 
              className="w-96 h-auto"
            />
            
            {/* IMU Hotspot */}
            <button
              className="hotspot"
              style={{ top: '30%', left: '15%' }}
              onClick={(e) => handleHotspotClick('imu', e)}
              title="IMU Sensitivity Settings"
            >
              <Cpu className="w-5 h-5 text-halo-accent" />
            </button>
            
            {/* MCU Hotspot */}
            <button
              className="hotspot"
              style={{ top: '45%', right: '20%' }}
              onClick={(e) => handleHotspotClick('mcu', e)}
              title="MCU Firmware Information"
            >
              <Cpu className="w-5 h-5 text-halo-accent" />
            </button>
            
            {/* Vibration Motor Hotspot */}
            <button
              className="hotspot"
              style={{ bottom: '25%', left: '50%', transform: 'translateX(-50%)' }}
              onClick={(e) => handleHotspotClick('vibration', e)}
              title="Vibration Motor Intensity"
            >
              <Zap className="w-5 h-5 text-halo-accent" />
            </button>
          </div>
        </div>
      )}

      {/* Connected Belts Table */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-white">Connected Belts</h2>
          <Button className="bg-halo-accent hover:bg-halo-accent/80 text-black font-medium">
            + Add New Belt
          </Button>
        </div>
        
        <div className="rounded-lg border border-halo-accent border-opacity-20 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-halo-accent border-opacity-20 hover:bg-black hover:bg-opacity-20">
                <TableHead className="text-halo-accent font-semibold">Belt ID</TableHead>
                <TableHead className="text-halo-accent font-semibold">Battery</TableHead>
                <TableHead className="text-halo-accent font-semibold">Assigned Role</TableHead>
                <TableHead className="text-halo-accent font-semibold">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {belts.map((belt) => (
                <TableRow
                  key={belt.id}
                  className={`cursor-pointer border-halo-accent border-opacity-20 hover:bg-halo-accent hover:bg-opacity-10 transition-all duration-200 ${
                    selectedBelt?.id === belt.id 
                      ? 'bg-halo-accent bg-opacity-20 border-halo-accent border-2' 
                      : ''
                  }`}
                  onClick={() => handleBeltSelect(belt)}
                >
                  <TableCell className="text-white font-medium">{belt.id}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Battery className="w-4 h-4 text-halo-accent" />
                      <span className="text-white">{belt.battery}%</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Select
                      value={belt.role}
                      onValueChange={(value) => handleRoleChange(belt.id, value)}
                    >
                      <SelectTrigger className="w-32 bg-black bg-opacity-30 border-halo-accent border-opacity-20 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-black border-halo-accent border-opacity-20">
                        <SelectItem value="Gun" className="text-white hover:bg-halo-accent hover:bg-opacity-20">Gun</SelectItem>
                        <SelectItem value="Torso" className="text-white hover:bg-halo-accent hover:bg-opacity-20">Torso</SelectItem>
                        <SelectItem value="Foot" className="text-white hover:bg-halo-accent hover:bg-opacity-20">Foot</SelectItem>
                        <SelectItem value="Unassigned" className="text-white hover:bg-halo-accent hover:bg-opacity-20">Unassigned</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <div className={`flex items-center space-x-2 ${
                      belt.status === 'Connected' 
                        ? 'text-green-400' 
                        : 'text-orange-400'
                    }`}>
                      {belt.status === 'Connected' ? (
                        <CheckCircle2 className="w-4 h-4" />
                      ) : (
                        <AlertTriangle className="w-4 h-4" />
                      )}
                      <span>{belt.status}</span>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Settings Panel */}
      {activeHotspot && (
        <BeltSettings
          type={activeHotspot as 'imu' | 'mcu' | 'vibration'}
          onClose={() => setActiveHotspot(null)}
          position={hotspotPosition}
        />
      )}
    </div>
  );
};

export default BeltControlPanel;
