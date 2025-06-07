
import React, { useState } from 'react';
import { Download, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface FirmwareUpdate {
  deviceId: string;
  deviceName: string;
  currentVersion: string;
  availableVersion: string;
  updateSize: string;
  releaseNotes: string[];
}

interface FirmwareUpdatePanelProps {
  updates: FirmwareUpdate[];
}

const FirmwareUpdatePanel: React.FC<FirmwareUpdatePanelProps> = ({ updates }) => {
  const [updatingDevices, setUpdatingDevices] = useState<{ [key: string]: number }>({});
  const [completedUpdates, setCompletedUpdates] = useState<string[]>([]);

  const startUpdate = (deviceId: string) => {
    setUpdatingDevices(prev => ({ ...prev, [deviceId]: 0 }));
    
    // Simulate update progress
    const interval = setInterval(() => {
      setUpdatingDevices(prev => {
        const currentProgress = prev[deviceId];
        if (currentProgress >= 100) {
          clearInterval(interval);
          setCompletedUpdates(prev => [...prev, deviceId]);
          const newState = { ...prev };
          delete newState[deviceId];
          return newState;
        }
        return { ...prev, [deviceId]: currentProgress + 2 };
      });
    }, 100);
  };

  if (updates.length === 0) return null;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-halo-accent flex items-center">
        <Download className="w-5 h-5 mr-2" />
        Firmware Updates Available
      </h3>
      
      {updates.map((update) => {
        const isUpdating = updatingDevices[update.deviceId] !== undefined;
        const isCompleted = completedUpdates.includes(update.deviceId);
        const progress = updatingDevices[update.deviceId] || 0;
        
        return (
          <Card key={update.deviceId} className="bg-black bg-opacity-40 border-halo-accent border-opacity-20">
            <CardHeader className="pb-3">
              <CardTitle className="text-white flex items-center justify-between">
                <span>{update.deviceName}</span>
                {isCompleted && <CheckCircle className="w-5 h-5 text-green-400" />}
              </CardTitle>
              <div className="text-sm text-gray-400">
                {update.currentVersion} → {update.availableVersion} ({update.updateSize})
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Release Notes */}
              <div className="text-sm text-gray-300">
                <div className="font-medium mb-1">What's New:</div>
                <ul className="list-disc list-inside space-y-1">
                  {update.releaseNotes.map((note, index) => (
                    <li key={index}>{note}</li>
                  ))}
                </ul>
              </div>
              
              {/* Update Progress */}
              {isUpdating && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white">Updating firmware...</span>
                    <span className="text-halo-accent">{progress}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                  <div className="flex items-center text-xs text-yellow-400">
                    <AlertTriangle className="w-3 h-3 mr-1" />
                    Do not disconnect device during update
                  </div>
                </div>
              )}
              
              {/* Update Button */}
              {!isUpdating && !isCompleted && (
                <Button
                  onClick={() => startUpdate(update.deviceId)}
                  className="w-full bg-halo-accent text-black hover:bg-halo-accent hover:opacity-80"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Update Now
                </Button>
              )}
              
              {isCompleted && (
                <div className="text-center text-green-400 font-medium">
                  ✓ Update completed successfully
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default FirmwareUpdatePanel;
