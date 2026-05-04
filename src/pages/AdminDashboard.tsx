import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { Users, Activity, Flag, ShieldAlert, Sparkles } from 'lucide-react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';

export function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    fetch('/api/stats').then(r => r.json()).then(setStats);
  }, []);

  if (!stats) return (
    <div className="flex h-[50vh] items-center justify-center">
      <div className="flex flex-col items-center space-y-4 text-zinc-500">
        <Sparkles className="w-8 h-8 animate-pulse text-indigo-500" />
        <p className="animate-pulse">Loading dashboard...</p>
      </div>
    </div>
  );

  const pieData = [
    { name: 'Genuine', value: stats.realCount, color: '#10b981' },
    { name: 'Suspicious', value: stats.fakeCount, color: '#ef4444' }
  ];

  return (
    <div className="relative space-y-8 animate-in fade-in duration-500 pb-10">
      
      <div>
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-white tracking-tight transition-colors duration-500">Project Dashboard</h1>
        <p className="text-zinc-600 dark:text-zinc-500 mt-2 transition-colors duration-500">Overall analytics and model performance metrics.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <KpiCard title="Total Reviews Scanned" value={stats.totalAnalyzed} icon={Activity} />
        <KpiCard title="Fake Reviews Blocked" value={stats.fakeCount} icon={ShieldAlert} valueColor="text-red-400" />
        <KpiCard title="Model Accuracy" value={stats.accuracy * 100} format="percent" icon={Flag} valueColor="text-emerald-400" />
        <KpiCard title="Active Users" value={1204} icon={Users} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="col-span-1 lg:col-span-2 border-zinc-200 dark:border-white/5 bg-white/50 dark:bg-zinc-950/50 backdrop-blur-md shadow-xl transition-all duration-500 hover:bg-white/80 dark:hover:bg-zinc-950/80">
          <CardHeader>
            <CardTitle className="text-zinc-900 dark:text-white transition-colors duration-500">Analysis Trends (Past 7 Days)</CardTitle>
            <CardDescription className="text-zinc-500 dark:text-zinc-400 transition-colors duration-500">Daily volume of scanned reviews by classification.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats.trends} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorReal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorFake" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="date" stroke="#52525b" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#52525b" fontSize={12} tickLine={false} axisLine={false} />
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#27272a" />
                  <Tooltip content={<CustomAreaTooltip />} />
                  <Area type="monotone" dataKey="real" stroke="#10b981" fillOpacity={1} fill="url(#colorReal)" strokeWidth={2} />
                  <Area type="monotone" dataKey="fake" stroke="#ef4444" fillOpacity={1} fill="url(#colorFake)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="border-zinc-200 dark:border-white/5 bg-white/50 dark:bg-zinc-950/50 backdrop-blur-md shadow-xl transition-all duration-500 hover:bg-white/80 dark:hover:bg-zinc-950/80">
          <CardHeader>
            <CardTitle className="text-zinc-900 dark:text-white transition-colors duration-500">Distribution</CardTitle>
            <CardDescription className="text-zinc-500 dark:text-zinc-400 transition-colors duration-500">Overall classification breakdown.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[240px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={85}
                    paddingAngle={8}
                    dataKey="value"
                    stroke="none"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomPieTooltip />} />
                  <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: '12px', color: '#a1a1aa' }}/>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-6 pt-6 border-t border-zinc-200 dark:border-white/5 transition-colors duration-500">
              <h4 className="text-sm font-semibold mb-3 text-zinc-900 dark:text-white transition-colors duration-500">Top Suspicious Keywords</h4>
              <ul className="space-y-3">
                {stats.topKeywords.map((kw: any, i: number) => (
                  <li key={i} className="flex justify-between items-center text-sm">
                    <span className="text-zinc-600 dark:text-zinc-400 capitalize flex items-center transition-colors duration-500">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mr-2"></span>
                      {kw.word}
                    </span>
                    <span className="font-mono font-medium text-zinc-900 dark:text-white bg-zinc-100 dark:bg-white/5 px-2 py-0.5 rounded-md border border-zinc-200 dark:border-white/10 transition-colors duration-500">{kw.count}</span>
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function KpiCard({ title, value, format = 'number', icon: Icon, valueColor = "text-zinc-900 dark:text-white" }: any) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, latest => {
    if (format === 'percent') {
      return latest.toFixed(1) + '%';
    }
    return Math.floor(latest).toLocaleString();
  });

  useEffect(() => {
    const controls = animate(count, value, { duration: 1.5, ease: "easeOut" });
    return controls.stop;
  }, [value]);

  return (
    <Card className="border-zinc-200 dark:border-white/5 bg-white/50 dark:bg-zinc-950/50 backdrop-blur-md shadow-lg hover:shadow-indigo-500/10 transition-all duration-500 hover:bg-white/80 dark:hover:bg-zinc-900/80 group">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500 group-hover:text-zinc-600 dark:group-hover:text-zinc-400 transition-colors duration-500">{title}</p>
          <div className="p-2 rounded-lg bg-zinc-100 dark:bg-white/5 text-zinc-500 dark:text-zinc-400 group-hover:text-indigo-500 dark:group-hover:text-indigo-400 group-hover:bg-indigo-100 dark:group-hover:bg-indigo-500/10 transition-colors duration-500">
            <Icon className="h-4 w-4" />
          </div>
        </div>
        <motion.div className={`text-3xl font-bold font-mono tracking-tight transition-colors duration-500 ${valueColor}`}>{rounded}</motion.div>
      </CardContent>
    </Card>
  );
}

function CustomAreaTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/90 dark:bg-zinc-950/80 backdrop-blur-xl border border-zinc-200 dark:border-white/10 p-4 rounded-xl shadow-2xl transition-colors duration-300">
        <p className="text-zinc-900 dark:text-white font-medium mb-3 text-sm transition-colors duration-300">{label}</p>
        <div className="space-y-2">
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center justify-between gap-6 text-sm">
              <span className="flex items-center text-zinc-600 dark:text-zinc-400 capitalize transition-colors duration-300">
                <span className="w-2.5 h-2.5 rounded-full mr-2 shadow-[0_0_8px_currentColor]" style={{ color: entry.color, backgroundColor: entry.color }}></span>
                {entry.name === 'real' ? 'Genuine' : 'Suspicious'}
              </span>
              <span className="font-mono text-zinc-900 dark:text-white font-medium bg-zinc-100 dark:bg-white/5 px-2 py-0.5 rounded-md border border-zinc-200 dark:border-white/5 transition-colors duration-300">{entry.value}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
}

function CustomPieTooltip({ active, payload }: any) {
  if (active && payload && payload.length) {
    const data = payload[0];
    return (
      <div className="bg-white/90 dark:bg-zinc-950/80 backdrop-blur-xl border border-zinc-200 dark:border-white/10 p-3 rounded-xl shadow-2xl transition-colors duration-300">
        <div className="flex items-center justify-between gap-4 text-sm">
          <span className="flex items-center text-zinc-600 dark:text-zinc-400 capitalize transition-colors duration-300">
            <span className="w-2.5 h-2.5 rounded-full mr-2 shadow-[0_0_8px_currentColor]" style={{ color: data.payload.color, backgroundColor: data.payload.color }}></span>
            {data.name}
          </span>
          <span className="font-mono text-zinc-900 dark:text-white font-medium bg-zinc-100 dark:bg-white/5 px-2 py-0.5 rounded-md border border-zinc-200 dark:border-white/5 transition-colors duration-300">{data.value}</span>
        </div>
      </div>
    );
  }
  return null;
}
