
import React from 'react';
import {
  LayoutDashboard,
  Settings,
  Gamepad2,
  Zap,
  Activity,
  BarChart3,
  Settings2,
  Footprints,
  Target,
  ShirtIcon
} from 'lucide-react';
import { NavItem } from "@/components/ui/nav-item"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useSidebar } from "@/components/ui/sidebar"

interface DeviceSidebarProps {
  currentDevice: string;
  onDeviceChange: (device: string) => void;
}

export default function DeviceSidebar({ currentDevice, onDeviceChange }: DeviceSidebarProps) {
  const { state } = useSidebar();
  
  const deviceItems = [
    {
      title: "Left Shoe",
      icon: Footprints,
      id: "shoe",
      isConnected: true,
      battery: 85
    },
    {
      title: "Primary Gun", 
      icon: Target,
      id: "gun",
      isConnected: true,
      battery: 92
    },
    {
      title: "Tactical Suit",
      icon: ShirtIcon, 
      id: "suit",
      isConnected: false,
      battery: 15
    }
  ];

  const systemItems = [
    {
      title: "Paired Devices",
      icon: Settings,
      id: "devices"
    },
    {
      title: "Control Mapping",
      icon: Gamepad2,
      id: "mapping"
    },
    {
      title: "Test Mode",
      icon: Zap,
      id: "test"
    },
    {
      title: "Diagnostics",
      icon: Activity,
      id: "diagnostics"
    },
    {
      title: "Analytics",
      icon: BarChart3,
      id: "analytics"
    },
    {
      title: "Performance",
      icon: Settings2,
      id: "settings"
    }
  ];

  return (
    <aside className={`bg-black bg-opacity-40 backdrop-blur-lg border-r border-halo-accent border-opacity-20 w-64 flex-shrink-0 ${state === 'expanded' ? 'block' : 'hidden'} md:block`}>
      <ScrollArea className="py-4 h-full">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            Devices
          </h2>
          {deviceItems.map((item) => (
            <NavItem
              key={item.id}
              title={item.title}
              icon={item.icon}
              id={item.id}
              active={currentDevice === item.id}
              onNavChange={onDeviceChange}
              alert={!item.isConnected || item.battery < 20}
            />
          ))}
          <Separator className="my-4 bg-halo-accent bg-opacity-40" />
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            System
          </h2>
          {systemItems.map((item) => (
            <NavItem
              key={item.id}
              title={item.title}
              icon={item.icon}
              id={item.id}
              active={currentDevice === item.id}
              onNavChange={onDeviceChange}
            />
          ))}
        </div>
      </ScrollArea>
    </aside>
  );
}
