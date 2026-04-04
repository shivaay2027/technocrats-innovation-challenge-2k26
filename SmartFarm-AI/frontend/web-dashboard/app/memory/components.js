'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  TrendingUp, TrendingDown, AlertTriangle, Droplet, Leaf,
  BarChart2, Shield, Zap, Star, Clock, CheckCircle2, XCircle,
  Bug, Calendar, MapPin, Coins, Brain, Database, Activity,
  ThumbsUp, ThumbsDown, Wifi, Cpu, Lock, Users, Globe,
  Send, MessageCircle, FlaskConical, Truck,
} from 'lucide-react'

export const ICON_MAP = {
  'trending-up': TrendingUp, 'trending-down': TrendingDown,
  'alert-triangle': AlertTriangle, 'droplet': Droplet,
  'leaf': Leaf, 'bar-chart': BarChart2, 'shield': Shield,
  'zap': Zap, 'star': Star, 'clock': Clock,
  'check': CheckCircle2, 'brain': Brain, 'database': Database,
}
const SEV_STYLES = {
  High: 'bg-red-50 border-red-200 text-red-700',
  Medium: 'bg-orange-50 border-orange-200 text-orange-700',
  Low: 'bg-yellow-50 border-yellow-200 text-yellow-700',
}
const SEV_BADGE = {
  High: 'bg-red-100 text-red-700',
  Medium: 'bg-orange-100 text-orange-700',
  Low: 'bg-yellow-100 text-yellow-700',
}
const LAYER_COLOR = { blue: 'bg-blue-50 border-blue-200 text-blue-700', green: 'bg-green-50 border-green-200 text-green-700', purple: 'bg-purple-50 border-purple-200 text-purple-700' }
const LAYER_ICON_BG = { blue: 'bg-blue-100 text-blue-600', green: 'bg-green-100 text-green-600', purple: 'bg-purple-100 text-purple-600' }

export function StatCard({ title, value, subtext, icon: Icon, colorClass }) {
  return (
    <motion.div whileHover={{ y: -2 }} className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex items-start justify-between">
      <div>
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">{title}</p>
        <p className="text-2xl font-bold text-slate-800">{value}</p>
        <p className="text-xs text-slate-400 mt-1">{subtext}</p>
      </div>
      <div className={`p-3 rounded-xl flex-shrink-0 ${colorClass}`}><Icon size={20} /></div>
    </motion.div>
  )
}

export function SectionHeading({ icon: Icon, title, subtitle, color = 'text-leaf-500' }) {
  return (
    <div className="mb-5">
      <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2"><Icon className={color} size={22} /> {title}</h2>
      {subtitle && <p className="text-sm text-slate-500 mt-1 ml-8">{subtitle}</p>}
    </div>
  )
}

export function MemoryLayerCard({ layer, color, icon, desc, items }) {
  const IconComp = icon === 'zap' ? Zap : icon === 'database' ? Database : Brain
  return (
    <div className={`rounded-2xl border p-5 ${LAYER_COLOR[color]}`}>
      <div className="flex items-center gap-3 mb-3">
        <div className={`p-2.5 rounded-xl ${LAYER_ICON_BG[color]}`}><IconComp size={20} /></div>
        <h3 className="font-bold text-slate-800">{layer}</h3>
      </div>
      <p className="text-sm text-slate-600 mb-4 leading-relaxed">{desc}</p>
      <ul className="space-y-2">
        {items.map((item, i) => (
          <li key={i} className="flex items-center gap-2 text-sm text-slate-700">
            <span className="w-1.5 h-1.5 rounded-full bg-current flex-shrink-0" />{item}
          </li>
        ))}
      </ul>
    </div>
  )
}

export function InsightCard({ insight, idx }) {
  const IconComp = ICON_MAP[insight.icon] || CheckCircle2
  return (
    <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.07 }}
      className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex gap-3 hover:border-leaf-300 hover:shadow-md transition-all group">
      <div className="mt-0.5 flex-shrink-0 p-2 bg-slate-50 rounded-lg group-hover:bg-leaf-50 transition-colors">
        <IconComp size={16} className="text-slate-500 group-hover:text-leaf-600 transition-colors" />
      </div>
      <div>
        <h4 className="text-sm font-bold text-slate-800">{insight.title}</h4>
        <p className="text-xs text-slate-500 mt-1 leading-relaxed">{insight.detail}</p>
      </div>
    </motion.div>
  )
}

