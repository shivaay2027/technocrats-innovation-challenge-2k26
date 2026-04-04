'use client'
import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  BookOpen, Brain, History, Sprout, AlertTriangle, Activity,
  MapPin, Shield, Users, MessageCircle, Star, Lock,
  CheckCircle2, XCircle, RefreshCw, Database, Cpu, Globe,
  ChevronRight, Droplet, Plus, Wind, ShoppingCart,
} from 'lucide-react'

import {
  API, FARM_PROFILE, CROP_HISTORY, SOIL_READINGS,
  IOT_EVENTS, INTERACTION_LOG, FEEDBACK_LOG,
  REGIONAL_BENCHMARKS, MEMORY_LAYERS, MEMORY_API_PAYLOAD,
  IRRIGATION_EVENTS, DISEASE_HISTORY, WEATHER_HISTORY,
  AI_ACCURACY_TREND, MEMORY_QA_EXAMPLES,
} from './data'

import {
  StatCard, SectionHeading, MemoryLayerCard, InsightCard,
  CropRecoCard, CropTimelineCard, NutrientBar, AnomalyCard,
  FeedbackRow, IotEventRow, BenchmarkRow, PrivacyBadge, InteractionRow,
  SeasonalBarChart, AccuracyTrendChart, MemoryQA, DiseaseCard,
  IrrigationRow, TransactionRow, AddCropForm,
} from './components'

const TABS = [
  { id: 'overview',     label: 'Overview',           icon: BookOpen },
  { id: 'insights',    label: 'AI Insights',         icon: Brain },
  { id: 'timeline',    label: 'Crop Lifecycle',      icon: History },
  { id: 'charts',      label: 'Season Charts',       icon: Activity },
  { id: 'inputs',      label: 'Inputs & Labour',     icon: Sprout },
  { id: 'soil',        label: 'Soil Memory',         icon: Sprout },
  { id: 'irrigation',  label: 'Water & Irrigation',  icon: Droplet },
  { id: 'disease',     label: 'Pest & Disease',      icon: AlertTriangle },
  { id: 'weather',     label: 'Weather History',     icon: Wind },
  { id: 'market',      label: 'Market Ledger',       icon: ShoppingCart },
  { id: 'realtime',    label: 'Live Events',         icon: Cpu },
  { id: 'anomalies',   label: 'Anomalies',           icon: AlertTriangle },
  { id: 'feedback',    label: 'Feedback Loop',       icon: MessageCircle },
  { id: 'qa',          label: 'Memory Q&A',          icon: Brain },
  { id: 'crossfarm',   label: 'Cross-Farm Intel',    icon: Users },
  { id: 'privacy',     label: 'Privacy & Security',  icon: Lock },
]

function Spinner() {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-4">
      <div className="relative w-16 h-16">
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1.8, ease: 'linear' }}
          className="absolute inset-0 rounded-full border-4 border-slate-100 border-t-green-500" />
        <Brain className="absolute inset-0 m-auto text-green-500" size={24} />
      </div>
      <p className="text-slate-500 font-medium text-sm">Loading Farm Memory…</p>
    </div>
  )
}

