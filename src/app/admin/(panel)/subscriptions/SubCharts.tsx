'use client'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar,
} from 'recharts'

const CARD = 'bg-[#13161f] border border-white/5 rounded-2xl'
const TOOLTIP_STYLE = { background: '#1a1e2b', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, fontSize: 12, color: '#fff' }

const MRR_DATA = [
  { month: 'Dec', mrr: 1950 }, { month: 'Jan', mrr: 2340 }, { month: 'Feb', mrr: 2730 },
  { month: 'Mar', mrr: 3120 }, { month: 'Apr', mrr: 3510 }, { month: 'May', mrr: 3861 },
]

const CHURN_DATA = [
  { month: 'Dec', churn: 3.2 }, { month: 'Jan', churn: 2.8 }, { month: 'Feb', churn: 2.4 },
  { month: 'Mar', churn: 2.1 }, { month: 'Apr', churn: 1.9 }, { month: 'May', churn: 1.7 },
]

export default function SubCharts() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      <div className={`${CARD} p-6`}>
        <h2 className="text-sm font-bold text-white mb-5">Monthly Recurring Revenue</h2>
        <ResponsiveContainer width="100%" height={160}>
          <AreaChart data={MRR_DATA} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="gMrr" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4ade80" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#4ade80" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.3)' }} tickLine={false} axisLine={false} />
            <YAxis tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.3)' }} tickLine={false} axisLine={false} tickFormatter={(v) => `€${v}`} />
            <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(v: unknown) => [`€${v}`, 'MRR']} />
            <Area type="monotone" dataKey="mrr" stroke="#4ade80" strokeWidth={2} fill="url(#gMrr)" dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className={`${CARD} p-6`}>
        <h2 className="text-sm font-bold text-white mb-5">Churn Rate (%)</h2>
        <ResponsiveContainer width="100%" height={160}>
          <BarChart data={CHURN_DATA} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.3)' }} tickLine={false} axisLine={false} />
            <YAxis tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.3)' }} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}%`} />
            <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(v: unknown) => [`${v}%`, 'Churn']} />
            <Bar dataKey="churn" fill="#f87171" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