export function CropRecoCard({ crop, idx }) {
  const pct = crop.confidence_pct || 75
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }}
      className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-all">
      <div className="flex justify-between items-center mb-2">
        <h4 className="font-bold text-green-700 text-lg">{crop.crop}</h4>
        <span className="text-xs font-bold px-2.5 py-1 bg-green-100 text-green-700 rounded-full">{pct}% Match</span>
      </div>
      <p className="text-sm text-slate-600 leading-relaxed">{crop.reason}</p>
      <div className="mt-3 bg-slate-100 rounded-full h-1.5 overflow-hidden">
        <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: idx * 0.1 + 0.3 }}
          className="h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full" />
      </div>
    </motion.div>
  )
}

export function CropTimelineCard({ cycle, idx }) {
  const profit = cycle.revenue_inr - cycle.input_cost_inr
  const yieldPerHa = (cycle.yield_tons / cycle.area_ha).toFixed(1)
  const isProfit = profit > 0
  return (
    <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.1 }}>
      <div className="absolute -left-[41px] top-1 h-7 w-7 rounded-full bg-leaf-500 border-4 border-white shadow-md flex items-center justify-center">
        <Leaf size={12} className="text-white" />
      </div>
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 hover:shadow-md transition-shadow">
        <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
          <div>
            <h3 className="text-xl font-bold text-slate-800">{cycle.crop}<span className="ml-2 text-sm font-normal text-slate-400">({cycle.variety})</span></h3>
            <p className="text-sm text-slate-400 flex items-center gap-1.5 mt-1"><Calendar size={13} /> {cycle.sown_date} → {cycle.harvested_date}</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-lg">{cycle.season}</span>
            <div className="flex gap-0.5">{[1,2,3,4,5].map(s => <Star key={s} size={12} className={s <= cycle.ai_outcome_rating ? 'text-yellow-400 fill-yellow-400' : 'text-slate-200 fill-slate-200'} />)}</div>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4">
          {[
            { label: 'Area', val: `${cycle.area_ha} ha` },
            { label: 'Total Yield', val: `${cycle.yield_tons} t` },
            { label: 'Yield/Ha', val: `${yieldPerHa} t/ha` },
            { label: 'Market', val: cycle.market_sold.split(' ')[0] },
            { label: 'Net P&L', val: `₹${profit.toLocaleString()}`, highlight: isProfit ? 'text-green-600' : 'text-red-500' },
          ].map(m => (
            <div key={m.label} className="bg-slate-50 p-3 rounded-xl">
              <p className="text-xs text-slate-400 font-medium">{m.label}</p>
              <p className={`font-bold text-slate-800 text-sm mt-0.5 ${m.highlight || ''}`}>{m.val}</p>
            </div>
          ))}
        </div>
        {/* Input Usage Row */}
        {cycle.fertilizer_used && (
          <div className="mt-3 pt-3 border-t border-slate-100 grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-xs uppercase font-bold text-slate-400 mb-2 flex items-center gap-1"><FlaskConical size={11}/>Fertilizers Used</p>
              <div className="flex flex-wrap gap-1.5">
                {cycle.fertilizer_used.map((f, i) => <span key={i} className="px-2 py-0.5 bg-blue-50 border border-blue-100 text-blue-700 rounded text-xs">{f.name} {f.qty}{f.unit}</span>)}
              </div>
            </div>
            <div>
              <p className="text-xs uppercase font-bold text-slate-400 mb-2 flex items-center gap-1"><Bug size={11}/>Pesticides & Water</p>
              <div className="flex flex-wrap gap-1.5">
                {cycle.pesticide_used?.map((p, i) => <span key={i} className="px-2 py-0.5 bg-orange-50 border border-orange-100 text-orange-700 rounded text-xs">{p.name}</span>)}
                <span className="px-2 py-0.5 bg-cyan-50 border border-cyan-100 text-cyan-700 rounded text-xs">💧 {cycle.water_used_kl} kL</span>
                <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-xs">👷 {cycle.labour_days} days</span>
              </div>
            </div>
          </div>
        )}
        <div className="grid md:grid-cols-3 gap-4 mt-3 text-sm">
          <div>
            <p className="text-xs uppercase font-bold text-slate-400 mb-1.5 tracking-wide flex items-center gap-1"><Bug size={11}/>Diseases</p>
            <div className="flex flex-wrap gap-1.5">
              {cycle.disease_incidents.map((d, i) => <span key={i} className="px-2 py-0.5 bg-red-50 border border-red-100 text-red-600 rounded text-xs">{d}</span>)}
            </div>
          </div>
          <div>
            <p className="text-xs uppercase font-bold text-slate-400 mb-1.5 tracking-wide flex items-center gap-1"><Coins size={11}/>Sale</p>
            <p className="text-slate-700 font-medium">₹{cycle.sale_price_per_q}/q @ {cycle.market_sold}</p>
          </div>
          <div>
            <p className="text-xs uppercase font-bold text-slate-400 mb-1.5 tracking-wide flex items-center gap-1"><MapPin size={11}/>AI Memory Note</p>
            <p className="text-slate-600 italic leading-snug">"{cycle.weather_note}"</p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export function NutrientBar({ label, value, optimal_min, optimal_max, unit }) {
  const max_display = optimal_max * 1.6
  const pct = Math.min((value / max_display) * 100, 100)
  const inRange = value >= optimal_min && value <= optimal_max
  const color = inRange ? 'from-green-400 to-emerald-500' : value < optimal_min ? 'from-red-400 to-orange-500' : 'from-yellow-400 to-amber-500'
  const status = inRange ? 'Optimal' : value < optimal_min ? 'Low' : 'High'
  return (
    <div className="mb-3">
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm font-semibold text-slate-700">{label}</span>
        <div className="flex items-center gap-2">
          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${inRange ? 'bg-green-100 text-green-700' : value < optimal_min ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>{status}</span>
          <span className="text-sm font-bold text-slate-800">{value} {unit}</span>
        </div>
      </div>
      <div className="bg-slate-100 rounded-full h-2 overflow-hidden">
        <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.9, ease: 'easeOut' }}
          className={`h-full bg-gradient-to-r rounded-full ${color}`} />
      </div>
      <p className="text-xs text-slate-400 mt-0.5">Optimal: {optimal_min}–{optimal_max} {unit}</p>
    </div>
  )
}

