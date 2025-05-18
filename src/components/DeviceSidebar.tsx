
import React from 'react';
import { Footprints, Gamepad2, ShirtIcon, Keyboard, TestTube } from 'lucide-react';
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
    { id: 'suit', label: 'Suit', icon: ShirtIcon },
    { id: 'mapping', label: 'Mapping', icon: Keyboard },
    { id: 'test', label: 'Test Mode', icon: TestTube }
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
            <SidebarMenuItem key={device.id} className="relative mb-3">
              {currentDevice === device.id && (
                <div className="absolute left-0 top-0 w-1 h-full bg-halo-accent rounded-r-md glow-effect"></div>
              )}
              <SidebarMenuButton
                className={`w-full h-12 flex items-center justify-center transition-all duration-300 hover:scale-110 group ${
                  currentDevice === device.id 
                    ? 'bg-halo-darker bg-opacity-70 text-halo-accent' 
                    : 'hover:bg-halo-darker hover:bg-opacity-40'
                }`}
                onClick={() => onDeviceChange(device.id)}
                tooltip={device.label}
              >
                <device.icon className={`h-6 w-6 transition-all duration-300 ${
                  currentDevice === device.id 
                    ? 'text-halo-accent' 
                    : 'group-hover:text-halo-accent'
                }`} />
                {currentDevice === device.id && (
                  <div className="absolute inset-0 rounded-md border border-halo-accent border-opacity-30 pointer-events-none glow-effect"></div>
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