export default function FarmMemoryPage() {
  const [tab, setTab]                 = useState('overview')
  const [loading, setLoading]         = useState(true)
  const [insightData, setInsightData] = useState(null)
  const [anomalyData, setAnomalyData] = useState(null)
  const [soilApiData, setSoilApiData] = useState(null)
  const [fbRatings, setFbRatings]     = useState({})
  const [cropHistory, setCropHistory] = useState(CROP_HISTORY)
  const [showAddForm, setShowAddForm] = useState(false)

  const loadAll = useCallback(async () => {
    setLoading(true)
    try {
      const lastSoil = SOIL_READINGS[SOIL_READINGS.length - 1]
      const [insRes, anomRes, soilRes] = await Promise.all([
        fetch(`${API}/api/v1/memory/insights`, {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(MEMORY_API_PAYLOAD),
        }),
        fetch(`${API}/api/v1/memory/anomaly-check`, {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ crop_history: MEMORY_API_PAYLOAD.crop_history, soil_readings: MEMORY_API_PAYLOAD.soil_readings }),
        }),
        fetch(`${API}/api/v1/memory/soil-analysis?nitrogen=${lastSoil.nitrogen}&phosphorus=${lastSoil.phosphorus}&potassium=${lastSoil.potassium}&ph=${lastSoil.ph}&organic_carbon=${lastSoil.organic_carbon}`),
      ])
      setInsightData((await insRes.json()).data || null)
      setAnomalyData(await anomRes.json() || null)
      setSoilApiData(await soilRes.json() || null)
    } catch (e) {
      console.error('Farm Memory API error:', e)
    }
    setLoading(false)
  }, [])

  useEffect(() => { loadAll() }, [loadAll])

  const totalRev   = cropHistory.reduce((a, c) => a + c.revenue_inr, 0)
  const totalCost  = cropHistory.reduce((a, c) => a + c.input_cost_inr, 0)
  const netProfit  = totalRev - totalCost
  const totalYield = cropHistory.reduce((a, c) => a + c.yield_tons, 0)
  const avgRating  = (cropHistory.reduce((a, c) => a + c.ai_outcome_rating, 0) / cropHistory.length).toFixed(1)
  const lastSoil   = SOIL_READINGS[SOIL_READINGS.length - 1]

  const handleAddCycle = (newCycle) => {
    setCropHistory(prev => [newCycle, ...prev])
  }

  const handleFbRate = (id, helpful) => {
    setFbRatings(prev => ({ ...prev, [id]: helpful }))
  }

  function renderTab() {
    switch (tab) {

      // ── OVERVIEW ──────────────────────────────────────────────
      case 'overview': return (
        <div className="space-y-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard title="Crop Cycles Logged"  value={cropHistory.length}           subtext={`Since ${FARM_PROFILE.established_year}`} icon={History}  colorClass="bg-green-100 text-green-600" />
            <StatCard title="Total Yield"          value={`${totalYield} t`}            subtext="Across all seasons"                        icon={Sprout}   colorClass="bg-blue-100 text-blue-600" />
            <StatCard title="Net Farm Profit"      value={`₹${(netProfit/100000).toFixed(1)}L`} subtext="All recorded cycles"              icon={Star}     colorClass="bg-yellow-100 text-yellow-600" />
            <StatCard title="AI Outcome Avg"       value={`${avgRating}/5`}             subtext="Farmer-rated AI accuracy"                 icon={Brain}    colorClass="bg-purple-100 text-purple-600" />
          </div>
          <div>
            <SectionHeading icon={Database} title="Memory Architecture" subtitle="How SmartFarm AI builds and stores your farm's intelligence" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {MEMORY_LAYERS.map((ml, i) => <MemoryLayerCard key={i} {...ml} />)}
            </div>
          </div>
          <div>
            <SectionHeading icon={MapPin} title="Farm Identity Profile" subtitle="Static parameters that anchor all AI decisions" />
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[
                  { label: 'Farmer', val: FARM_PROFILE.farmer_name },
                  { label: 'Farm ID', val: FARM_PROFILE.farm_id },
                  { label: 'Location', val: FARM_PROFILE.location },
                  { label: 'Farm Size', val: `${FARM_PROFILE.size_ha} Hectares` },
                  { label: 'Soil Type', val: FARM_PROFILE.soil_type },
                  { label: 'Irrigation', val: FARM_PROFILE.irrigation },
                  { label: 'Since', val: FARM_PROFILE.established_year },
                  { label: 'Preferred Crops', val: FARM_PROFILE.preferred_crops.join(', ') },
                ].map(r => (
                  <div key={r.label}>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">{r.label}</p>
                    <p className="text-sm font-semibold text-slate-800 mt-1">{r.val}</p>
                  </div>
                ))}
              </div>
              <div className="flex gap-3 mt-5 pt-4 border-t border-slate-100">
                {FARM_PROFILE.pmkisan_enrolled && <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full font-semibold">✓ PM-KISAN Enrolled</span>}
                {FARM_PROFILE.fasal_bima && <span className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-semibold">✓ Fasal Bima Active</span>}
                <span className="text-xs bg-slate-100 text-slate-600 px-3 py-1 rounded-full font-semibold">{FARM_PROFILE.bank}</span>
              </div>
            </div>
          </div>
        </div>
      )

      // ── AI INSIGHTS ───────────────────────────────────────────
      case 'insights': return loading ? <Spinner /> : (
        <div className="space-y-6">
          {insightData ? (
            <>
              <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 p-6 rounded-2xl flex gap-4">
                <div className="p-3 bg-emerald-100 text-emerald-600 rounded-xl h-fit flex-shrink-0"><Brain size={28}/></div>
                <div>
                  <h3 className="text-lg font-bold text-slate-800 mb-1">{insightData.headline}</h3>
                  <p className="text-emerald-800 italic font-medium">"{insightData.memory_quote}"</p>
                  <div className="flex gap-2 mt-3">
                    <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-semibold">Gemini AI Analysis</span>
                    <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">{cropHistory.length} seasons of data</span>
                  </div>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <SectionHeading icon={Activity} title="Pattern Recognition" subtitle="Learned from your complete farm history" />
                  <div className="space-y-3">{(insightData.top_insights || []).map((ins, i) => <InsightCard key={i} insight={ins} idx={i} />)}</div>
                </div>
                <div>
                  <SectionHeading icon={Sprout} title="Personalised Recommendations" subtitle="Based on your soil, history & region" />
                  <div className="space-y-3">{(insightData.crop_recommendations || []).map((c, i) => <CropRecoCard key={i} crop={c} idx={i} />)}</div>
                  {insightData.next_steps?.length > 0 && (
                    <div className="mt-5 bg-slate-50 border border-slate-200 rounded-xl p-5">
                      <h4 className="font-bold text-slate-700 mb-3 text-sm">Proactive Next Steps</h4>
                      <ul className="space-y-2">
                        {insightData.next_steps.map((s, i) => (
                          <li key={i} className="flex gap-2 text-sm text-slate-600 items-start">
                            <ChevronRight size={14} className="text-green-500 mt-0.5 flex-shrink-0"/>{s}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-12 text-slate-400">
              <Brain size={48} className="mx-auto mb-3 opacity-30" />
              <p className="font-medium">Could not load AI insights. Ensure backend is running.</p>
            </div>
          )}
        </div>
      )

      // ── CROP LIFECYCLE ────────────────────────────────────────
      case 'timeline': return (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 flex-1 mr-4">
              <StatCard title="Seasons Recorded" value={cropHistory.length}    subtext="Full lifecycle logs"        icon={History} colorClass="bg-green-100 text-green-600"/>
              <StatCard title="Total Yield"       value={`${totalYield}t`}       subtext="All crops"                  icon={Sprout}  colorClass="bg-blue-100 text-blue-600"/>
              <StatCard title="Net P&L"           value={`₹${(netProfit/100000).toFixed(1)}L`} subtext="Cumulative"  icon={Star}    colorClass="bg-yellow-100 text-yellow-600"/>
              <StatCard title="Avg AI Rating"     value={`${avgRating}★`}        subtext="Farmer-confirmed accuracy" icon={Brain}   colorClass="bg-purple-100 text-purple-600"/>
            </div>
            <button onClick={() => setShowAddForm(true)}
              className="flex items-center gap-2 px-5 py-3 bg-emerald-600 text-white rounded-2xl font-bold text-sm hover:bg-emerald-700 transition-colors shadow-lg flex-shrink-0">
              <Plus size={18}/> Log New Cycle
            </button>
          </div>
          <SectionHeading icon={History} title="Full Crop Lifecycle Log" subtitle="Sowing → Harvest → Market — complete traceability of every cycle" />
          <div className="relative border-l-2 border-green-200 ml-4 pl-8 space-y-8 pb-4">
            {cropHistory.map((cycle, i) => <CropTimelineCard key={cycle.id} cycle={cycle} idx={i} />)}
          </div>
          {showAddForm && <AddCropForm onAdd={handleAddCycle} onClose={() => setShowAddForm(false)} />}
        </div>
      )

      // ── SEASONAL CHARTS ───────────────────────────────────────
      case 'charts': return (
        <div className="space-y-6">
          <SectionHeading icon={Activity} title="Seasonal Productivity Charts" subtitle="Visual trends across all recorded crop cycles" />
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              <h4 className="font-bold text-slate-800 mb-1 text-sm">Yield per Season (Tons)</h4>
              <p className="text-xs text-slate-400 mb-4">Total harvest output per crop cycle</p>
              <SeasonalBarChart data={cropHistory} valueKey="yield_tons" label="Yield (t)" colorFrom="#34d399" colorTo="#059669" />
            </div>
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              <h4 className="font-bold text-slate-800 mb-1 text-sm">Net Profit per Season (₹)</h4>
              <p className="text-xs text-slate-400 mb-4">Revenue minus input cost per cycle</p>
              <SeasonalBarChart
                data={cropHistory.map(c => ({ ...c, net_profit: c.revenue_inr - c.input_cost_inr }))}
                valueKey="net_profit" label="Net Profit (₹)" colorFrom="#60a5fa" colorTo="#2563eb" />
            </div>
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              <h4 className="font-bold text-slate-800 mb-1 text-sm">Input Cost per Season (₹)</h4>
              <p className="text-xs text-slate-400 mb-4">Total expenditure on inputs per cycle</p>
              <SeasonalBarChart data={cropHistory} valueKey="input_cost_inr" label="Input Cost (₹)" colorFrom="#fbbf24" colorTo="#d97706" />
            </div>
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              <h4 className="font-bold text-slate-800 mb-1 text-sm">AI Prediction Accuracy Over Seasons</h4>
              <p className="text-xs text-slate-400 mb-4">How SmartFarm AI improved as it learned your farm</p>
              <AccuracyTrendChart data={AI_ACCURACY_TREND} />
              <p className="text-xs text-slate-400 mt-3 text-center">AI accuracy improves via reinforcement from your feedback</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <h4 className="font-bold text-slate-800 mb-4 text-sm">Season-by-Season Comparison Table</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                  <tr>{['Season','Crop','Area (ha)','Yield (t)','Revenue','Cost','Net P&L','AI Rating'].map(h => <th key={h} className="p-3 text-left font-semibold">{h}</th>)}</tr>
                </thead>
                <tbody>
                  {cropHistory.map((c, i) => {
                    const profit = c.revenue_inr - c.input_cost_inr
                    return (
                      <tr key={i} className="border-t border-slate-100 hover:bg-slate-50 transition-colors">
                        <td className="p-3 text-xs font-medium text-slate-500">{c.season} {c.sown_date.slice(0,4)}</td>
                        <td className="p-3 font-bold text-slate-800">{c.crop}</td>
                        <td className="p-3 text-slate-600">{c.area_ha}</td>
                        <td className="p-3 font-semibold text-slate-800">{c.yield_tons} t</td>
                        <td className="p-3 text-green-700 font-semibold">₹{c.revenue_inr.toLocaleString()}</td>
                        <td className="p-3 text-red-600">₹{c.input_cost_inr.toLocaleString()}</td>
                        <td className={`p-3 font-bold ${profit > 0 ? 'text-green-700' : 'text-red-500'}`}>₹{profit.toLocaleString()}</td>
                        <td className="p-3"><div className="flex gap-0.5">{[1,2,3,4,5].map(s => <Star key={s} size={10} className={s <= c.ai_outcome_rating ? 'text-yellow-400 fill-yellow-400' : 'text-slate-200 fill-slate-200'}/>)}</div></td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )

      // ── INPUTS & LABOUR ───────────────────────────────────────
      case 'inputs': return (
        <div className="space-y-6">
          <SectionHeading icon={Sprout} title="Input Usage & Labour Log" subtitle="Fertilizer, pesticide, water, and labour tracked per crop cycle" />
          {cropHistory.filter(c => c.fertilizer_used?.length > 0).map((cycle, i) => (
            <div key={cycle.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-bold text-lg text-slate-800">{cycle.crop} <span className="text-sm text-slate-400">({cycle.season} {cycle.sown_date.slice(0,4)})</span></h3>
                  <p className="text-xs text-slate-400 mt-0.5">{cycle.area_ha} ha · {cycle.irrigation_method} irrigation</p>
                </div>
                <div className="flex gap-3 text-right">
                  <div className="bg-cyan-50 rounded-xl px-4 py-2">
                    <p className="text-xs text-cyan-600 font-bold">Water</p>
                    <p className="font-black text-cyan-700">{cycle.water_used_kl} kL</p>
                  </div>
                  <div className="bg-slate-100 rounded-xl px-4 py-2">
                    <p className="text-xs text-slate-500 font-bold">Labour</p>
                    <p className="font-black text-slate-700">{cycle.labour_days} days</p>
                  </div>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Fertilizers</p>
                  <div className="space-y-2">
                    {cycle.fertilizer_used.map((f, j) => (
                      <div key={j} className="flex justify-between items-center bg-blue-50 rounded-xl px-4 py-2.5">
                        <span className="text-sm font-semibold text-blue-800">{f.name}</span>
                        <div className="text-right">
                          <span className="text-sm font-bold text-blue-700">{f.qty} {f.unit}</span>
                          <span className="text-xs text-blue-500 ml-2">₹{f.cost}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Pesticides / Chemicals</p>
                  <div className="space-y-2">
                    {cycle.pesticide_used?.map((p, j) => (
                      <div key={j} className="flex justify-between items-center bg-orange-50 rounded-xl px-4 py-2.5">
                        <span className="text-sm font-semibold text-orange-800">{p.name}</span>
                        <div className="text-right">
                          <span className="text-sm font-bold text-orange-700">{p.qty} {p.unit}</span>
                          <span className="text-xs text-orange-500 ml-2">₹{p.cost}</span>
                        </div>
                      </div>
                    ))}
                    {cycle.equipment?.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-2 pt-2 border-t border-slate-100">
                        {cycle.equipment.map((eq, j) => <span key={j} className="px-2 py-1 bg-slate-100 text-slate-600 text-xs font-medium rounded-lg">{eq}</span>)}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )

      // ── SOIL MEMORY ───────────────────────────────────────────
      case 'soil': return loading ? <Spinner /> : (
        <div className="space-y-6">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 text-center">
              <p className="text-xs uppercase font-bold text-slate-400 tracking-wide mb-3">AI Soil Health Score</p>
              {soilApiData ? (
                <>
                  <div className="relative inline-block my-2">
                    <svg width="120" height="120" className="-rotate-90">
                      <circle cx="60" cy="60" r="50" fill="none" stroke="#f1f5f9" strokeWidth="10"/>
                      <circle cx="60" cy="60" r="50" fill="none"
                        stroke={soilApiData.soil_health_score > 75 ? '#22c55e' : soilApiData.soil_health_score > 50 ? '#eab308' : '#ef4444'}
                        strokeWidth="10" strokeLinecap="round"
                        strokeDasharray="314.2"
                        strokeDashoffset={314.2 - (314.2 * soilApiData.soil_health_score) / 100}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-3xl font-bold text-slate-800">{soilApiData.soil_health_score}</span>
                    </div>
                  </div>
                  <p className={`font-bold text-lg ${soilApiData.soil_health_score > 75 ? 'text-green-600' : 'text-yellow-600'}`}>{soilApiData.health_status}</p>
                  <div className="mt-3 flex flex-wrap gap-1.5 justify-center">
                    {(soilApiData.suitable_crops || []).map(c => <span key={c} className="text-xs bg-green-50 text-green-700 border border-green-100 px-2 py-0.5 rounded-full">{c}</span>)}
                  </div>
                </>
              ) : <p className="text-slate-400 mt-4">No data</p>}
            </div>
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              <h4 className="font-bold text-slate-800 mb-4 text-sm uppercase tracking-wide">Current Nutrient Status</h4>
              <NutrientBar label="Nitrogen (N)"   value={lastSoil.nitrogen}   optimal_min={60}  optimal_max={160} unit="kg/ha" />
              <NutrientBar label="Phosphorus (P)" value={lastSoil.phosphorus} optimal_min={35}  optimal_max={100} unit="kg/ha" />
              <NutrientBar label="Potassium (K)"  value={lastSoil.potassium}  optimal_min={35}  optimal_max={150} unit="kg/ha" />
              <NutrientBar label="pH"             value={lastSoil.ph}         optimal_min={6.0} optimal_max={7.5} unit="" />
            </div>
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-3">
              <h4 className="font-bold text-slate-800 text-sm uppercase tracking-wide mb-2">Deficiencies Found</h4>
              {soilApiData?.issues_found?.length > 0
                ? soilApiData.issues_found.map((iss, i) => (
                    <div key={i} className="flex gap-2 items-start text-sm bg-red-50 text-red-700 border border-red-100 rounded-lg p-3">
                      <XCircle size={14} className="flex-shrink-0 mt-0.5"/><span>{iss}</span>
                    </div>
                  ))
                : <p className="text-green-600 text-sm flex gap-2 items-center"><CheckCircle2 size={14}/>No critical deficiencies.</p>}
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-100"><SectionHeading icon={Activity} title="Soil Nutrient Trend" subtitle="AI tracking across all recorded soil tests" /></div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wide"><tr>{['Test Date','N (kg/ha)','P (kg/ha)','K (kg/ha)','pH','Org. Carbon','EC'].map(h => <th key={h} className="p-3 text-left font-semibold">{h}</th>)}</tr></thead>
                <tbody>{SOIL_READINGS.map((r, i) => (
                  <tr key={i} className="border-t border-slate-100 hover:bg-slate-50 transition-colors">
                    <td className="p-3 font-medium text-slate-700">{r.date}</td>
                    <td className="p-3 font-semibold text-slate-800">{r.nitrogen}</td>
                    <td className="p-3 font-semibold text-slate-800">{r.phosphorus}</td>
                    <td className="p-3 font-semibold text-slate-800">{r.potassium}</td>
                    <td className="p-3 text-slate-600">{r.ph}</td>
                    <td className="p-3 text-slate-600">{r.organic_carbon}%</td>
                    <td className="p-3 text-slate-600">{r.ec} dS/m</td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
          </div>
          {soilApiData?.recommendations?.length > 0 && (
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100 rounded-2xl p-6">
              <SectionHeading icon={CheckCircle2} title="Prescriptive AI Actions" color="text-green-600" />
              <div className="grid md:grid-cols-2 gap-3">
                {soilApiData.recommendations.map((rec, i) => (
                  <div key={i} className="bg-white p-4 rounded-xl border border-green-100 shadow-sm flex gap-3 items-start text-sm font-medium text-slate-700">
                    <span className="w-6 h-6 rounded-full bg-green-100 text-green-700 text-xs font-bold flex items-center justify-center flex-shrink-0">{i+1}</span>{rec}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )

      // ── WATER & IRRIGATION ────────────────────────────────────
      case 'irrigation': return (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { t: 'Total Water Used', v: `${cropHistory.reduce((a,c)=>a+(c.water_used_kl||0),0)} kL`, s: 'All seasons combined' },
              { t: 'Avg per Season', v: `${Math.round(cropHistory.reduce((a,c)=>a+(c.water_used_kl||0),0)/cropHistory.length)} kL`, s: 'Per crop cycle' },
              { t: 'Irrigation Events', v: IRRIGATION_EVENTS.length, s: 'Last 7 days' },
              { t: 'Water Efficiency', v: '3.8 kg/L', s: 'Top 10% regionally' },
            ].map((s,i)=><StatCard key={i} title={s.t} value={s.v} subtext={s.s} icon={Droplet} colorClass="bg-cyan-100 text-cyan-600"/>)}
          </div>
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <SectionHeading icon={Droplet} title="Recent Irrigation Events" subtitle="Last 7 days of irrigation activity across all zones" />
            {IRRIGATION_EVENTS.map((ev, i) => <IrrigationRow key={i} ev={ev} idx={i}/>)}
          </div>
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <SectionHeading icon={Activity} title="Water Usage by Crop Season" />
            <div className="space-y-3">
              {cropHistory.filter(c=>c.water_used_kl).map((c,i)=>{
                const max = Math.max(...cropHistory.map(x=>x.water_used_kl||0))
                const pct = ((c.water_used_kl||0)/max)*100
                return (
                  <div key={i}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-semibold text-slate-700">{c.crop} ({c.season} {c.sown_date.slice(0,4)})</span>
                      <span className="font-bold text-cyan-600">{c.water_used_kl} kL</span>
                    </div>
                    <div className="bg-slate-100 rounded-full h-2 overflow-hidden">
                      <motion.div initial={{width:0}} animate={{width:`${pct}%`}} transition={{duration:0.8,delay:i*0.1}}
                        className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full"/>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )

      // ── PEST & DISEASE HISTORY ────────────────────────────────
      case 'disease': return (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { t: 'Total Incidents', v: DISEASE_HISTORY.length, s: 'All seasons' },
              { t: 'Active Issues', v: DISEASE_HISTORY.filter(d=>!d.resolved).length, s: 'Requires attention' },
              { t: 'Resolved', v: DISEASE_HISTORY.filter(d=>d.resolved).length, s: 'Successfully treated' },
              { t: 'Treatment Cost', v: `₹${DISEASE_HISTORY.reduce((a,d)=>a+d.chemical_cost,0).toLocaleString()}`, s: 'Total chemicals spent' },
            ].map((s,i)=><StatCard key={i} title={s.t} value={s.v} subtext={s.s} icon={AlertTriangle} colorClass="bg-red-100 text-red-600"/>)}
          </div>
          <SectionHeading icon={AlertTriangle} title="Pest & Disease Timeline" subtitle="Every recorded infestation, disease incident, and corrective action across all seasons" />
          <div className="grid md:grid-cols-2 gap-5">
            {DISEASE_HISTORY.map((d, i) => <DiseaseCard key={d.id} d={d} idx={i}/>)}
          </div>
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <h4 className="font-bold text-slate-800 mb-4">Disease Frequency by Crop</h4>
            {CROP_HISTORY.map((c,i)=>(
              <div key={i} className="flex items-center gap-4 py-2 border-b border-slate-100 last:border-0">
                <span className="font-semibold text-slate-700 w-24 flex-shrink-0 text-sm">{c.crop}</span>
                <div className="flex flex-wrap gap-1.5 flex-1">
                  {c.disease_incidents.map((d,j)=><span key={j} className="px-2 py-0.5 bg-red-50 text-red-600 border border-red-100 rounded text-xs">{d}</span>)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )

      // ── WEATHER HISTORY ───────────────────────────────────────
      case 'weather': return (
        <div className="space-y-6">
          <SectionHeading icon={Wind} title="Seasonal Weather History" subtitle="Climate conditions recorded per season — used by AI to calibrate recommendations" />
          <div className="grid md:grid-cols-2 gap-5">
            {WEATHER_HISTORY.map((w,i) => (
              <motion.div key={i} initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} transition={{delay:i*0.08}}
                className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-bold text-slate-800">{w.season}</h3>
                    <p className="text-xs text-slate-400">{w.period}</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3 mb-3">
                  {[
                    { label: 'Avg Temp', val: `${w.avg_temp}°C` },
                    { label: 'Rainfall', val: `${w.rainfall_mm} mm` },
                    { label: 'Humidity', val: `${w.humidity_pct}%` },
                  ].map(m => (
                    <div key={m.label} className="bg-slate-50 rounded-xl p-3 text-center">
                      <p className="text-xs text-slate-400 font-medium">{m.label}</p>
                      <p className="font-bold text-slate-800 mt-0.5">{m.val}</p>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-slate-600 bg-blue-50 border border-blue-100 rounded-lg px-3 py-2 italic">{w.notable}</p>
              </motion.div>
            ))}
          </div>
        </div>
      )

      // ── MARKET LEDGER ─────────────────────────────────────────
      case 'market': return (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { t: 'Total Revenue', v: `₹${(totalRev/100000).toFixed(1)}L`, s: 'All market sales' },
              { t: 'Total Transactions', v: cropHistory.flatMap(c=>c.market_transactions||[]).length, s: 'Across all seasons' },
              { t: 'Best Sale', v: 'Tomato @ ₹2,200/q', s: 'Nashik APMC, Aug 2024' },
              { t: 'Net Profit', v: `₹${(netProfit/100000).toFixed(1)}L`, s: 'Revenue minus costs' },
            ].map((s,i)=><StatCard key={i} title={s.t} value={s.v} subtext={s.s} icon={ShoppingCart} colorClass="bg-green-100 text-green-600"/>)}
          </div>
          <SectionHeading icon={ShoppingCart} title="Complete Market Transaction Ledger" subtitle="Every mandi sale linked to its crop cycle — full traceability from farm to market" />
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                  <tr>{['Date','Crop','Mandi','Qty (Quintals)','Price/q','Net Amount'].map(h=><th key={h} className="p-3 text-left font-semibold">{h}</th>)}</tr>
                </thead>
                <tbody>
                  {cropHistory.flatMap(c=>
                    (c.market_transactions||[]).map((tx,i)=>(
                      <TransactionRow key={`${c.id}-${i}`} tx={tx} crop={c.crop} idx={i}/>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )

      // ── LIVE EVENTS ───────────────────────────────────────────
      case 'realtime': return (
        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              <SectionHeading icon={Cpu} title="IoT Sensor Stream" subtitle="Short-term memory — last 7 days of field readings" />
              <div>{IOT_EVENTS.map((ev, i) => <IotEventRow key={i} ev={ev} idx={i}/>)}</div>
            </div>
            <div>
              <SectionHeading icon={MessageCircle} title="Voice & App Interaction Log" subtitle="Every query linked to context and outcome" />
              <div className="space-y-3">{INTERACTION_LOG.map((l, i) => <InteractionRow key={i} log={l} idx={i}/>)}</div>
            </div>
          </div>
        </div>
      )

      // ── ANOMALIES ─────────────────────────────────────────────
      case 'anomalies': return loading ? <Spinner /> : (
        <div className="space-y-6">
          {anomalyData?.system_healthy ? (
            <div className="bg-green-50 border border-green-200 rounded-2xl p-12 text-center shadow-sm">
              <div className="inline-flex p-5 bg-green-100 rounded-full mb-4"><CheckCircle2 size={44} className="text-green-600"/></div>
              <h2 className="text-2xl font-bold text-green-800 mb-2">Farm Memory is Stable</h2>
              <p className="text-green-700 max-w-md mx-auto">No critical anomalies detected across yield, revenue, soil, or disease patterns.</p>
            </div>
          ) : (
            <>
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex gap-3 items-center">
                <AlertTriangle className="text-red-500 flex-shrink-0" size={20}/>
                <p className="text-sm text-red-700 font-medium"><strong>{anomalyData?.anomaly_count || 0} anomalies detected</strong> — cross-referenced with multi-season farm memory.</p>
              </div>
              <div className="grid md:grid-cols-2 gap-5">
                {(anomalyData?.anomalies || []).map((a, i) => <AnomalyCard key={i} anom={a} idx={i}/>)}
              </div>
            </>
          )}
        </div>
      )

      // ── FEEDBACK LOOP ─────────────────────────────────────────
      case 'feedback': return (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-100 rounded-2xl p-6">
            <SectionHeading icon={MessageCircle} title="Reinforcement Learning Loop" color="text-purple-600"
              subtitle="Farmer ratings & outcomes are fed back into the AI to improve future recommendations." />
            <div className="grid grid-cols-3 gap-4 mt-2">
              <div className="bg-white rounded-xl p-4 border border-purple-100 text-center shadow-sm">
                <p className="text-2xl font-bold text-purple-700">{FEEDBACK_LOG.filter(f=>f.followed).length}/{FEEDBACK_LOG.length}</p>
                <p className="text-xs text-slate-500 mt-1">Recommendations followed</p>
              </div>
              <div className="bg-white rounded-xl p-4 border border-purple-100 text-center shadow-sm">
                <p className="text-2xl font-bold text-yellow-600">{(FEEDBACK_LOG.reduce((a,f)=>a+f.rating,0)/FEEDBACK_LOG.length).toFixed(1)}★</p>
                <p className="text-xs text-slate-500 mt-1">Average accuracy rating</p>
              </div>
              <div className="bg-white rounded-xl p-4 border border-purple-100 text-center shadow-sm">
                <p className="text-2xl font-bold text-green-600">{FEEDBACK_LOG.filter(f=>f.rating>=4).length}</p>
                <p className="text-xs text-slate-500 mt-1">High-quality predictions</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-100">
              <h3 className="font-bold text-slate-800">Historical Recommendation Feedback</h3>
              <p className="text-sm text-slate-500 mt-0.5">Rate each feedback entry to help the AI learn. Thumbs-up/down are logged into the reinforcement model.</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                  <tr>{['Date','Recommendation','Rating','Followed','Actual Outcome','Rate AI'].map(h=><th key={h} className="p-3 text-left font-semibold">{h}</th>)}</tr>
                </thead>
                <tbody>{FEEDBACK_LOG.map((fb,i)=><FeedbackRow key={fb.id} fb={fb} idx={i} onRate={handleFbRate}/>)}</tbody>
              </table>
            </div>
            {Object.keys(fbRatings).length > 0 && (
              <div className="p-4 bg-purple-50 border-t border-purple-100 text-sm text-purple-700 font-medium">
                ✓ {Object.keys(fbRatings).length} rating(s) submitted — AI reinforcement model updated.
              </div>
            )}
          </div>
        </div>
      )

      // ── MEMORY Q&A ────────────────────────────────────────────
      case 'qa': return (
        <div className="space-y-6">
          <SectionHeading icon={Brain} title="Context-Aware Memory Q&A" subtitle="Ask natural-language questions about your farm history — SmartFarm AI retrieves answers from memory" />
          <MemoryQA examples={MEMORY_QA_EXAMPLES} cropHistory={cropHistory} irrigationEvents={IRRIGATION_EVENTS} diseaseHistory={DISEASE_HISTORY}/>
        </div>
      )

      // ── CROSS-FARM INTEL ──────────────────────────────────────
      case 'crossfarm': return (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-teal-50 to-cyan-50 border border-teal-100 rounded-2xl p-6">
            <SectionHeading icon={Globe} title="Cross-Farm Regional Intelligence" color="text-teal-600"
              subtitle="Anonymized benchmarking against similar farms in Nashik district — privacy-safe aggregated insights." />
          </div>
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-100">
              <h3 className="font-bold text-slate-800">Your Farm vs. Regional Averages</h3>
              <p className="text-sm text-slate-500 mt-0.5">Data aggregated from 847 farms in Maharashtra — all anonymized.</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500"><tr>{['Metric','Your Farm','Region Avg','Rank'].map(h=><th key={h} className="p-3 text-left font-semibold">{h}</th>)}</tr></thead>
                <tbody>{REGIONAL_BENCHMARKS.map((bm,i)=><BenchmarkRow key={i} bm={bm} idx={i}/>)}</tbody>
              </table>
            </div>
          </div>
          <div className="bg-slate-900 text-white rounded-2xl p-6 relative overflow-hidden shadow-lg">
            <div className="absolute right-4 top-4 opacity-10 pointer-events-none"><Globe size={100}/></div>
            <div className="relative z-10">
              <span className="text-xs font-semibold bg-white/20 px-3 py-1 rounded-full uppercase tracking-wide">Digital Twin</span>
              <h3 className="text-xl font-bold mt-3 mb-2">Your Farm Has a Living Digital Double</h3>
              <p className="text-slate-300 text-sm leading-relaxed max-w-lg">Every IoT reading, satellite image, soil test, and market transaction contributes to a continuously-updated digital model of your farm.</p>
              <div className="flex flex-wrap gap-3 mt-4">
                {['IoT Sensors Active','Soil Model Updated','Satellite Data Synced','Market Prices Linked'].map(item=>(
                  <span key={item} className="flex items-center gap-1.5 text-xs bg-white/10 px-3 py-1.5 rounded-full"><CheckCircle2 size={11} className="text-green-400"/>{item}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )

      // ── PRIVACY & SECURITY ────────────────────────────────────
      case 'privacy': return (
        <div className="space-y-6">
          <div className="bg-slate-800 text-white rounded-2xl p-8 relative overflow-hidden shadow-lg">
            <div className="absolute right-6 top-6 opacity-10"><Lock size={120}/></div>
            <div className="relative z-10">
              <span className="text-xs font-semibold bg-white/20 px-3 py-1 rounded-full uppercase tracking-wide">Data Governance</span>
              <h2 className="text-2xl font-bold mt-3 mb-2">Your Farm Data. Your Control.</h2>
              <p className="text-slate-300 text-sm leading-relaxed max-w-xl">SmartFarm AI follows strict data ownership policies. All farm data is encrypted at rest and in transit. No raw farm data is shared with third parties.</p>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              <SectionHeading icon={Shield} title="Data Protection Policies" />
              <div className="space-y-3">
                {['All data encrypted with AES-256 at rest','TLS 1.3 for all data in transit','Farmer retains full ownership of farm data','Data deletion request honoured within 30 days','Zero raw data shared with third-party services','Anonymized aggregate-only cross-farm benchmarks','Audit log of all AI accesses to your data'].map((p,i)=>(
                  <div key={i} className="flex items-start gap-2 text-sm text-slate-700"><CheckCircle2 size={15} className="text-green-500 flex-shrink-0 mt-0.5"/>{p}</div>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              <SectionHeading icon={Lock} title="Access & Compliance" />
              <div className="space-y-3">
                {['Role-based access: Owner, Agronomist, View-only','Two-factor authentication enforced for all logins','Session auto-expires after 30 minutes of inactivity','DPDP Act 2023 (India) compliant data handling','Monthly privacy audit reports generated automatically','IoT device access revocable at any time from app','Aadhaar / Bank details masked in all logs'].map((p,i)=>(
                  <div key={i} className="flex items-start gap-2 text-sm text-slate-700"><CheckCircle2 size={15} className="text-blue-500 flex-shrink-0 mt-0.5"/>{p}</div>
                ))}
              </div>
            </div>
          </div>
          <div>
            <h3 className="font-bold text-slate-700 mb-3 text-sm uppercase tracking-wide">Security Certifications & Status</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {['AES-256 Encryption','TLS 1.3 Active','DPDP Compliant','Audit Logs On'].map(b=><PrivacyBadge key={b} label={b}/>)}
            </div>
          </div>
        </div>
      )

      default: return null
    }
  }

  return (
    <div className="max-w-7xl mx-auto pb-20 space-y-6">
      {/* HERO BANNER */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-8 text-white relative overflow-hidden shadow-xl">
        <div className="absolute inset-0 opacity-5 pointer-events-none" style={{backgroundImage:'radial-gradient(circle at 80% 20%, #22c55e 0%, transparent 60%)'}}/>
        <div className="absolute right-8 top-8 opacity-10 pointer-events-none"><BookOpen size={160}/></div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <span className="px-3 py-1 bg-white/15 rounded-full text-xs font-bold uppercase tracking-wider">Long-Term Intelligence Backbone</span>
            <span className="flex items-center gap-1.5 text-xs text-green-400 font-semibold">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse inline-block"/>Auto-learning Active
            </span>
          </div>
          <h1 className="text-4xl font-bold mb-2 tracking-tight">Farm Memory Engine</h1>
          <p className="text-slate-300 text-sm leading-relaxed max-w-2xl mb-6">A persistent, evolving intelligence system that stores, learns from, and personalises every crop cycle, soil test, sensor reading, and AI interaction.</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-white/10 rounded-2xl p-5 border border-white/10 backdrop-blur-sm">
            {[
              { label: 'Farmer', val: FARM_PROFILE.farmer_name },
              { label: 'Location', val: FARM_PROFILE.location },
              { label: 'Farm Size', val: `${FARM_PROFILE.size_ha} ha` },
              { label: 'Events Logged', val: `${IOT_EVENTS.length + INTERACTION_LOG.length + FEEDBACK_LOG.length + DISEASE_HISTORY.length} events` },
            ].map(s => (
              <div key={s.label}>
                <p className="text-xs text-slate-400 uppercase tracking-wide">{s.label}</p>
                <p className="font-semibold text-white mt-0.5">{s.val}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* TAB BAR */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 border-b border-slate-200" style={{scrollbarWidth:'none'}}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold whitespace-nowrap rounded-t-xl transition-all flex-shrink-0 ${
              tab === t.id ? 'bg-white text-green-700 border border-b-white border-slate-200 -mb-px shadow-sm' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
            }`}>
            <t.icon size={14}/>{t.label}
          </button>
        ))}
        <button onClick={loadAll} className="ml-auto flex items-center gap-1 px-3 py-2 text-xs text-slate-400 hover:text-slate-700 transition-colors flex-shrink-0">
          <RefreshCw size={13}/> Refresh
        </button>
      </div>

      {/* TAB CONTENT */}
      <AnimatePresence mode="wait">
        <motion.div key={tab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.18 }}>
          {renderTab()}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