export function AnomalyCard({ anom, idx }) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }}
      className={`p-5 rounded-2xl border shadow-sm ${SEV_STYLES[anom.severity] || SEV_STYLES.Low}`}>
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-2"><AlertTriangle size={18} /><h3 className="font-bold">{anom.title}</h3></div>
        <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${SEV_BADGE[anom.severity]}`}>{anom.severity}</span>
      </div>
      <p className="text-sm leading-relaxed mb-4 opacity-90">{anom.detail}</p>
      <div className="bg-white/60 p-3 rounded-xl border border-black/5">
        <p className="text-xs font-bold uppercase text-slate-500 tracking-wide mb-1">AI Action</p>
        <p className="text-sm text-slate-800 font-medium">{anom.recommendation}</p>
      </div>
    </motion.div>
  )
}

export function FeedbackRow({ fb, idx, onRate }) {
  return (
    <motion.tr initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: idx * 0.07 }}
      className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
      <td className="p-3 text-xs text-slate-400 font-medium">{fb.date}</td>
      <td className="p-3 text-sm text-slate-700 font-medium">{fb.recommendation}</td>
      <td className="p-3">
        <div className="flex gap-0.5">{[1,2,3,4,5].map(s => <Star key={s} size={11} className={s <= fb.rating ? 'text-yellow-400 fill-yellow-400' : 'text-slate-200 fill-slate-200'} />)}</div>
      </td>
      <td className="p-3">
        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${fb.followed ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
          {fb.followed ? 'Followed' : 'Skipped'}
        </span>
      </td>
      <td className="p-3 text-xs text-slate-500 italic">{fb.outcome}</td>
      <td className="p-3">
        <div className="flex gap-1">
          <button onClick={() => onRate(fb.id, true)} className="p-1.5 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors" title="Helpful"><ThumbsUp size={13}/></button>
          <button onClick={() => onRate(fb.id, false)} className="p-1.5 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition-colors" title="Needs work"><ThumbsDown size={13}/></button>
        </div>
      </td>
    </motion.tr>
  )
}

export function IotEventRow({ ev, idx }) {
  const COLOR = { normal: 'bg-green-100 text-green-700', alert: 'bg-red-100 text-red-600', low: 'bg-yellow-100 text-yellow-700', completed: 'bg-blue-100 text-blue-600', dry: 'bg-orange-100 text-orange-600' }
  return (
    <motion.div initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.06 }}
      className="flex items-center justify-between py-2.5 border-b border-slate-100 last:border-0">
      <div className="flex items-center gap-3">
        <div className="h-8 w-8 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
          {ev.type === 'soil_moisture' ? <Droplet size={14} className="text-blue-500"/>
           : ev.type === 'temperature' ? <Activity size={14} className="text-orange-500"/>
           : ev.type === 'irrigation' ? <Droplet size={14} className="text-cyan-500"/>
           : ev.type === 'pest_trap' ? <Bug size={14} className="text-red-500"/>
           : ev.type === 'rainfall' ? <Droplet size={14} className="text-sky-400"/>
           : <Cpu size={14} className="text-slate-400"/>}
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-800 capitalize">{ev.type.replace('_', ' ')}</p>
          <p className="text-xs text-slate-400">{ev.zone} • {ev.ts.replace('T', ' ')}</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <span className="font-bold text-slate-700 text-sm">{ev.value}</span>
        <span className={`text-xs font-bold px-2 py-0.5 rounded-full capitalize ${COLOR[ev.status] || 'bg-slate-100 text-slate-500'}`}>{ev.status}</span>
      </div>
    </motion.div>
  )
}

export function BenchmarkRow({ bm, idx }) {
  const isTop = bm.rank.toLowerCase().includes('top') || bm.rank === 'Efficient'
  return (
    <motion.tr initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: idx * 0.07 }}
      className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
      <td className="p-3 text-sm font-semibold text-slate-700">{bm.metric}</td>
      <td className="p-3 text-sm font-bold text-green-700">{bm.your_farm}</td>
      <td className="p-3 text-sm text-slate-500">{bm.region_avg}</td>
      <td className="p-3">
        <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${isTop ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>{bm.rank}</span>
      </td>
    </motion.tr>
  )
}

export function PrivacyBadge({ label }) {
  return (
    <div className="flex items-center gap-2 bg-white border border-slate-100 rounded-xl px-4 py-3 shadow-sm">
      <Lock size={14} className="text-leaf-500 flex-shrink-0" />
      <span className="text-sm text-slate-700 font-medium">{label}</span>
    </div>
  )
}

export function InteractionRow({ log, idx }) {
  const INTENT_COLOR = { mandi_price: 'bg-purple-100 text-purple-700', disease_detect: 'bg-red-100 text-red-700', scheme_info: 'bg-blue-100 text-blue-700', crop_recommend: 'bg-green-100 text-green-700', memory_query: 'bg-amber-100 text-amber-700' }
  return (
    <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.08 }}
      className="bg-white rounded-xl border border-slate-100 p-4 shadow-sm">
      <div className="flex justify-between items-start mb-2">
        <p className="text-sm font-semibold text-slate-800 flex-1 pr-4">"{log.query}"</p>
        <span className={`text-xs font-bold px-2 py-0.5 rounded-full capitalize flex-shrink-0 ${INTENT_COLOR[log.intent] || 'bg-slate-100 text-slate-500'}`}>
          {log.intent.replace('_', ' ')}
        </span>
      </div>
      <p className="text-xs text-slate-500 mb-1">{log.ts.replace('T', ' ')}</p>
      <p className="text-xs text-slate-600 bg-slate-50 p-2 rounded-lg leading-relaxed"><span className="font-bold text-slate-700">Outcome: </span>{log.outcome}</p>
    </motion.div>
  )
}

// ── NEW: Seasonal Bar Chart (SVG-based, no library needed) ─────
export function SeasonalBarChart({ data, valueKey, label, colorFrom, colorTo }) {
  const max = Math.max(...data.map(d => d[valueKey])) * 1.15
  return (
    <div className="w-full">
      <div className="flex items-end gap-3 h-32">
        {data.map((d, i) => {
          const pct = (d[valueKey] / max) * 100
          return (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <span className="text-xs font-bold text-slate-700">{typeof d[valueKey] === 'number' && d[valueKey] > 999 ? `₹${(d[valueKey]/100000).toFixed(1)}L` : d[valueKey]}</span>
              <motion.div
                initial={{ height: 0 }} animate={{ height: `${pct}%` }}
                transition={{ duration: 0.7, delay: i * 0.1, ease: 'easeOut' }}
                style={{ background: `linear-gradient(to top, ${colorFrom}, ${colorTo})` }}
                className="w-full rounded-t-lg min-h-[4px]"
              />
            </div>
          )
        })}
      </div>
      <div className="flex gap-3 mt-2">
        {data.map((d, i) => <p key={i} className="flex-1 text-center text-[10px] text-slate-400 truncate">{d.crop || d.season}</p>)}
      </div>
      <p className="text-xs text-center text-slate-400 mt-1">{label}</p>
    </div>
  )
}

// ── NEW: AI Accuracy Trend ─────────────────────────────────────
export function AccuracyTrendChart({ data }) {
  const max = 100
  return (
    <div className="w-full">
      <div className="flex items-end gap-4 h-28">
        {data.map((d, i) => {
          const pct = (d.accuracy / max) * 100
          const color = d.accuracy >= 80 ? '#22c55e' : d.accuracy >= 60 ? '#f59e0b' : '#ef4444'
          return (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <span className="text-xs font-black" style={{ color }}>{d.accuracy}%</span>
              <motion.div
                initial={{ height: 0 }} animate={{ height: `${pct}%` }}
                transition={{ duration: 0.8, delay: i * 0.12, ease: 'easeOut' }}
                style={{ backgroundColor: color }}
                className="w-full rounded-t-lg opacity-80 min-h-[4px]"
              />
            </div>
          )
        })}
      </div>
      <div className="flex gap-4 mt-2">
        {data.map((d, i) => <p key={i} className="flex-1 text-center text-[10px] text-slate-400 leading-tight">{d.crop}<br/><span className="text-[9px]">{d.season.split(' ')[0]}</span></p>)}
      </div>
    </div>
  )
}

// ── NEW: Memory Q&A Interface ─────────────────────────────────
export function MemoryQA({ examples, cropHistory, irrigationEvents, diseaseHistory }) {
  const [query, setQuery] = useState('')
  const [answer, setAnswer] = useState(null)
  const [loading, setLoading] = useState(false)

  const answerQuery = (q) => {
    setLoading(true)
    setAnswer(null)
    const lq = (q || query).toLowerCase()
    setTimeout(() => {
      let ans = null
      if (lq.includes('last kharif') || lq.includes('kharif season')) {
        const k = cropHistory.filter(c => c.season === 'Kharif').pop()
        ans = k ? `Last Kharif: You grew **${k.crop}** (${k.variety}) on ${k.area_ha} ha. Yield: ${k.yield_tons}t, Revenue: ₹${k.revenue_inr.toLocaleString()}, AI Rating: ${k.ai_outcome_rating}/5.` : 'No Kharif records found.'
      } else if (lq.includes('water') || lq.includes('irrigation')) {
        const totals = cropHistory.map(c => `${c.crop}: ${c.water_used_kl} kL`).join(', ')
        ans = `Water usage by crop — ${totals}.`
      } else if (lq.includes('profit') || lq.includes('highest')) {
        const best = cropHistory.reduce((a, b) => (b.revenue_inr - b.input_cost_inr) > (a.revenue_inr - a.input_cost_inr) ? b : a)
        ans = `**${best.crop}** (${best.season}) gave the highest profit: ₹${(best.revenue_inr - best.input_cost_inr).toLocaleString()}.`
      } else if (lq.includes('disease') || lq.includes('pest')) {
        const all = cropHistory.flatMap(c => c.disease_incidents.map(d => `${d} (${c.crop} ${c.season})`))
        ans = `Disease history: ${all.join(', ')}.`
      } else if (lq.includes('fertilizer') || lq.includes('urea') || lq.includes('input')) {
        const wheat = cropHistory.find(c => c.crop === 'Wheat')
        ans = wheat ? `Wheat inputs: ${wheat.fertilizer_used.map(f => `${f.name} ${f.qty}${f.unit}`).join(', ')}.` : 'No wheat record found.'
      } else if (lq.includes('labour') || lq.includes('worker')) {
        const rows = cropHistory.map(c => `${c.crop}: ${c.labour_days} days`).join(', ')
        ans = `Labour used — ${rows}.`
      } else {
        ans = "I found no specific memory for that query. Try asking about your crops, water usage, profits, diseases, fertilizers, or labour."
      }
      setAnswer(ans)
      setLoading(false)
    }, 800)
  }

  return (
    <div className="space-y-4">
      <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-2xl p-5">
        <p className="text-xs font-bold text-amber-700 uppercase tracking-wider mb-1">Context-Aware Farm Memory Q&A</p>
        <p className="text-sm text-amber-800">Ask anything about your farm history — SmartFarm AI will retrieve answers from your memory bank.</p>
      </div>
      <div className="flex gap-2">
        <input value={query} onChange={e => setQuery(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && answerQuery()}
          placeholder="e.g. What did I grow last Kharif? or How much water for Tomato?"
          className="flex-1 border-2 border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:border-amber-400 focus:outline-none bg-white"
        />
        <button onClick={() => answerQuery()} disabled={!query.trim() || loading}
          className="px-5 py-3 bg-amber-500 text-white rounded-xl font-bold text-sm hover:bg-amber-600 transition-colors disabled:opacity-50 flex items-center gap-2">
          <Send size={16}/> Ask
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {examples.map((ex, i) => (
          <button key={i} onClick={() => { setQuery(ex.q); answerQuery(ex.q) }}
            className="px-3 py-1.5 bg-white border border-slate-200 text-slate-600 text-xs font-medium rounded-full hover:border-amber-400 hover:text-amber-700 transition-colors">
            {ex.q}
          </button>
        ))}
      </div>
      {loading && <div className="bg-white rounded-xl border border-slate-100 p-4 text-sm text-slate-400 animate-pulse">Searching farm memory...</div>}
      {answer && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl border-2 border-amber-200 p-5 shadow-sm">
          <p className="text-xs font-bold text-amber-600 uppercase tracking-wider mb-2 flex items-center gap-1"><Brain size={12}/> Memory Retrieved</p>
          <p className="text-sm text-slate-800 leading-relaxed font-medium">{answer.replace(/\*\*/g, '')}</p>
        </motion.div>
      )}
    </div>
  )
}

// ── NEW: Disease History Card ──────────────────────────────────
export function DiseaseCard({ d, idx }) {
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.08 }}
      className={`rounded-2xl border p-5 shadow-sm ${SEV_STYLES[d.severity] || SEV_STYLES.Low}`}>
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-2"><Bug size={16}/><h4 className="font-bold">{d.disease}</h4></div>
        <div className="flex items-center gap-2">
          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${SEV_BADGE[d.severity]}`}>{d.severity}</span>
          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${d.resolved ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>{d.resolved ? 'Resolved' : 'Active'}</span>
        </div>
      </div>
      <p className="text-xs mb-2 opacity-80">{d.crop} · {d.zone} · {d.date}</p>
      <p className="text-sm font-medium bg-white/60 rounded-lg p-2.5">{d.action_taken}</p>
      {d.chemical_cost > 0 && <p className="text-xs mt-2 opacity-70">Treatment cost: ₹{d.chemical_cost}</p>}
    </motion.div>
  )
}

