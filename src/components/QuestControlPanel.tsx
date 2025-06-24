
import React, { useState } from 'react';
import { 
  Gamepad2, 
  Wifi, 
  Monitor, 
  Zap, 
  Play, 
  RotateCcw, 
  Settings, 
  Target,
  Globe
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function QuestControlPanel() {
  const [vrMode, setVrMode] = useState(false);

  return (
    <div className="flex-1 p-6 space-y-6">
      {/* Header with Meta Quest title and Launch Origin VR World button */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Meta Quest</h1>
        <Button 
          className={`bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 ${vrMode ? 'ring-2 ring-blue-400 shadow-lg shadow-blue-400/30' : ''}`}
        >
          <Globe className={`w-5 h-5 mr-2 ${vrMode ? 'text-blue-300' : ''}`} />
          Launch Origin VR World
        </Button>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="bg-black bg-opacity-40 border-halo-accent border-opacity-20">
          <CardHeader className="pb-2">
            <CardTitle className="text-halo-accent flex items-center text-sm">
              <Gamepad2 className="w-4 h-4 mr-2" />
              VR Mode
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Switch 
                checked={vrMode} 
                onCheckedChange={setVrMode}
                className={vrMode ? 'data-[state=checked]:bg-blue-500' : ''}
              />
              <span className={`text-sm ${vrMode ? 'text-blue-400' : 'text-gray-400'}`}>
                {vrMode ? 'ON' : 'OFF'}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black bg-opacity-40 border-halo-accent border-opacity-20">
          <CardHeader className="pb-2">
            <CardTitle className="text-halo-accent flex items-center text-sm">
              <Wifi className="w-4 h-4 mr-2" />
              Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Badge variant="outline" className="border-green-500 text-green-400 bg-green-500 bg-opacity-20">
              Connected (Wi-Fi)
            </Badge>
          </CardContent>
        </Card>

        <Card className="bg-black bg-opacity-40 border-halo-accent border-opacity-20">
          <CardHeader className="pb-2">
            <CardTitle className="text-halo-accent flex items-center text-sm">
              <Monitor className="w-4 h-4 mr-2" />
              IP Address
            </CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-white font-mono text-sm">192.168.0.105</span>
          </CardContent>
        </Card>

        <Card className="bg-black bg-opacity-40 border-halo-accent border-opacity-20">
          <CardHeader className="pb-2">
            <CardTitle className="text-halo-accent flex items-center text-sm">
              <Zap className="w-4 h-4 mr-2" />
              Integration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-white text-sm">Unity Streaming</span>
          </CardContent>
        </Card>
      </div>

      {/* Quest Device Image */}
      <div className="flex justify-center py-8">
        <img 
          src="/lovable-uploads/0c8c8ba3-96c7-4b35-8f49-b998f8f928de.png" 
          alt="Meta Quest Headset" 
          className="w-80 h-auto opacity-80"
        />
      </div>

      {/* Tools Section */}
      <Card className="bg-black bg-opacity-40 border-halo-accent border-opacity-20">
        <CardHeader>
          <CardTitle className="text-halo-accent flex items-center">
            <Settings className="w-5 h-5 mr-2" />
            Tools
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Button 
              variant="outline" 
              className="border-blue-500 text-blue-400 hover:bg-blue-500 hover:bg-opacity-20"
            >
              <Target className="w-4 h-4 mr-2" />
              Calibrate Body
            </Button>
            <Button 
              variant="outline" 
              className="border-halo-accent text-halo-accent hover:bg-halo-accent hover:bg-opacity-20"
            >
              <Play className="w-4 h-4 mr-2" />
              Test Movement
            </Button>
            <Button 
              variant="outline" 
              className="border-halo-accent text-halo-accent hover:bg-halo-accent hover:bg-opacity-20"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset Pose
            </Button>
            <Button 
              variant="outline" 
              className="border-yellow-500 text-yellow-400 hover:bg-yellow-500 hover:bg-opacity-20"
            >
              <Zap className="w-4 h-4 mr-2" />
              HALO Warp Mode
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Coming Soon Section */}
      <Card className="bg-black bg-opacity-40 border-halo-accent border-opacity-20">
        <CardHeader>
          <CardTitle className="text-halo-accent">Coming Soon</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center space-x-3 text-gray-400">
            <Monitor className="w-4 h-4" />
            <span>Mirror VR feed</span>
          </div>
          <div className="flex items-center space-x-3 text-gray-400">
            <Target className="w-4 h-4" />
            <span>Quest game overlay config</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
