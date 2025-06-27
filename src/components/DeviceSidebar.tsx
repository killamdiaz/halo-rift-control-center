import React from 'react';
import {
  LayoutDashboard,
  Settings,
  Zap,
  Activity,
  BarChart3,
  Settings2,
  Footprints,
  Target,
  ShirtIcon,
  Cpu,
  Headphones,
  Radio
} from 'lucide-react';
import { NavItem } from "@/components/ui/nav-item"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useSidebar } from "@/components/ui/sidebar"

interface DeviceSidebarProps {
  currentDevice: string;
  onDeviceChange: (device: string) => void;
  currentMode?: 'warp' | 'halo-pro';
}

export default function DeviceSidebar({ currentDevice, onDeviceChange, currentMode = 'warp' }: DeviceSidebarProps) {
  const { state } = useSidebar();
  
  const deviceItems = [
    {
      title: "HALO Shoe",
      icon: Footprints,
      id: "shoe",
      isConnected: true,
      battery: 85
    },
    {
      title: "HALO Gun", 
      icon: Target,
      id: "gun",
      isConnected: true,
      battery: 92
    },
    {
      title: "HALO Belt",
      icon: ShirtIcon,
      id: "belt",
      isConnected: true,
      battery: 73
    },
    {
      title: "Tactical Suit",
      icon: ShirtIcon, 
      id: "suit",
      isConnected: false,
      battery: 15
    },
    {
      title: "Meta Quest",
      icon: Headphones,
      id: "quest",
      isConnected: true,
      battery: 68
    }
  ];

  const systemItems = [
    {
      title: "Paired Devices",
      icon: Settings,
      id: "devices"
    },
    {
      title: "Live Telemetry",
      icon: Radio,
      id: "telemetry"
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

  const modeColors = {
    warp: 'text-yellow-400',
    'halo-pro': 'text-halo-accent'
  };

  const modeNames = {
    warp: 'Warp Mode',
    'halo-pro': 'HALO Pro Mode'
  };

  return (
    <aside className={`bg-black bg-opacity-40 backdrop-blur-lg border-r border-halo-accent border-opacity-20 w-64 flex-shrink-0 ${state === 'expanded' ? 'block' : 'hidden'} md:block`}>
      <ScrollArea className="py-4 h-full">
        <div className="px-3 py-2 flex flex-col h-full">
          {/* HALO OS Title */}
          <div className="px-4 mb-6">
            <h1 className="text-xl font-bold text-blue-400">HALO OS</h1>
          </div>

          <div className="flex-1">
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
          
          {/* Current Mode Display */}
          <div className="mt-4 px-4 py-3 bg-black bg-opacity-30 rounded-lg border border-halo-accent border-opacity-20">
            <div className="flex items-center space-x-2">
              <Cpu className="w-4 h-4 text-gray-400" />
              <div className="flex-1">
                <div className="text-xs text-gray-400 uppercase tracking-wide">Current Mode</div>
                <div className={`text-sm font-medium ${modeColors[currentMode]}`}>
                  {modeNames[currentMode]}
                </div>
              </div>
            </div>
          </div>
        </div>
      </ScrollArea>
    </aside>
  );
}
