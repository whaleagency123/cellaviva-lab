'use client'
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'
import { Monitor, Smartphone, Tablet } from 'lucide-react'

const TOOLTIP_STYLE = { background: '#1a1e2b', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, fontSize: 12, color: '#fff' }
const CARD = 'bg-[#13161f] border border-white/5 rounded-2xl'

const TRAFFIC_SOURCES = [
  { name: 'Organic Search', value: 38, color: '#4ade80' },
  { name: 'Direct', value: 24, color: '#60a5fa' },
  { name: 'Social Media', value: 19, color: '#a78bfa' },
  { name: 'Email', value: 12, color: '#f59e0b' },
  { name: 'Paid Ads', value: 7, color: '#f87171' },
]

const DEVICES = [
  { label: 'Mobile', pct: 62, icon: Smartphone, color: 'text-blue-400 bg-blue-500/10' },
  { label: 'Desktop', pct: 31, icon: Monitor, color: 'text-purple-400 bg-purple-500/10' },
  { label: 'Tablet', pct: 7, icon: Tablet, color: 'text-amber-400 bg-amber-500/10' },
]

interface DataPoint {
  date: string
  revenue: number
  orders: number
  sessions: number
}

export default function AnalyticsCharts({ data }: { data: DataPoint[] }) {
  return (
    <>
      {/* Revenue chart */}
      <div className={`${CARD} p-6`}>
        <h2 className="text-lg font-bold text-white mb-6">Revenue Over Time</h2>
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={data} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="aRevGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4ade80" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#4ade80" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
            <XAxis dataKey="date" tick={{ fontSize: 11, fill: 'rgba(255,255,255,0.3)' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: 'rgba(255,255,255,0.3)' }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}`} />
            <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(v: unknown) => [`$${v}`, 'Revenue']} />
            <Area type="monotone" dataKey="revenue" stroke="#4ade80" strokeWidth={2.5} fill="url(#aRevGrad)" dot={false} activeDot={{ r: 4, fill: '#4ade80' }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Orders + Sessions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className={`${CARD} p-6`}>
          <h2 className="text-lg font-bold text-white mb-6">Orders</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={data} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.3)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.3)' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={TOOLTIP_STYLE} />
              <Bar dataKey="orders" fill="#60a5fa" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className={`${CARD} p-6`}>
          <h2 className="text-lg font-bold text-white mb-6">Sessions</h2>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={data} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.3)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.3)' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={TOOLTIP_STYLE} />
              <Line type="monotone" dataKey="sessions" stroke="#a78bfa" strokeWidth={2} dot={false} activeDot={{ r: 4, fill: '#a78bfa' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Traffic + Devices */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className={`${CARD} p-6`}>
          <h2 className="text-lg font-bold text-white mb-6">Traffic Sources</h2>
          <div className="flex items-center gap-8">
            <ResponsiveContainer width={160} height={160}>
              <PieChart>
                <Pie data={TRAFFIC_SOURCES} cx="50%" cy="50%" innerRadius={44} outerRadius={72} paddingAngle={3} dataKey="value">
                  {TRAFFIC_SOURCES.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(v: unknown) => [`${v}%`, '']} contentStyle={TOOLTIP_STYLE} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex-1 space-y-2.5">
              {TRAFFIC_SOURCES.map((s) => (
                <div key={s.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: s.color }} />
                    <span className="text-white/50">{s.name}</span>
                  </div>
                  <span className="font-semibold text-white">{s.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className={`${CARD} p-6`}>
          <h2 className="text-lg font-bold text-white mb-6">Device Breakdown</h2>
          <div className="space-y-4">
            {DEVICES.map((d) => (
              <div key={d.label}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${d.color}`}>
                      <d.icon className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-semibold text-white/70">{d.label}</span>
                  </div>
                  <span className="text-sm font-bold text-white">{d.pct}%</span>
                </div>
                <div className="h-2 bg-white/8 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#4ade80] to-[#22c55e] rounded-full transition-all duration-700" style={{ width: `${d.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
