
import React, { useState } from 'react';
import { Bell, X, AlertTriangle, Battery, Wifi, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Alert {
  id: string;
  type: 'warning' | 'error' | 'info';
  device: string;
  message: string;
  time: string;
  icon: React.ComponentType<{ className?: string }>;
}

const DeviceAlertsSystem: React.FC = () => {
  const [alerts, setAlerts] = useState<Alert[]>([
    {
      id: '1',
      type: 'warning',
      device: 'Tactical Suit',
      message: 'Battery low (15%)',
      time: '2 min ago',
      icon: Battery
    },
    {
      id: '2',
      type: 'error',
      device: 'Tactical Suit',
      message: 'Device disconnected',
      time: '5 min ago',
      icon: Wifi
    },
    {
      id: '3',
      type: 'info',
      device: 'Primary Gun',
      message: 'Firmware update available',
      time: '1 hour ago',
      icon: Download
    }
  ]);

  const removeAlert = (id: string) => {
    setAlerts(alerts.filter(alert => alert.id !== id));
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'error': return 'text-red-400';
      case 'warning': return 'text-yellow-400';
      case 'info': return 'text-blue-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="relative">
          <Bell className="h-4 w-4" />
          {alerts.length > 0 && (
            <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
              {alerts.length}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        className="w-80 mr-4 bg-black bg-opacity-95 backdrop-blur-lg border-halo-accent border-opacity-30 text-white z-[9999]"
        align="end"
        sideOffset={8}
      >
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-halo-accent">Device Alerts</h3>
            <span className="text-xs text-gray-400">{alerts.length} active</span>
          </div>
          
          {alerts.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-4">
              No active alerts
            </p>
          ) : (
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {alerts.map((alert) => (
                <div 
                  key={alert.id}
                  className="flex items-start space-x-3 p-3 rounded-lg bg-black bg-opacity-50 border border-halo-accent border-opacity-20"
                >
                  <alert.icon className={`w-4 h-4 mt-0.5 flex-shrink-0 ${getAlertColor(alert.type)}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">
                      {alert.device}
                    </p>
                    <p className="text-xs text-gray-300 mt-1">
                      {alert.message}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {alert.time}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 hover:bg-halo-accent hover:bg-opacity-20"
                    onClick={() => removeAlert(alert.id)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default DeviceAlertsSystem;
