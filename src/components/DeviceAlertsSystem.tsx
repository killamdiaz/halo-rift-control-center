
import React, { useState, useEffect } from 'react';
import { Bell, BellDot, X, Battery, Wifi, AlertTriangle, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface DeviceAlert {
  id: string;
  type: 'battery' | 'disconnect' | 'latency' | 'update';
  deviceName: string;
  message: string;
  timestamp: Date;
  severity: 'low' | 'medium' | 'high';
  isRead: boolean;
}

const DeviceAlertsSystem: React.FC = () => {
  const [alerts, setAlerts] = useState<DeviceAlert[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Simulate incoming alerts
    const alertsToAdd = [
      {
        id: '1',
        type: 'battery' as const,
        deviceName: 'Tactical Suit',
        message: 'Battery level is critically low (15%)',
        timestamp: new Date(Date.now() - 300000),
        severity: 'high' as const,
        isRead: false
      },
      {
        id: '2',
        type: 'latency' as const,
        deviceName: 'Primary Gun',
        message: 'High latency spike detected (45ms)',
        timestamp: new Date(Date.now() - 120000),
        severity: 'medium' as const,
        isRead: false
      },
      {
        id: '3',
        type: 'update' as const,
        deviceName: 'Left Shoe',
        message: 'Firmware update v1.2.1 available',
        timestamp: new Date(Date.now() - 60000),
        severity: 'low' as const,
        isRead: false
      }
    ];

    setAlerts(alertsToAdd);
  }, []);

  const unreadCount = alerts.filter(alert => !alert.isRead).length;

  const markAsRead = (alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, isRead: true } : alert
    ));
  };

  const dismissAlert = (alertId: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== alertId));
  };

  const markAllAsRead = () => {
    setAlerts(prev => prev.map(alert => ({ ...alert, isRead: true })));
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'battery': return <Battery className="w-4 h-4" />;
      case 'disconnect': return <Wifi className="w-4 h-4" />;
      case 'latency': return <AlertTriangle className="w-4 h-4" />;
      case 'update': return <Download className="w-4 h-4" />;
      default: return <Bell className="w-4 h-4" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'text-red-400 border-red-400';
      case 'medium': return 'text-yellow-400 border-yellow-400';
      case 'low': return 'text-blue-400 border-blue-400';
      default: return 'text-gray-400 border-gray-400';
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="relative">
      {/* Bell Icon */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="relative text-white hover:text-halo-accent"
      >
        {unreadCount > 0 ? (
          <BellDot className="w-5 h-5" />
        ) : (
          <Bell className="w-5 h-5" />
        )}
        
        {unreadCount > 0 && (
          <Badge 
            variant="destructive" 
            className="absolute -top-2 -right-2 w-5 h-5 p-0 flex items-center justify-center text-xs"
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </Badge>
        )}
      </Button>

      {/* Alerts Dropdown */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 max-h-96 bg-black bg-opacity-90 backdrop-blur-lg border border-halo-accent border-opacity-30 rounded-lg shadow-2xl z-50 overflow-hidden">
          <div className="p-4 border-b border-halo-accent border-opacity-20">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-white">Device Alerts</h3>
              <div className="flex space-x-2">
                {unreadCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={markAllAsRead}
                    className="text-xs text-halo-accent hover:text-white"
                  >
                    Mark all read
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  className="text-white hover:text-halo-accent p-1"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          <div className="max-h-80 overflow-y-auto">
            {alerts.length === 0 ? (
              <div className="p-6 text-center text-gray-400">
                <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>No alerts</p>
                <p className="text-sm">All systems running smoothly</p>
              </div>
            ) : (
              alerts.map(alert => (
                <div
                  key={alert.id}
                  className={`p-4 border-b border-halo-accent border-opacity-10 hover:bg-halo-accent hover:bg-opacity-5 transition-colors ${
                    !alert.isRead ? 'bg-halo-accent bg-opacity-5' : ''
                  }`}
                  onClick={() => markAsRead(alert.id)}
                >
                  <div className="flex items-start space-x-3">
                    <div className={`p-1 rounded ${getSeverityColor(alert.severity)}`}>
                      {getAlertIcon(alert.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-white text-sm">{alert.deviceName}</p>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-gray-400">{formatTime(alert.timestamp)}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              dismissAlert(alert.id);
                            }}
                            className="text-gray-400 hover:text-white p-1"
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-sm text-gray-300 mt-1">{alert.message}</p>
                      {!alert.isRead && (
                        <div className="w-2 h-2 bg-halo-accent rounded-full mt-2" />
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DeviceAlertsSystem;