// ── NEW: Irrigation Event Row ──────────────────────────────────
export function IrrigationRow({ ev, idx }) {
  return (
    <motion.div initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.07 }}
      className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-cyan-50 flex items-center justify-center flex-shrink-0"><Droplet size={16} className="text-cyan-500"/></div>
        <div>
          <p className="text-sm font-semibold text-slate-800">{ev.zone}</p>
          <p className="text-xs text-slate-400">{ev.date} · {ev.method} · Stage: {ev.stage}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-sm font-bold text-cyan-700">{ev.water_kl} kL</p>
        <p className="text-xs text-slate-400">{ev.duration_hrs}h</p>
      </div>
    </motion.div>
  )
}

// ── NEW: Market Transaction Row ────────────────────────────────
export function TransactionRow({ tx, crop, idx }) {
  return (
    <motion.tr initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: idx * 0.07 }}
      className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
      <td className="p-3 text-xs text-slate-400">{tx.date}</td>
      <td className="p-3 text-sm font-semibold text-slate-800">{crop}</td>
      <td className="p-3 text-sm text-slate-600">{tx.mandi}</td>
      <td className="p-3 text-sm font-bold text-slate-800">{tx.qty_q} q</td>
      <td className="p-3 text-sm font-bold text-green-700">₹{tx.price_q}/q</td>
      <td className="p-3 text-sm font-black text-slate-900">₹{tx.net.toLocaleString()}</td>
    </motion.tr>
  )
}

