
import React, { useState } from 'react';
import { Clock, BarChart4, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer } from 'recharts';

interface SessionData {
  time: string;
  latency: number;
  duration: number;
}

const UsageHistoryPanel: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<'today' | 'week' | 'month'>('today');

  // Mock session data
  const sessionData: SessionData[] = [
    { time: '09:00', latency: 12, duration: 45 },
    { time: '10:30', latency: 15, duration: 30 },
    { time: '14:00', latency: 8, duration: 120 },
    { time: '16:45', latency: 22, duration: 60 },
    { time: '19:20', latency: 11, duration: 90 },
    { time: '21:00', latency: 18, duration: 75 }
  ];

  const stats = {
    today: {
      totalTime: '6h 30m',
      avgSession: '68 min',
      peakLatency: '22ms',
      sessions: 6
    },
    week: {
      totalTime: '42h 15m',
      avgSession: '71 min',
      peakLatency: '35ms',
      sessions: 28
    },
    month: {
      totalTime: '186h 45m',
      avgSession: '69 min',
      peakLatency: '45ms',
      sessions: 124
    }
  };

  const currentStats = stats[selectedPeriod];

  const chartConfig = {
    latency: {
      label: 'Latency (ms)',
      color: '#00ccff',
    },
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-halo-accent flex items-center">
          <Clock className="w-5 h-5 mr-2" />
          Usage History & Analytics
        </h3>
        
        <div className="flex space-x-2">
          {(['today', 'week', 'month'] as const).map(period => (
            <button
              key={period}
              onClick={() => setSelectedPeriod(period)}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                selectedPeriod === period
                  ? 'bg-halo-accent text-black'
                  : 'bg-black bg-opacity-40 text-white hover:bg-halo-accent hover:bg-opacity-20'
              }`}
            >
              {period.charAt(0).toUpperCase() + period.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-black bg-opacity-40 border-halo-accent border-opacity-20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-400">Total Play Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-halo-accent">{currentStats.totalTime}</div>
          </CardContent>
        </Card>
        
        <Card className="bg-black bg-opacity-40 border-halo-accent border-opacity-20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-400">Avg Session</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{currentStats.avgSession}</div>
          </CardContent>
        </Card>
        
        <Card className="bg-black bg-opacity-40 border-halo-accent border-opacity-20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-400">Peak Latency</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-400">{currentStats.peakLatency}</div>
          </CardContent>
        </Card>
        
        <Card className="bg-black bg-opacity-40 border-halo-accent border-opacity-20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-400">Sessions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-400">{currentStats.sessions}</div>
          </CardContent>
        </Card>
      </div>

      {/* Session Chart */}
      <Card className="bg-black bg-opacity-40 border-halo-accent border-opacity-20">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <BarChart4 className="w-5 h-5 mr-2" />
            Session Latency Over Time
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={sessionData}>
                <defs>
                  <linearGradient id="latencyGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00ccff" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#00ccff" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="time" 
                  stroke="#666"
                  fontSize={12}
                />
                <YAxis 
                  stroke="#666"
                  fontSize={12}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area
                  type="monotone"
                  dataKey="latency"
                  stroke="#00ccff"
                  strokeWidth={2}
                  fill="url(#latencyGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default UsageHistoryPanel;
