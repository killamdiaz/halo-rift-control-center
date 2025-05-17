
import React from 'react';
import { Footprints, Gamepad2, ShirtIcon } from 'lucide-react';
import { 
  Sidebar, 
  SidebarContent, 
  SidebarMenu, 
  SidebarMenuButton, 
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar
} from '@/components/ui/sidebar';

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

  const devices = [
    { id: 'shoe', label: 'Shoe', icon: Footprints },
    { id: 'gun', label: 'Gun', icon: Gamepad2 },
    { id: 'suit', label: 'Suit', icon: ShirtIcon }
  ];

  return (
    <Sidebar 
      variant="floating" 
      className="border-r border-halo-accent border-opacity-20 backdrop-blur-lg bg-black bg-opacity-40"
    >
      <SidebarContent className="py-6">
        <SidebarTrigger className="mb-8 self-end hover:text-halo-accent transition-colors" />
        <SidebarMenu>
          {devices.map((device) => (
            <SidebarMenuItem key={device.id} className="relative">
              {currentDevice === device.id && (
                <div className="absolute left-0 top-0 w-1 h-full bg-halo-accent rounded-r-md glow-effect"></div>
              )}
              <SidebarMenuButton
                className={`w-full transition-all duration-300 hover:scale-105 group ${
                  currentDevice === device.id 
                    ? 'bg-halo-darker bg-opacity-70 text-halo-accent' 
                    : 'hover:bg-halo-darker hover:bg-opacity-40'
                }`}
                onClick={() => onDeviceChange(device.id)}
                tooltip={isCollapsed ? device.label : undefined}
              >
                <device.icon className={`h-5 w-5 transition-all duration-300 ${
                  currentDevice === device.id 
                    ? 'text-halo-accent' 
                    : 'group-hover:text-halo-accent'
                }`} />
                {!isCollapsed && (
                  <span className={`ml-2 transition-all duration-300 ${
                    currentDevice === device.id 
                      ? 'text-halo-accent font-medium' 
                      : ''
                  }`}>{device.label}</span>
                )}
                {currentDevice === device.id && (
                  <div className="absolute inset-0 rounded-md border border-halo-accent border-opacity-20 pointer-events-none"></div>
                )}
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
};

export default DeviceSidebar;
