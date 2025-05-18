
import React from 'react';
import { Footprints, Gamepad2, ShirtIcon, Keyboard, TestTube, CircleDot } from 'lucide-react';
import { 
  Sidebar, 
  SidebarContent, 
  SidebarMenu, 
  SidebarMenuButton, 
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar
} from '@/components/ui/sidebar';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface DeviceStatus {
  online: boolean;
  ip?: string;
  status?: string;
}

interface DeviceSidebarProps {
  currentDevice: string;
  onDeviceChange: (device: string) => void;
}

const DeviceSidebar: React.FC<DeviceSidebarProps> = ({ 
  currentDevice, 
  onDeviceChange 
}) => {
  const { state } = useSidebar();
  const isCollapsed = state === 'collapsed';

  // Mock device statuses - would come from real data in production
  const deviceStatuses: Record<string, DeviceStatus> = {
    'shoe': { online: true, ip: '192.168.1.101', status: 'Connected' },
    'gun': { online: false, ip: '192.168.1.102', status: 'Disconnected' },
    'suit': { online: true, ip: '192.168.1.103', status: 'Connected' }
  };

  const devices = [
    { id: 'shoe', label: 'Shoe', icon: Footprints },
    { id: 'gun', label: 'Gun', icon: Gamepad2 },
    { id: 'suit', label: 'Suit', icon: ShirtIcon },
    { id: 'mapping', label: 'Mapping', icon: Keyboard },
    { id: 'test', label: 'Test Mode', icon: TestTube }
  ];

  return (
    <Sidebar 
      variant="floating" 
      className="border-r border-halo-accent border-opacity-20 backdrop-blur-lg bg-black bg-opacity-40 w-16"
    >
      <SidebarContent className="py-6">
        <SidebarTrigger className="mb-8 self-end hover:text-halo-accent transition-colors" />
        <SidebarMenu>
          {devices.map((device) => (
            <SidebarMenuItem key={device.id} className="relative mb-3">
              {currentDevice === device.id && (
                <div className="absolute left-0 top-0 w-1 h-full bg-halo-accent rounded-r-md glow-effect"></div>
              )}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <SidebarMenuButton
                      className={`w-12 h-12 rounded-lg flex flex-col items-center justify-center transition-all duration-300 hover:scale-105 group ${
                        currentDevice === device.id 
                          ? 'bg-halo-accent bg-opacity-20 text-halo-accent border border-halo-accent border-opacity-50 glow-effect' 
                          : 'hover:bg-halo-darker hover:bg-opacity-40'
                      }`}
                      onClick={() => onDeviceChange(device.id)}
                    >
                      <device.icon className={`h-6 w-6 transition-all duration-300 ${
                        currentDevice === device.id 
                          ? 'text-halo-accent' 
                          : 'group-hover:text-halo-accent'
                      }`} />
                      
                      {/* Show online status indicator for hardware devices */}
                      {['shoe', 'gun', 'suit'].includes(device.id) && deviceStatuses[device.id] && (
                        <div className="flex items-center mt-1 text-xs">
                          <CircleDot 
                            className={`mr-1 h-2 w-2 ${deviceStatuses[device.id].online ? 'text-green-400' : 'text-red-400'}`} 
                          />
                          {deviceStatuses[device.id].online ? 'Online' : 'Offline'}
                        </div>
                      )}
                    </SidebarMenuButton>
                  </TooltipTrigger>
                  
                  {/* Show IP and status on hover for hardware devices */}
                  {['shoe', 'gun', 'suit'].includes(device.id) && deviceStatuses[device.id] && (
                    <TooltipContent side="right" className="bg-halo-darker border border-halo-accent p-3 rounded-md">
                      <div className="flex flex-col">
                        <span className="font-bold text-halo-accent">{device.label}</span>
                        <span>Status: {deviceStatuses[device.id].status}</span>
                        <span>IP: {deviceStatuses[device.id].ip || 'N/A'}</span>
                      </div>
                    </TooltipContent>
                  )}
                </Tooltip>
              </TooltipProvider>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
};

export default DeviceSidebar;