// ── Field helper — defined at module scope to prevent remount on each keystroke ──
function FormField({ label, fieldKey, type = 'text', placeholder = '', form, set }) {
  return (
    <div>
      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">{label}</label>
      <input
        type={type}
        value={form[fieldKey]}
        onChange={e => set(fieldKey, e.target.value)}
        placeholder={placeholder}
        className="w-full border-2 border-slate-200 rounded-xl p-2.5 text-sm font-medium focus:border-emerald-500 focus:outline-none bg-white"
      />
    </div>
  )
}

// ── NEW: Add Crop Cycle Form ────────────────────────────────────
export function AddCropForm({ onAdd, onClose }) {
  const [form, setForm] = useState({
    crop: '', variety: '', sown_date: '', harvested_date: '', area_ha: '',
    yield_tons: '', input_cost_inr: '', revenue_inr: '', season: 'Kharif',
    market_sold: '', sale_price_per_q: '', disease_incidents: '', weather_note: '',
    water_used_kl: '', labour_days: '', irrigation_method: 'Drip',
  })
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }))

  const handleSubmit = () => {
    if (!form.crop || !form.sown_date) { alert('Crop name and sowing date are required.'); return }
    const newCycle = {
      id: `CROP-${Date.now()}`,
      ...form,
      area_ha: parseFloat(form.area_ha) || 0,
      yield_tons: parseFloat(form.yield_tons) || 0,
      input_cost_inr: parseInt(form.input_cost_inr) || 0,
      revenue_inr: parseInt(form.revenue_inr) || 0,
      sale_price_per_q: parseInt(form.sale_price_per_q) || 0,
      water_used_kl: parseInt(form.water_used_kl) || 0,
      labour_days: parseInt(form.labour_days) || 0,
      disease_incidents: form.disease_incidents ? form.disease_incidents.split(',').map(s => s.trim()) : [],
      fertilizer_used: [], pesticide_used: [], equipment: [], market_transactions: [],
      ai_outcome_rating: 3,
    }
    onAdd(newCycle)
    onClose()
  }

  // Alias so JSX below stays compact
  const Field = ({ label, k, type = 'text', placeholder = '' }) => (
    <div>
      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">{label}</label>
      <input type={type} value={form[k]} onChange={e => set(k, e.target.value)} placeholder={placeholder}
        className="w-full border-2 border-slate-200 rounded-xl p-2.5 text-sm font-medium focus:border-emerald-500 focus:outline-none bg-white" />
    </div>
  )

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
        <div className="p-6 bg-emerald-600 text-white flex justify-between items-center">
          <div><h2 className="text-xl font-black">Log New Crop Cycle</h2><p className="text-emerald-100 text-sm mt-0.5">Record a new season into your farm memory</p></div>
          <button onClick={onClose} className="text-white/70 hover:text-white text-2xl font-bold">✕</button>
        </div>
        <div className="p-6 grid grid-cols-2 gap-4">
          <FormField label="Crop Name *" fieldKey="crop" placeholder="e.g. Wheat" form={form} set={set}/>
          <FormField label="Variety" fieldKey="variety" placeholder="e.g. GW-322" form={form} set={set}/>
          <FormField label="Sowing Date *" fieldKey="sown_date" type="date" form={form} set={set}/>
          <FormField label="Harvest Date" fieldKey="harvested_date" type="date" form={form} set={set}/>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Season</label>
            <select value={form.season} onChange={e => set('season', e.target.value)}
              className="w-full border-2 border-slate-200 rounded-xl p-2.5 text-sm font-medium focus:border-emerald-500 focus:outline-none bg-white">
              <option>Kharif</option><option>Rabi</option><option>Zaid</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Irrigation</label>
            <select value={form.irrigation_method} onChange={e => set('irrigation_method', e.target.value)}
              className="w-full border-2 border-slate-200 rounded-xl p-2.5 text-sm font-medium focus:border-emerald-500 focus:outline-none bg-white">
              <option>Drip</option><option>Flood</option><option>Sprinkler</option><option>Rainfed</option>
            </select>
          </div>
          <FormField label="Area (Hectares)" fieldKey="area_ha" type="number" placeholder="e.g. 5.0" form={form} set={set}/>
          <FormField label="Total Yield (Tons)" fieldKey="yield_tons" type="number" placeholder="e.g. 45" form={form} set={set}/>
          <FormField label="Total Input Cost (₹)" fieldKey="input_cost_inr" type="number" placeholder="e.g. 120000" form={form} set={set}/>
          <FormField label="Total Revenue (₹)" fieldKey="revenue_inr" type="number" placeholder="e.g. 250000" form={form} set={set}/>
          <FormField label="Market Sold At" fieldKey="market_sold" placeholder="e.g. Nashik APMC" form={form} set={set}/>
          <FormField label="Sale Price (₹/quintal)" fieldKey="sale_price_per_q" type="number" placeholder="e.g. 2275" form={form} set={set}/>
          <FormField label="Water Used (kL)" fieldKey="water_used_kl" type="number" placeholder="e.g. 680" form={form} set={set}/>
          <FormField label="Labour Days" fieldKey="labour_days" type="number" placeholder="e.g. 72" form={form} set={set}/>
          <div className="col-span-2">
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Diseases Observed (comma-separated)</label>
            <input value={form.disease_incidents} onChange={e => set('disease_incidents', e.target.value)} placeholder="e.g. Aphids, Yellow Rust"
              className="w-full border-2 border-slate-200 rounded-xl p-2.5 text-sm font-medium focus:border-emerald-500 focus:outline-none bg-white"/>
          </div>
          <div className="col-span-2">
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Season Notes / Weather</label>
            <textarea value={form.weather_note} onChange={e => set('weather_note', e.target.value)} rows={2} placeholder="e.g. Good monsoon, early market timing secured premium price"
              className="w-full border-2 border-slate-200 rounded-xl p-2.5 text-sm font-medium focus:border-emerald-500 focus:outline-none bg-white resize-none"/>
          </div>
        </div>
        <div className="p-6 pt-0 flex gap-3">
          <button onClick={onClose} className="flex-1 py-3.5 rounded-xl font-bold text-sm bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors">Cancel</button>
          <button onClick={handleSubmit} className="flex-1 py-3.5 rounded-xl font-bold text-sm bg-emerald-600 text-white hover:bg-emerald-700 transition-colors shadow-lg">
            Save to Farm Memory ✓
          </button>
        </div>
      </motion.div>
    </div>
  )
}
