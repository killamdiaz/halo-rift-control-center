import React, { useState, useEffect } from "react";
// ────────────────────────────────────────────────────────────
// Simple global cache so every StatsPanel instance can share
// the latest info for each HALO device type without overwriting
// each other when multiple devices are live.
// We hang it on `window` so React fast‑refresh and page reloads
// don’t wipe it during the session.
// ────────────────────────────────────────────────────────────
const globalDeviceStats: Record<string, any> =
  typeof window !== "undefined"
    ? ((window as any).__haloGlobalStatsStore ||= {})
    : {};

import {
  Activity,
  Battery,
  Cpu,
  Zap,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  ArrowUp,
  ArrowDown,
  Footprints,
  Target,
  Wifi,
  Thermometer,
  Signal,
  Timer,
  Headphones,
  Eye,
  Power,
  ShirtIcon,
} from "lucide-react";

import { Progress } from "@/components/ui/progress";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface StatsPanelProps {
  deviceType: string;
  selectedBelt?: {
    id: string;
    battery: number;
    role: string;
    status: string;
  } | null;
}

const StatsPanel: React.FC<StatsPanelProps> = ({ deviceType, selectedBelt: selectedBeltProp }) => {
  /* ──────────────────────────────────────────────────────────
   * STATE + MOCK DATA (Quest specific + latency)
   * ──────────────────────────────────────────────────────────*/
  const [vrMode, setVrMode] = useState(true);
  const [passthroughActive, setPassthroughActive] = useState(false);

  const cpuData = [
    { time: "1", value: 45 },
    { time: "2", value: 52 },
    { time: "3", value: 48 },
    { time: "4", value: 61 },
    { time: "5", value: 55 },
    { time: "6", value: 67 },
  ];

  const gpuData = [
    { time: "1", value: 30 },
    { time: "2", value: 45 },
    { time: "3", value: 38 },
    { time: "4", value: 52 },
    { time: "5", value: 48 },
    { time: "6", value: 58 },
  ];

  const [latencyData, setLatencyData] = useState(() =>
    Array.from({ length: 30 }, (_, i) => ({ time: i, latency: 15 + Math.random() * 10 }))
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setLatencyData((prev) => {
        const newData = [...prev.slice(1)];
        newData.push({ time: prev[prev.length - 1].time + 1, latency: 15 + Math.random() * 10 });
        return newData;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  /* ──────────────────────────────────────────────────────────
   * IPC / CACHED LIVE STATS
   * ──────────────────────────────────────────────────────────*/
  const [liveStats, setLiveStats] = useState<any>(() => {
    if (globalDeviceStats[deviceType]) return globalDeviceStats[deviceType];
    const saved = localStorage.getItem(`halo-liveStats-${deviceType}`);
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    const handler = (_e: any, updated: any) => {
      if (updated?.type) globalDeviceStats[updated.type] = updated;
      if (updated?.type === deviceType || updated?.name?.toLowerCase().includes(deviceType)) {
        setLiveStats(updated);
      }
    };
    const listHandler = (_e: any, devices: any[]) => {
      if (!Array.isArray(devices)) return;
      devices.forEach((d) => (d?.type ? (globalDeviceStats[d.type] = { ...(globalDeviceStats[d.type] || {}), ...d }) : null));
      const match = devices.find((d) => d?.type === deviceType || d?.name?.toLowerCase().includes(deviceType));
      if (match) setLiveStats((prev) => ({ ...(prev || {}), ...match }));
    };
    window.electron?.ipcRenderer?.on?.("device-status-update", handler);
    window.electron?.ipcRenderer?.on?.("update-connection-status", listHandler);
    return () => {
      const ipc: any = window.electron?.ipcRenderer || {};
      ipc.removeListener?.("device-status-update", handler);
      ipc.removeListener?.("update-connection-status", listHandler);
    };
  }, [deviceType]);

  useEffect(() => {
    if (liveStats) {
      globalDeviceStats[deviceType] = liveStats;
      localStorage.setItem(`halo-liveStats-${deviceType}`, JSON.stringify(liveStats));
    }
  }, [liveStats, deviceType]);

  /* ──────────────────────────────────────────────────────────
   * COMPOSED STATS OBJECT
   * ──────────────────────────────────────────────────────────*/
  const getDeviceStats = () => {
    switch (deviceType) {
      case "quest":
        return {
          battery: liveStats?.battery ?? 68,
          temperature: liveStats?.temperature ?? 42,
          connectivity: "Wi‑Fi",
          status: vrMode ? "VR Mode Active" : "Standby",
          performance: {
            frameRate: "90 FPS",
            latency: "18 ms",
            resolution: "2160×2160",
          },
        };
      case "shoe":
        return {
          battery: liveStats?.battery ?? 0,
          status: liveStats?.isConnected && liveStats?.name?.toLowerCase().includes("shoe") ? "Connected" : "Disconnected",
          temperature: liveStats?.temperature ?? 30,
          pressure: liveStats?.pressure ?? "12.5 PSI",
          steps: liveStats?.steps ?? 0,
          distance: liveStats?.distance ?? "0.0 km",
          jitter: liveStats?.jitter ?? 2.3,
          upload: liveStats?.upload ?? 24.5,
          download: liveStats?.download ?? 156.8,
        };
      case "gun":
        return {
          battery: liveStats?.battery ?? 0,
          temperature: liveStats?.temperature ?? 30,
          status: liveStats?.isConnected && liveStats?.name?.toLowerCase().includes("gun") ? "Connected" : "Disconnected",
          accuracy: liveStats?.accuracy ?? "92%",
          shots: liveStats?.shots ?? 1289,
          mode: liveStats?.mode ?? "Burst",
          jitter: liveStats?.jitter ?? 2.3,
          upload: liveStats?.upload ?? 24.5,
          download: liveStats?.download ?? 156.8,
        };
      case "suit":
        return {
          battery: liveStats?.battery ?? 0,
          status: liveStats?.isConnected && liveStats?.name?.toLowerCase().includes("suit") ? "Connected" : "Disconnected",
          temperature: liveStats?.temperature ?? 36,
          coverage: liveStats?.coverage ?? "Upper Body",
          impacts: liveStats?.impacts ?? 34,
          zones: liveStats?.zones ?? "Chest, Arms, Shoulders",
          jitter: liveStats?.jitter ?? 2.3,
          upload: liveStats?.upload ?? 24.5,
          download: liveStats?.download ?? 156.8,
        };
      default:
        return { battery: 0, status: "Disconnected", temperature: 0 };
    }
  };

  const stats = getDeviceStats();
  const selectedBelt = selectedBeltProp;
  const deviceName = deviceType.charAt(0).toUpperCase() + deviceType.slice(1);
  const currentLatency = latencyData[latencyData.length - 1]?.latency || 0;

  /* ──────────────────────────────────────────────────────────
   * QUEST PANEL (defined separately for clarity)
   * ──────────────────────────────────────────────────────────*/
  const renderQuestPanel = () => (
    <div className="space-y-6">
      {/* VR Mode Toggle */}
      <Card className="bg-black bg-opacity-40 border-halo-accent border-opacity-20">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm text-gray-400 uppercase tracking-wide flex items-center justify-between">
            VR Mode
            <Switch checked={vrMode} onCheckedChange={setVrMode} />
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className={`text-lg font-medium ${vrMode ? "text-blue-400" : "text-gray-400"}`}>{vrMode ? "Active" : "Standby"}</div>
          {vrMode && (
            <div className="mt-2 flex items-center space-x-1">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
              <span className="text-xs text-blue-400">Live Session</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Status & Network */}
      <Card className="bg-black bg-opacity-40 border-halo-accent border-opacity-20">
        <CardContent className="p-4 space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Status</span>
            <span className="text-green-400 flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              <span>Connected</span>
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">IP Address</span>
            <span className="font-mono">192.168.0.105</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Integration</span>
            <span className="text-halo-accent">Unity Streaming</span>
          </div>
        </CardContent>
      </Card>

      {/* Passthrough */}
      <Card className="bg-black bg-opacity-40 border-halo-accent border-opacity-20">
        <CardContent className="p-4">
          <Button
            onClick={() => setPassthroughActive(!passthroughActive)}
            className={`w-full ${
              passthroughActive ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-700 hover:bg-gray-600"
            }`}
          >
            <Eye className="w-4 h-4 mr-2" /> {passthroughActive ? "Stop Passthrough" : "Passthrough View"}
          </Button>
          {passthroughActive && (
            <div className="mt-3 p-3 bg-blue-500 bg-opacity-20 rounded border border-blue-500 border-opacity-30 flex items-center space-x-2 text-xs text-blue-400">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
              <span>Live Feed Active</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* CPU & GPU Charts */}
      <div className="grid grid-cols-1 gap-4">
        {[
          { title: "CPU Usage", color: "#f97316", data: cpuData, pct: "67%", textClr: "text-orange-400" },
          { title: "GPU Usage", color: "#22c55e", data: gpuData, pct: "58%", textClr: "text-green-400" },
        ].map(({ title, color, data, pct, textClr }) => (
          <Card key={title} className="bg-black bg-opacity-40 border-halo-accent border-opacity-20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-400 uppercase tracking-wide">{title}</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex justify-between mb-2 items-end">
                <span className={`text-2xl font-bold ${textClr}`}>{pct}</span>
                <span className="text-xs text-gray-400">Real-time</span>
              </div>
              <div className="h-16">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data}>
                    <defs>
                      <linearGradient id={`${title}-grad`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                        <stop offset="95%" stopColor={color} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <Area type="monotone" dataKey="value" stroke={color} strokeWidth={2} fill={`url(#${title}-grad)`} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Battery & Temp */}
      <div className="grid grid-cols-2 gap-4">
        {[
          { label: "Battery", value: `${stats.battery}%`, clr: "text-halo-accent" },
          { label: "Temp", value: `${stats.temperature}°C`, clr: "text-yellow-400" },
        ].map(({ label, value, clr }) => (
          <Card key={label} className="bg-black bg-opacity-40 border-halo-accent border-opacity-20 text-center">
            <CardContent className="p-4">
              <div className="text-sm text-gray-400 uppercase tracking-wide mb-1">{label}</div>
              <div className={`text-xl font-bold ${clr}`}>{value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quest Performance */}
      {stats.performance && (
        <Card className="bg-black bg-opacity-40 border-halo-accent border-opacity-20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-400 uppercase tracking-wide">Performance</CardTitle>
          </CardHeader>
          <CardContent className="pt-0 space-y-2 text-sm">
            {Object.entries(stats.performance).map(([k, v]) => (
              <div key={k} className="flex justify-between">
                <span className="capitalize text-gray-300">{k.replace(/([A-Z])/g, " $1")}</span>
                <span className="text-white font-medium">{v}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );

  /* ──────────────────────────────────────────────────────────
   * BELT PANEL (reuse from previous)
   * ──────────────────────────────────────────────────────────*/
  const renderBeltStats = () => {
    if (!selectedBelt) return <div className="text-center text-gray-400 py-8">No belt selected</div>;
    return (
      <div className="space-y-4">
        {/* Belt Info */}
        <Card className="bg-black bg-opacity-40 border-halo-accent border-opacity-20">
          <CardHeader className="pb-3">
            <CardTitle className="text-halo-accent flex items-center text-sm">
              <Cpu className="w-4 h-4 mr-2" /> Belt Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-300">Belt ID</span>
              <span className="font-mono text-white">{selectedBelt.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">Assigned Role</span>
              <Badge variant="outline" className="border-halo-accent text-halo-accent">
                {selectedBelt.role}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">Status</span>
              <span className={selectedBelt.status === "Connected" ? "text-green-400" : "text-orange-400"}>{selectedBelt.status}</span>
            </div>
          </CardContent>
        </Card>

        {/* Battery */}
        <Card className="bg-black bg-opacity-40 border-halo-accent border-opacity-20">
          <CardHeader className="pb-3">
            <CardTitle className="text-halo-accent flex items-center text-sm">
              <Battery className="w-4 h-4 mr-2" /> Power Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-300">Battery Level</span>
              <span className="text-white">{selectedBelt.battery}%</span>
            </div>
            <Progress value={selectedBelt.battery} className="h-2" />
            <div className="flex justify-between">
              <span className="text-gray-300">Estimated runtime</span>
              <span className="text-white">
                {selectedBelt.battery > 50 ? "8-12 hrs" : selectedBelt.battery > 20 ? "3-6 hrs" : "<2 hrs"}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Sensor Status */}
        <Card className="bg-black bg-opacity-40 border-halo-accent border-opacity-20">
          <CardHeader className="pb-3">
            <CardTitle className="text-halo-accent flex items-center text-sm">
              <Activity className="w-4 h-4 mr-2" /> Sensor Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            {[
              ["IMU Sensor", "Active"],
              ["Vibration Motor", "Ready"],
              ["Temperature", "36°C"],
            ].map(([label, value]) => (
              <div key={label} className="flex justify-between">
                <span className="text-gray-300">{label}</span>
                <span className="text-white">{value}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Connection */}
        <Card className="bg-black bg-opacity-40 border-halo-accent border-opacity-20">
          <CardHeader className="pb-3">
            <CardTitle className="text-halo-accent flex items-center text-sm">
              <Wifi className="w-4 h-4 mr-2" /> Connection
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-300">Signal</span>
              <span className="flex items-center space-x-2 text-white">
                <Signal className="w-4 h-4 text-green-400" /> <span>Strong</span>
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">Latency</span>
              <span className="text-white">12 ms</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">Last Sync</span>
              <span className="text-white">Just now</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  /* ──────────────────────────────────────────────────────────
   * TEMPERATURE UTILITIES
   * ──────────────────────────────────────────────────────────*/
  const getTemperatureColor = (t: number) => (t <= 30 ? "from-blue-500 to-green-500" : t <= 35 ? "from-yellow-400 to-yellow-500" : "from-orange-500 to-red-500");
  const getTemperatureProgress = (t: number) => Math.min(100, Math.max(0, ((t - 20) / 20) * 100));

  /* ──────────────────────────────────────────────────────────
   * MAIN RENDER LOGIC
   * ──────────────────────────────────────────────────────────*/
  if (deviceType === "belt") {
    return (
      <aside className="w-80 bg-black bg-opacity-40 backdrop-blur-lg border-l border-halo-accent border-opacity-20 p-6 overflow-y-auto">
        <h2 className="text-lg font-semibold text-white mb-4">HALO SENSOR BELT</h2>
        {renderBeltStats()}
      </aside>
    );
  }

  if (deviceType === "quest") {
    return (
      <aside className="w-80 bg-black bg-opacity-40 backdrop-blur-lg border-l border-halo-accent border-opacity-20 p-6 overflow-y-auto">
        <div className="flex items-center space-x-3 mb-6">
          <Headphones className="w-5 h-5 text-halo-accent" />
          <h2 className="text-xl font-semibold">Meta Quest</h2>
        </div>
        {renderQuestPanel()}
      </aside>
    );
  }

  /* Default: shoe / gun / suit */
  return (
    <aside className="w-80 bg-black bg-opacity-40 backdrop-blur-lg border-l border-halo-accent border-opacity-20 flex-shrink-0">
      <div className="p-6 h-full overflow-y-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-lg font-bold text-halo-accent mb-2">HALO {deviceName.toUpperCase()}</h2>
          <div
            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
              stats.status === "Connected" || stats.status === "Ready"
                ? "bg-green-500 bg-opacity-20 text-green-400 border border-green-500 border-opacity-30"
                : stats.status === "Low Battery"
                ? "bg-orange-500 bg-opacity-20 text-orange-400 border border-orange-500 border-opacity-30"
                : "bg-red-500 bg-opacity-20 text-red-400 border border-red-500 border-opacity-30"
            }`}
          >
            {stats.status === "Connected" || stats.status === "Ready" ? <CheckCircle2 className="w-3 h-3 mr-1" /> : <AlertTriangle className="w-3 h-3 mr-1" />}
            {stats.status}
          </div>
        </div>

        {stats.status === "Connected" && (
          <>
            {/* Battery */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <Battery className="w-4 h-4 text-halo-accent" />
                  <span className="text-sm text-white">Battery</span>
                </div>
                <span className="text-sm text-halo-accent font-medium">{stats.battery}%</span>
              </div>
              <Progress value={stats.battery} className="h-2" />
            </div>

            {/* Temperature */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <Cpu className="w-4 h-4 text-halo-accent" />
                  <span className="text-sm text-white">Temperature</span>
                </div>
                <span className="text-sm text-white">{stats.temperature}°C</span>
              </div>
              <div className="relative h-2 bg-black bg-opacity-30 rounded-full overflow-hidden">
                <div
                  className={`h-full bg-gradient-to-r ${getTemperatureColor(stats.temperature)} transition-all duration-500`}
                  style={{ width: `${getTemperatureProgress(stats.temperature)}%` }}
                />
              </div>
            </div>

            {/* Latency Graph */}
            <div className="p-3 rounded-lg bg-black bg-opacity-30 border border-halo-accent border-opacity-20">
              <div className="flex justify-between mb-2 text-sm text-white">
                <span>Latency</span>
                <span className="text-halo-accent font-medium">{currentLatency.toFixed(1)} ms</span>
              </div>
              <div className="h-16 mb-2">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={latencyData}>
                    <XAxis dataKey="time" hide />
                    <YAxis hide domain={["dataMin - 2", "dataMax + 2"]} />
                    <Line type="monotone" dataKey="latency" stroke="#00ccff" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="text-xs text-white opacity-70">Jitter: {stats.jitter} ms</div>
            </div>

            {/* Network Stats */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: ArrowUp, label: "Mbps Up", value: stats.upload },
                { icon: ArrowDown, label: "Mbps Down", value: stats.download },
              ].map(({ icon: Icon, label, value }) => (
                <div
                  key={label}
                  className="p-3 text-center rounded-lg bg-black bg-opacity-30 border border-halo-accent border-opacity-20"
                >
                  <div className="flex justify-center mb-1">
                    <Icon className="w-3 h-3 text-halo-accent mr-1" />
                  </div>
                  <div className="text-lg font-bold text-halo-accent">{value}</div>
                  <div className="text-xs text-white opacity-70">{label}</div>
                </div>
              ))}
            </div>

            {/* Device-specific blocks */}
            {deviceType === "shoe" && (
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 text-center rounded-lg bg-black bg-opacity-30 border border-halo-accent border-opacity-20">
                  <div className="text-lg font-bold text-halo-accent">{stats.steps}</div>
                  <div className="text-xs text-white opacity-70">Steps</div>
                </div>
                <div className="p-3 text-center rounded-lg bg-black bg-opacity-30 border border-halo-accent border-opacity-20">
                  <div className="text-lg font-bold text-halo-accent">{stats.distance}</div>
                  <div className="text-xs text-white opacity-70">Distance</div>
                </div>
              </div>
            )}

            {deviceType === "gun" && (
              <>
                <div className="flex justify-between p-3 rounded-lg bg-black bg-opacity-30 border border-halo-accent border-opacity-20 text-sm text-white">
                  <span className="flex items-center space-x-2">
                    <TrendingUp className="w-4 h-4 text-halo-accent" /> <span>Accuracy</span>
                  </span>
                  <span>{stats.accuracy}</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 text-center rounded-lg bg-black bg-opacity-30 border border-halo-accent border-opacity-20">
                    <div className="text-lg font-bold text-halo-accent">{stats.shots}</div>
                    <div className="text-xs text-white opacity-70">Shots</div>
                  </div>
                  <div className="p-3 text-center rounded-lg bg-black bg-opacity-30 border border-halo-accent border-opacity-20">
                    <div className="text-lg font-bold text-halo-accent">{stats.mode}</div>
                    <div className="text-xs text-white opacity-70">Mode</div>
                  </div>
                </div>
              </>
            )}

            {deviceType === "suit" && (
              <>
                <div className="flex justify-between p-3 rounded-lg bg-black bg-opacity-30 border border-halo-accent border-opacity-20 text-sm text-white">
                  <span className="flex items-center space-x-2">
                    <Zap className="w-4 h-4 text-halo-accent" /> <span>Coverage</span>
                  </span>
                  <span>{stats.coverage}</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 text-center rounded-lg bg-black bg-opacity-30 border border-halo-accent border-opacity-20">
                    <div className="text-lg font-bold text-halo-accent">{stats.impacts}</div>
                    <div className="text-xs text-white opacity-70">Impacts</div>
                  </div>
                  <div className="p-3 text-center rounded-lg bg-black bg-opacity-30 border border-halo-accent border-opacity-20">
                    <div className="text-lg font-bold text-halo-accent">{stats.zones}</div>
                    <div className="text-xs text-white opacity-70">Zones</div>
                  </div>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </aside>
  );
};

export default StatsPanel;
