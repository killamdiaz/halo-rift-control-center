
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Radio, 
  Footprints, 
  Target, 
  ShirtIcon,
  Activity,
  Zap,
  Eye,
  Clock
} from 'lucide-react';

const LiveTelemetryDashboard = () => {
  const [telemetryData, setTelemetryData] = useState({
    leftShoe: {
      connected: true,
      lastPacket: 42,
      imu: { roll: 0, pitch: 0, yaw: 0 },
      fsr: { toe: 0, heel: 0 },
      state: 'Standing Still'
    },
    rightShoe: {
      connected: true,
      lastPacket: 38,
      imu: { roll: 0, pitch: 0, yaw: 0 },
      fsr: { toe: 0, heel: 0 },
      state: 'Standing Still'
    },
    gun: {
      connected: true,
      lastPacket: 25,
      triggerPressure: 0,
      state: 'Idle'
    },
    suit: {
      connected: false,
      lastPacket: 1240,
      imu: { roll: 0, pitch: 0, yaw: 0 },
      vibrationZones: {
        chestL: false,
        chestR: false,
        armL: false,
        armR: false,
        legL: false,
        legR: false,
        shoulderL: false,
        shoulderR: false,
        stomach: false
      }
    }
  });

  // Simulate live data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setTelemetryData(prev => ({
        leftShoe: {
          ...prev.leftShoe,
          lastPacket: Math.floor(Math.random() * 100) + 20,
          imu: {
            roll: (Math.random() - 0.5) * 180,
            pitch: (Math.random() - 0.5) * 180,
            yaw: (Math.random() - 0.5) * 180
          },
          fsr: {
            toe: Math.random() * 100,
            heel: Math.random() * 100
          },
          state: Math.random() > 0.7 ? '🦶 Step Detected' : 'Standing Still'
        },
        rightShoe: {
          ...prev.rightShoe,
          lastPacket: Math.floor(Math.random() * 100) + 20,
          imu: {
            roll: (Math.random() - 0.5) * 180,
            pitch: (Math.random() - 0.5) * 180,
            yaw: (Math.random() - 0.5) * 180
          },
          fsr: {
            toe: Math.random() * 100,
            heel: Math.random() * 100
          },
          state: Math.random() > 0.7 ? '🦶 Step Detected' : 'Standing Still'
        },
        gun: {
          ...prev.gun,
          lastPacket: Math.floor(Math.random() * 50) + 15,
          triggerPressure: Math.random() * 100,
          state: Math.random() > 0.8 ? '🔫 Trigger Pulled' : 'Idle'
        },
        suit: {
          ...prev.suit,
          lastPacket: prev.suit.connected ? Math.floor(Math.random() * 100) + 20 : prev.suit.lastPacket + 100,
          imu: {
            roll: (Math.random() - 0.5) * 180,
            pitch: (Math.random() - 0.5) * 180,
            yaw: (Math.random() - 0.5) * 180
          },
          vibrationZones: {
            chestL: Math.random() > 0.8,
            chestR: Math.random() > 0.8,
            armL: Math.random() > 0.9,
            armR: Math.random() > 0.9,
            legL: Math.random() > 0.85,
            legR: Math.random() > 0.85,
            shoulderL: Math.random() > 0.9,
            shoulderR: Math.random() > 0.9,
            stomach: Math.random() > 0.95
          }
        }
      }));
    }, 250);

    return () => clearInterval(interval);
  }, []);

  const VibrationZone = ({ name, active }: { name: string; active: boolean }) => (
    <div className={`px-2 py-1 rounded text-xs border transition-all duration-200 ${
      active 
        ? 'bg-halo-accent bg-opacity-30 border-halo-accent text-halo-accent animate-pulse' 
        : 'bg-gray-800 border-gray-600 text-gray-400'
    }`}>
      {name}
    </div>
  );

  return (
    <div className="flex-1 px-6 py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <Radio className="w-8 h-8 text-halo-accent animate-pulse" />
        <h1 className="text-3xl font-bold">Live Telemetry Dashboard</h1>
        <Badge className="bg-green-500 bg-opacity-20 text-green-400 border-green-500 border-opacity-30 animate-pulse">
          <Activity className="w-3 h-3 mr-1" />
          STREAMING
        </Badge>
      </div>

      {/* HALO Shoes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Shoe */}
        <Card className="bg-black bg-opacity-40 backdrop-blur-lg border-halo-accent border-opacity-20">
          <CardHeader className="pb-4">
            <CardTitle className="text-halo-accent flex items-center justify-between">
              <div className="flex items-center">
                <Footprints className="w-5 h-5 mr-2" />
                Left Shoe
              </div>
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${telemetryData.leftShoe.connected ? 'bg-green-500' : 'bg-red-500'}`} />
                <span className="text-xs text-gray-400">
                  <Clock className="w-3 h-3 inline mr-1" />
                  {telemetryData.leftShoe.lastPacket}ms ago
                </span>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-2 text-sm">
              <div className="bg-gray-800 bg-opacity-50 p-2 rounded">
                <div className="text-gray-400 text-xs">Roll</div>
                <div className="text-halo-accent font-mono">{telemetryData.leftShoe.imu.roll.toFixed(1)}°</div>
              </div>
              <div className="bg-gray-800 bg-opacity-50 p-2 rounded">
                <div className="text-gray-400 text-xs">Pitch</div>
                <div className="text-halo-accent font-mono">{telemetryData.leftShoe.imu.pitch.toFixed(1)}°</div>
              </div>
              <div className="bg-gray-800 bg-opacity-50 p-2 rounded">
                <div className="text-gray-400 text-xs">Yaw</div>
                <div className="text-halo-accent font-mono">{telemetryData.leftShoe.imu.yaw.toFixed(1)}°</div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-gray-800 bg-opacity-50 p-2 rounded">
                <div className="text-gray-400 text-xs">Toe Pressure</div>
                <div className="text-yellow-400 font-mono">{telemetryData.leftShoe.fsr.toe.toFixed(1)}%</div>
              </div>
              <div className="bg-gray-800 bg-opacity-50 p-2 rounded">
                <div className="text-gray-400 text-xs">Heel Pressure</div>
                <div className="text-yellow-400 font-mono">{telemetryData.leftShoe.fsr.heel.toFixed(1)}%</div>
              </div>
            </div>
            <Badge className={`${telemetryData.leftShoe.state.includes('Step') ? 'bg-green-500 bg-opacity-20 text-green-400' : 'bg-gray-500 bg-opacity-20 text-gray-400'}`}>
              {telemetryData.leftShoe.state}
            </Badge>
          </CardContent>
        </Card>

        {/* Right Shoe */}
        <Card className="bg-black bg-opacity-40 backdrop-blur-lg border-halo-accent border-opacity-20">
          <CardHeader className="pb-4">
            <CardTitle className="text-halo-accent flex items-center justify-between">
              <div className="flex items-center">
                <Footprints className="w-5 h-5 mr-2 scale-x-[-1]" />
                Right Shoe
              </div>
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${telemetryData.rightShoe.connected ? 'bg-green-500' : 'bg-red-500'}`} />
                <span className="text-xs text-gray-400">
                  <Clock className="w-3 h-3 inline mr-1" />
                  {telemetryData.rightShoe.lastPacket}ms ago
                </span>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-2 text-sm">
              <div className="bg-gray-800 bg-opacity-50 p-2 rounded">
                <div className="text-gray-400 text-xs">Roll</div>
                <div className="text-halo-accent font-mono">{telemetryData.rightShoe.imu.roll.toFixed(1)}°</div>
              </div>
              <div className="bg-gray-800 bg-opacity-50 p-2 rounded">
                <div className="text-gray-400 text-xs">Pitch</div>
                <div className="text-halo-accent font-mono">{telemetryData.rightShoe.imu.pitch.toFixed(1)}°</div>
              </div>
              <div className="bg-gray-800 bg-opacity-50 p-2 rounded">
                <div className="text-gray-400 text-xs">Yaw</div>
                <div className="text-halo-accent font-mono">{telemetryData.rightShoe.imu.yaw.toFixed(1)}°</div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-gray-800 bg-opacity-50 p-2 rounded">
                <div className="text-gray-400 text-xs">Toe Pressure</div>
                <div className="text-yellow-400 font-mono">{telemetryData.rightShoe.fsr.toe.toFixed(1)}%</div>
              </div>
              <div className="bg-gray-800 bg-opacity-50 p-2 rounded">
                <div className="text-gray-400 text-xs">Heel Pressure</div>
                <div className="text-yellow-400 font-mono">{telemetryData.rightShoe.fsr.heel.toFixed(1)}%</div>
              </div>
            </div>
            <Badge className={`${telemetryData.rightShoe.state.includes('Step') ? 'bg-green-500 bg-opacity-20 text-green-400' : 'bg-gray-500 bg-opacity-20 text-gray-400'}`}>
              {telemetryData.rightShoe.state}
            </Badge>
          </CardContent>
        </Card>
      </div>

      {/* HALO Gun & Suit */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* HALO Gun */}
        <Card className="bg-black bg-opacity-40 backdrop-blur-lg border-halo-accent border-opacity-20">
          <CardHeader className="pb-4">
            <CardTitle className="text-halo-accent flex items-center justify-between">
              <div className="flex items-center">
                <Target className="w-5 h-5 mr-2" />
                HALO Gun
              </div>
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${telemetryData.gun.connected ? 'bg-green-500' : 'bg-red-500'}`} />
                <span className="text-xs text-gray-400">
                  <Clock className="w-3 h-3 inline mr-1" />
                  {telemetryData.gun.lastPacket}ms ago
                </span>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-gray-800 bg-opacity-50 p-4 rounded">
              <div className="text-gray-400 text-sm mb-2">Trigger Pressure</div>
              <div className="text-2xl text-red-400 font-mono">{telemetryData.gun.triggerPressure.toFixed(1)}%</div>
              <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
                <div 
                  className="bg-red-500 h-2 rounded-full transition-all duration-200" 
                  style={{ width: `${telemetryData.gun.triggerPressure}%` }}
                />
              </div>
            </div>
            <Badge className={`${telemetryData.gun.state.includes('Trigger') ? 'bg-red-500 bg-opacity-20 text-red-400' : 'bg-gray-500 bg-opacity-20 text-gray-400'}`}>
              {telemetryData.gun.state}
            </Badge>
          </CardContent>
        </Card>

        {/* HALO Suit */}
        <Card className="bg-black bg-opacity-40 backdrop-blur-lg border-halo-accent border-opacity-20">
          <CardHeader className="pb-4">
            <CardTitle className="text-halo-accent flex items-center justify-between">
              <div className="flex items-center">
                <ShirtIcon className="w-5 h-5 mr-2" />
                HALO Suit
              </div>
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${telemetryData.suit.connected ? 'bg-green-500' : 'bg-red-500'}`} />
                <span className="text-xs text-gray-400">
                  <Clock className="w-3 h-3 inline mr-1" />
                  {telemetryData.suit.lastPacket}ms ago
                </span>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-2 text-sm">
              <div className="bg-gray-800 bg-opacity-50 p-2 rounded">
                <div className="text-gray-400 text-xs">Roll</div>
                <div className="text-halo-accent font-mono">{telemetryData.suit.imu.roll.toFixed(1)}°</div>
              </div>
              <div className="bg-gray-800 bg-opacity-50 p-2 rounded">
                <div className="text-gray-400 text-xs">Pitch</div>
                <div className="text-halo-accent font-mono">{telemetryData.suit.imu.pitch.toFixed(1)}°</div>
              </div>
              <div className="bg-gray-800 bg-opacity-50 p-2 rounded">
                <div className="text-gray-400 text-xs">Yaw</div>
                <div className="text-halo-accent font-mono">{telemetryData.suit.imu.yaw.toFixed(1)}°</div>
              </div>
            </div>
            <div>
              <div className="text-gray-400 text-sm mb-2 flex items-center">
                <Zap className="w-4 h-4 mr-1" />
                Active Vibration Zones
              </div>
              <div className="grid grid-cols-3 gap-2">
                <VibrationZone name="Chest L" active={telemetryData.suit.vibrationZones.chestL} />
                <VibrationZone name="Chest R" active={telemetryData.suit.vibrationZones.chestR} />
                <VibrationZone name="Stomach" active={telemetryData.suit.vibrationZones.stomach} />
                <VibrationZone name="Arm L" active={telemetryData.suit.vibrationZones.armL} />
                <VibrationZone name="Arm R" active={telemetryData.suit.vibrationZones.armR} />
                <VibrationZone name="Shoulder L" active={telemetryData.suit.vibrationZones.shoulderL} />
                <VibrationZone name="Shoulder R" active={telemetryData.suit.vibrationZones.shoulderR} />
                <VibrationZone name="Leg L" active={telemetryData.suit.vibrationZones.legL} />
                <VibrationZone name="Leg R" active={telemetryData.suit.vibrationZones.legR} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LiveTelemetryDashboard;
