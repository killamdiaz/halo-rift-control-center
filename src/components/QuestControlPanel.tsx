
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { 
  Gamepad2, 
  Wifi, 
  Globe, 
  Zap, 
  RotateCcw, 
  Activity, 
  MonitorPlay,
  Target,
  Sparkles
} from 'lucide-react';

const QuestControlPanel = () => {
  const [vrMode, setVrMode] = useState(true);

  return (
    <div className="flex-1 px-6 py-6 space-y-6">
      {/* Header with Meta Quest title and Launch Origin VR World button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Gamepad2 className="w-8 h-8 text-halo-accent" />
          <h1 className="text-3xl font-bold">Meta Quest</h1>
        </div>
        <Button 
          className={`bg-halo-accent hover:bg-halo-accent/80 text-white px-6 py-3 text-lg font-semibold ${
            vrMode ? 'animate-pulse-glow' : ''
          }`}
        >
          <Sparkles className="w-5 h-5 mr-2" />
          Launch Origin VR World
        </Button>
      </div>

      {/* Status Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-black bg-opacity-40 backdrop-blur-lg border-halo-accent border-opacity-20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-400 flex items-center">
              <Gamepad2 className="w-4 h-4 mr-2" />
              VR Mode
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Switch 
                checked={vrMode} 
                onCheckedChange={setVrMode}
                className={vrMode ? 'data-[state=checked]:bg-halo-accent' : ''}
              />
              <span className={`font-medium ${vrMode ? 'text-halo-accent' : 'text-gray-400'}`}>
                {vrMode ? 'ON' : 'OFF'}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black bg-opacity-40 backdrop-blur-lg border-halo-accent border-opacity-20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-400 flex items-center">
              <Activity className="w-4 h-4 mr-2" />
              Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Badge className="bg-green-500 bg-opacity-20 text-green-400 border-green-500 border-opacity-30">
              Connected (Wi-Fi)
            </Badge>
          </CardContent>
        </Card>

        <Card className="bg-black bg-opacity-40 backdrop-blur-lg border-halo-accent border-opacity-20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-400 flex items-center">
              <Wifi className="w-4 h-4 mr-2" />
              IP Address
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-halo-accent font-mono text-sm">
              192.168.0.105
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black bg-opacity-40 backdrop-blur-lg border-halo-accent border-opacity-20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-400 flex items-center">
              <Globe className="w-4 h-4 mr-2" />
              Integration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Badge className="bg-halo-accent bg-opacity-20 text-halo-accent border-halo-accent border-opacity-30">
              Unity Streaming
            </Badge>
          </CardContent>
        </Card>
      </div>

      {/* Device Image - Centered */}
      <div className="flex justify-center py-6">
        <div className="relative">
          <img 
            src="/lovable-uploads/c22cdbad-2bb8-42d8-a76b-7f5215098b38.png" 
            alt="Meta Quest VR Headset" 
            className={`w-80 h-80 object-contain transition-all duration-300 ${
              vrMode ? 'drop-shadow-[0_0_20px_rgba(0,204,255,0.6)]' : ''
            }`}
          />
        </div>
      </div>

      {/* Tools Section */}
      <Card className="bg-black bg-opacity-40 backdrop-blur-lg border-halo-accent border-opacity-20">
        <CardHeader>
          <CardTitle className="text-halo-accent flex items-center">
            <Zap className="w-5 h-5 mr-2" />
            Tools
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <Button 
              variant="outline" 
              className="bg-halo-accent bg-opacity-10 border-halo-accent border-opacity-30 text-halo-accent hover:bg-halo-accent hover:bg-opacity-20"
            >
              <Target className="w-4 h-4 mr-2" />
              Calibrate Body
            </Button>
            <Button 
              variant="outline" 
              className="bg-blue-500 bg-opacity-10 border-blue-500 border-opacity-30 text-blue-400 hover:bg-blue-500 hover:bg-opacity-20"
            >
              <Activity className="w-4 h-4 mr-2" />
              Test Movement
            </Button>
            <Button 
              variant="outline" 
              className="bg-purple-500 bg-opacity-10 border-purple-500 border-opacity-30 text-purple-400 hover:bg-purple-500 hover:bg-opacity-20"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset Pose
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Coming Soon Section */}
      <Card className="bg-black bg-opacity-40 backdrop-blur-lg border-yellow-500 border-opacity-20">
        <CardHeader>
          <CardTitle className="text-yellow-400 flex items-center">
            <Sparkles className="w-5 h-5 mr-2" />
            Coming Soon
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center space-x-3 text-gray-400">
            <MonitorPlay className="w-5 h-5" />
            <span>Mirror VR feed</span>
          </div>
          <div className="flex items-center space-x-3 text-gray-400">
            <Target className="w-5 h-5" />
            <span>Quest game overlay config</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuestControlPanel;
