'use client'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar,
} from 'recharts'
import { RefreshCw } from 'lucide-react'

const CARD = 'bg-[#13161f] border border-white/5 rounded-2xl'

interface DataPoint {
  label: string
  revenue: number
  orders: number
  prev: number
}

export default function DashboardCharts({ chartData }: { chartData: DataPoint[] }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
      <div className={`${CARD} lg:col-span-2 p-6`}>
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-sm font-bold text-white">Revenue vs Previous Period</h2>
          <button className="flex items-center gap-1.5 text-xs text-white/30 hover:text-white/60 transition-colors">
            <RefreshCw className="w-3 h-3" /> Refresh
          </button>
        </div>
        <div className="flex items-center gap-5 mb-5">
          <span className="flex items-center gap-1.5 text-[10px] text-white/40"><span className="w-3 h-0.5 bg-[#4ade80] rounded inline-block" />Current</span>
          <span className="flex items-center gap-1.5 text-[10px] text-white/40"><span className="w-3 h-0.5 bg-[#f87171] rounded inline-block" />Previous</span>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="gCur" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#4ade80" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#4ade80" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gPrev" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#f87171" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#f87171" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
            <XAxis dataKey="label" tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.3)' }} tickLine={false} axisLine={false} />
            <YAxis tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.3)' }} tickLine={false} axisLine={false} tickFormatter={(v) => `€${(v / 1000).toFixed(0)}k`} />
            <Tooltip
              contentStyle={{ background: '#1a1e2b', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, fontSize: 12, color: '#fff' }}
              formatter={(v: unknown, name: unknown) => [`€${Number(v).toLocaleString()}`, name === 'revenue' ? 'Current' : 'Previous']}
            />
            <Area type="monotone" dataKey="prev"    stroke="#f87171" strokeWidth={1.5} fill="url(#gPrev)" dot={false} />
            <Area type="monotone" dataKey="revenue" stroke="#4ade80" strokeWidth={2}   fill="url(#gCur)"  dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className={`${CARD} p-6`}>
        <h2 className="text-sm font-bold text-white mb-5">Orders</h2>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={chartData.slice(-7)} margin={{ top: 5, right: 5, left: -30, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
            <XAxis dataKey="label" tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.3)' }} tickLine={false} axisLine={false} />
            <YAxis tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.3)' }} tickLine={false} axisLine={false} />
            <Tooltip
              contentStyle={{ background: '#1a1e2b', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, fontSize: 12, color: '#fff' }}
            />
            <Bar dataKey="orders" fill="#60a5fa" radius={[4, 4, 0, 0]} name="Orders" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
