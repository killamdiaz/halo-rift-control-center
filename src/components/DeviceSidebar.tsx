
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
    <Sidebar variant="floating" className="border-r border-halo-accent border-opacity-20">
      <SidebarContent className="py-6">
        <SidebarTrigger className="mb-8 self-end" />
        <SidebarMenu>
          {devices.map((device) => (
            <SidebarMenuItem key={device.id}>
              <SidebarMenuButton
                className={`w-full ${currentDevice === device.id ? 'bg-halo-accent bg-opacity-20 text-halo-accent' : ''}`}
                onClick={() => onDeviceChange(device.id)}
                tooltip={isCollapsed ? device.label : undefined}
              >
                <device.icon className="h-5 w-5" />
                {!isCollapsed && (
                  <span className="ml-2">{device.label}</span>
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
