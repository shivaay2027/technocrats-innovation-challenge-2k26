'use client'
import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  BookOpen, Brain, History, Sprout, AlertTriangle, Activity,
  MapPin, Shield, Users, MessageCircle, Star, Lock,
  CheckCircle2, XCircle, RefreshCw, Database, Cpu, Globe,
  ChevronRight, Droplet, Plus, Wind, ShoppingCart, Pencil, Trash2, Save,
} from 'lucide-react'

import {
  API, MEMORY_LAYERS, AI_ACCURACY_TREND, MEMORY_QA_EXAMPLES,
  REGIONAL_BENCHMARKS, INTERACTION_LOG,
} from './data'

const MEM_API = (e) => `/api/memory/${e}`
const apiFetch = (e) => fetch(MEM_API(e), { cache: 'no-store' }).then(r => r.json())
const apiPost  = (e, body) => fetch(MEM_API(e), { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(body) }).then(r => r.json())
const apiPut   = (e, body) => fetch(MEM_API(e), { method: 'PUT',  headers: {'Content-Type':'application/json'}, body: JSON.stringify(body) }).then(r => r.json())
const apiDel   = (e, id)   => fetch(`${MEM_API(e)}?id=${id}`, { method: 'DELETE' }).then(r => r.json())

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
  const [tab, setTab]                     = useState('overview')
  const [loading, setLoading]             = useState(true)
  const [insightData, setInsightData]     = useState(null)
  const [anomalyData, setAnomalyData]     = useState(null)
  const [soilApiData, setSoilApiData]     = useState(null)

  // Persistent data state — fetched from API
  const [farmProfile, setFarmProfile]     = useState(null)
  const [cropHistory, setCropHistory]     = useState([])
  const [soilReadings, setSoilReadings]   = useState([])
  const [irrigEvents, setIrrigEvents]     = useState([])
  const [diseaseHist, setDiseaseHist]     = useState([])
  const [weatherHist, setWeatherHist]     = useState([])
  const [feedbackLog, setFeedbackLog]     = useState([])
  const [iotEvents, setIotEvents]         = useState([])

  // UI state
  const [showAddForm, setShowAddForm]         = useState(false)
  const [showProfileEdit, setShowProfileEdit] = useState(false)
  const [showAddSoil, setShowAddSoil]         = useState(false)
  const [showAddIrrig, setShowAddIrrig]       = useState(false)
  const [showAddDisease, setShowAddDisease]   = useState(false)
  const [showAddWeather, setShowAddWeather]   = useState(false)
  const [toast, setToast]                     = useState(null)

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 3000) }

  // ── Load all persistent data from API ─────────────────────────
  const loadPersistentData = useCallback(async () => {
    const [profile, crops, soil, irrig, disease, weather, feedback, iot] = await Promise.all([
      apiFetch('farm-profile'),
      apiFetch('crop-history'),
      apiFetch('soil-readings'),
      apiFetch('irrigation-events'),
      apiFetch('disease-history'),
      apiFetch('weather-history'),
      apiFetch('feedback-log'),
      apiFetch('iot-events'),
    ])
    setFarmProfile(profile)
    setCropHistory(crops)
    setSoilReadings(soil)
    setIrrigEvents(irrig)
    setDiseaseHist(disease)
    setWeatherHist(weather)
    setFeedbackLog(feedback)
    setIotEvents(iot)
  }, [])

  // ── Load AI backend data ───────────────────────────────────────
  const loadAiData = useCallback(async () => {
    setLoading(true)
    try {
      const lastSoil = soilReadings[soilReadings.length - 1]
      if (!lastSoil) { setLoading(false); return }
      const [insRes, anomRes, soilRes] = await Promise.all([
        fetch(`${API}/api/v1/memory/insights`, {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ farm_profile: farmProfile, crop_history: cropHistory, soil_readings: soilReadings }),
        }),
        fetch(`${API}/api/v1/memory/anomaly-check`, {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ crop_history: cropHistory, soil_readings: soilReadings }),
        }),
        fetch(`${API}/api/v1/memory/soil-analysis?nitrogen=${lastSoil.nitrogen}&phosphorus=${lastSoil.phosphorus}&potassium=${lastSoil.potassium}&ph=${lastSoil.ph}&organic_carbon=${lastSoil.organic_carbon}`),
      ])
      setInsightData((await insRes.json()).data || null)
      setAnomalyData(await anomRes.json() || null)
      setSoilApiData(await soilRes.json() || null)
    } catch (e) { console.error('AI API error:', e) }
    setLoading(false)
  }, [soilReadings, cropHistory, farmProfile])

  useEffect(() => { loadPersistentData() }, [loadPersistentData])
  useEffect(() => { if (soilReadings.length > 0) loadAiData() }, [soilReadings.length])

  // ── Computed stats ─────────────────────────────────────────────
  const totalRev   = cropHistory.reduce((a, c) => a + c.revenue_inr, 0)
  const totalCost  = cropHistory.reduce((a, c) => a + c.input_cost_inr, 0)
  const netProfit  = totalRev - totalCost
  const totalYield = cropHistory.reduce((a, c) => a + c.yield_tons, 0)
  const avgRating  = cropHistory.length ? (cropHistory.reduce((a, c) => a + c.ai_outcome_rating, 0) / cropHistory.length).toFixed(1) : '—'
  const lastSoil   = soilReadings[soilReadings.length - 1] || {}

  // ── CRUD Handlers ──────────────────────────────────────────────
  const handleAddCycle = async (newCycle) => {
    await apiPost('crop-history', newCycle)
    setCropHistory(prev => [newCycle, ...prev])
    showToast('✅ Crop cycle saved permanently!')
  }

  const handleDeleteCycle = async (id) => {
    if (!confirm('Delete this crop cycle?')) return
    await apiDel('crop-history', id)
    setCropHistory(prev => prev.filter(c => c.id !== id))
    showToast('🗑️ Crop cycle deleted.')
  }

  const handleSaveProfile = async (updated) => {
    await apiPut('farm-profile', updated)
    setFarmProfile(updated)
    setShowProfileEdit(false)
    showToast('✅ Farm profile updated!')
  }

  const handleAddSoil = async (entry) => {
    const item = { id: `SR-${Date.now()}`, ...entry }
    await apiPost('soil-readings', item)
    setSoilReadings(prev => [...prev, item])
    setShowAddSoil(false)
    showToast('✅ Soil reading saved!')
  }

  const handleAddIrrig = async (entry) => {
    const item = { id: `IR-${Date.now()}`, ...entry }
    await apiPost('irrigation-events', item)
    setIrrigEvents(prev => [item, ...prev])
    setShowAddIrrig(false)
    showToast('✅ Irrigation event saved!')
  }

  const handleAddDisease = async (entry) => {
    const item = { id: `D-${Date.now()}`, ...entry, resolved: false }
    await apiPost('disease-history', item)
    setDiseaseHist(prev => [item, ...prev])
    setShowAddDisease(false)
    showToast('✅ Disease incident recorded!')
  }

  const handleToggleResolved = async (id) => {
    const item = diseaseHist.find(d => d.id === id)
    const updated = { ...item, resolved: !item.resolved }
    await apiPut('disease-history', updated)
    setDiseaseHist(prev => prev.map(d => d.id === id ? updated : d))
  }

  const handleDeleteDisease = async (id) => {
    await apiDel('disease-history', id)
    setDiseaseHist(prev => prev.filter(d => d.id !== id))
    showToast('🗑️ Record deleted.')
  }

  const handleAddWeather = async (entry) => {
    const item = { id: `WH-${Date.now()}`, ...entry }
    await apiPost('weather-history', item)
    setWeatherHist(prev => [item, ...prev])
    setShowAddWeather(false)
    showToast('✅ Weather record saved!')
  }

  const handleFbRate = async (id, helpful) => {
    const item = feedbackLog.find(f => f.id === id)
    const updated = { ...item, helpful }
    await apiPut('feedback-log', updated)
    setFeedbackLog(prev => prev.map(f => f.id === id ? updated : f))
  }

  function renderTab() {
    switch (tab) {

      // ── OVERVIEW ──────────────────────────────────────────────
      case 'overview': return (
        <div className="space-y-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard title="Crop Cycles Logged"  value={cropHistory.length}           subtext={`Since ${farmProfile?.established_year || '...'}`} icon={History}  colorClass="bg-green-100 text-green-600" />
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
            <div className="flex justify-between items-center mb-5">
              <SectionHeading icon={MapPin} title="Farm Identity Profile" subtitle="Editable — anchors all AI decisions" />
              <button onClick={() => setShowProfileEdit(true)}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition-colors">
                <Pencil size={13}/> Edit Profile
              </button>
            </div>
            {farmProfile ? (
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {[
                    { label: 'Farmer', val: farmProfile.farmer_name },
                    { label: 'Farm ID', val: farmProfile.farm_id },
                    { label: 'Location', val: farmProfile.location },
                    { label: 'Farm Size', val: `${farmProfile.size_ha} Hectares` },
                    { label: 'Soil Type', val: farmProfile.soil_type },
                    { label: 'Irrigation', val: farmProfile.irrigation },
                    { label: 'Since', val: farmProfile.established_year },
                    { label: 'Preferred Crops', val: Array.isArray(farmProfile.preferred_crops) ? farmProfile.preferred_crops.join(', ') : farmProfile.preferred_crops },
                  ].map(r => (
                    <div key={r.label}>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">{r.label}</p>
                      <p className="text-sm font-semibold text-slate-800 mt-1">{r.val}</p>
                    </div>
                  ))}
                </div>
                <div className="flex gap-3 mt-5 pt-4 border-t border-slate-100">
                  {farmProfile.pmkisan_enrolled && <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full font-semibold">✓ PM-KISAN Enrolled</span>}
                  {farmProfile.fasal_bima && <span className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-semibold">✓ Fasal Bima Active</span>}
                  <span className="text-xs bg-slate-100 text-slate-600 px-3 py-1 rounded-full font-semibold">{farmProfile.bank}</span>
                </div>
              </div>
            ) : <div className="animate-pulse bg-slate-100 rounded-2xl h-40" />}
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
            {cropHistory.map((cycle, i) => (
              <div key={cycle.id} className="relative">
                <button onClick={() => handleDeleteCycle(cycle.id)}
                  className="absolute top-4 right-4 z-10 p-1.5 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition-colors" title="Delete">
                  <Trash2 size={13}/>
                </button>
                <CropTimelineCard cycle={cycle} idx={i} />
              </div>
            ))}
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
          <div className="flex justify-end">
            <button onClick={() => setShowAddSoil(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 text-white rounded-xl font-bold text-sm hover:bg-emerald-700 transition-colors">
              <Plus size={16}/> Add Soil Reading
            </button>
          </div>
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
              <NutrientBar label="Nitrogen (N)"   value={lastSoil.nitrogen||0}   optimal_min={60}  optimal_max={160} unit="kg/ha" />
              <NutrientBar label="Phosphorus (P)" value={lastSoil.phosphorus||0} optimal_min={35}  optimal_max={100} unit="kg/ha" />
              <NutrientBar label="Potassium (K)"  value={lastSoil.potassium||0}  optimal_min={35}  optimal_max={150} unit="kg/ha" />
              <NutrientBar label="pH"             value={lastSoil.ph||7}         optimal_min={6.0} optimal_max={7.5} unit="" />
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
                <tbody>{soilReadings.map((r, i) => (
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
              { t: 'Irrigation Events', v: irrigEvents.length, s: 'Last 7 days' },
              { t: 'Water Efficiency', v: '3.8 kg/L', s: 'Top 10% regionally' },
            ].map((s,i)=><StatCard key={i} title={s.t} value={s.v} subtext={s.s} icon={Droplet} colorClass="bg-cyan-100 text-cyan-600"/>)}
          </div>
          <div className="flex justify-end mb-2">
            <button onClick={() => setShowAddIrrig(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-cyan-600 text-white rounded-xl font-bold text-sm hover:bg-cyan-700 transition-colors">
              <Plus size={16}/> Log Irrigation Event
            </button>
          </div>
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <SectionHeading icon={Droplet} title="Recent Irrigation Events" subtitle="Last recorded irrigation activity across all zones" />
            {irrigEvents.map((ev, i) => <IrrigationRow key={ev.id || i} ev={ev} idx={i}/>)}
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
              { t: 'Total Incidents', v: diseaseHist.length, s: 'All seasons' },
              { t: 'Active Issues', v: diseaseHist.filter(d=>!d.resolved).length, s: 'Requires attention' },
              { t: 'Resolved', v: diseaseHist.filter(d=>d.resolved).length, s: 'Successfully treated' },
              { t: 'Treatment Cost', v: `₹${diseaseHist.reduce((a,d)=>a+(d.chemical_cost||0),0).toLocaleString()}`, s: 'Total chemicals spent' },
            ].map((s,i)=><StatCard key={i} title={s.t} value={s.v} subtext={s.s} icon={AlertTriangle} colorClass="bg-red-100 text-red-600"/>)}
          </div>
          <div className="flex justify-end">
            <button onClick={() => setShowAddDisease(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-red-600 text-white rounded-xl font-bold text-sm hover:bg-red-700 transition-colors">
              <Plus size={16}/> Log Disease Incident
            </button>
          </div>
          <SectionHeading icon={AlertTriangle} title="Pest & Disease Timeline" subtitle="Every recorded infestation, disease incident, and corrective action across all seasons" />
          <div className="grid md:grid-cols-2 gap-5">
            {diseaseHist.map((d, i) => (
              <div key={d.id} className="relative">
                <div className="absolute top-3 right-3 z-10 flex gap-1">
                  <button onClick={() => handleToggleResolved(d.id)}
                    className={`px-2 py-1 text-xs font-bold rounded-lg transition-colors ${d.resolved ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200' : 'bg-green-100 text-green-700 hover:bg-green-200'}`}>
                    {d.resolved ? 'Reopen' : '✓ Resolve'}
                  </button>
                  <button onClick={() => handleDeleteDisease(d.id)} className="p-1.5 bg-red-50 text-red-500 rounded-lg hover:bg-red-100"><Trash2 size={12}/></button>
                </div>
                <DiseaseCard d={d} idx={i}/>
              </div>
            ))}
          </div>
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <h4 className="font-bold text-slate-800 mb-4">Disease Frequency by Crop</h4>
            {cropHistory.filter(c => c.disease_incidents?.length > 0).map((c,i)=>(
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
          <div className="flex justify-end">
            <button onClick={() => setShowAddWeather(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 transition-colors">
              <Plus size={16}/> Add Weather Record
            </button>
          </div>
          <div className="grid md:grid-cols-2 gap-5">
            {weatherHist.map((w,i) => (
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
              <div>{iotEvents.map((ev, i) => <IotEventRow key={ev.id||i} ev={ev} idx={i}/>)}</div>
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
                <p className="text-2xl font-bold text-purple-700">{feedbackLog.filter(f=>f.followed).length}/{feedbackLog.length}</p>
                <p className="text-xs text-slate-500 mt-1">Recommendations followed</p>
              </div>
              <div className="bg-white rounded-xl p-4 border border-purple-100 text-center shadow-sm">
                <p className="text-2xl font-bold text-yellow-600">{feedbackLog.length ? (feedbackLog.reduce((a,f)=>a+(f.rating||0),0)/feedbackLog.length).toFixed(1) : '—'}★</p>
                <p className="text-xs text-slate-500 mt-1">Average accuracy rating</p>
              </div>
              <div className="bg-white rounded-xl p-4 border border-purple-100 text-center shadow-sm">
                <p className="text-2xl font-bold text-green-600">{feedbackLog.filter(f=>f.rating>=4).length}</p>
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
                <tbody>{feedbackLog.map((fb,i)=><FeedbackRow key={fb.id} fb={fb} idx={i} onRate={handleFbRate}/>)}</tbody>
              </table>
            </div>
            {feedbackLog.filter(f => f.helpful !== null && f.helpful !== undefined).length > 0 && (
              <div className="p-4 bg-purple-50 border-t border-purple-100 text-sm text-purple-700 font-medium">
                ✓ {feedbackLog.filter(f=>f.helpful !== null && f.helpful !== undefined).length} rating(s) saved to memory.
              </div>
            )}
          </div>
        </div>
      )

      // ── MEMORY Q&A ────────────────────────────────────────────
      case 'qa': return (
        <div className="space-y-6">
          <SectionHeading icon={Brain} title="Context-Aware Memory Q&A" subtitle="Ask natural-language questions about your farm history" />
          <MemoryQA examples={MEMORY_QA_EXAMPLES} cropHistory={cropHistory} irrigationEvents={irrigEvents} diseaseHistory={diseaseHist}/>
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
              { label: 'Farmer', val: farmProfile?.farmer_name || '...' },
              { label: 'Location', val: farmProfile?.location || '...' },
              { label: 'Farm Size', val: farmProfile ? `${farmProfile.size_ha} ha` : '...' },
              { label: 'Records Stored', val: `${iotEvents.length + INTERACTION_LOG.length + feedbackLog.length + diseaseHist.length} entries` },
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
        <button onClick={loadPersistentData} className="ml-auto flex items-center gap-1 px-3 py-2 text-xs text-slate-400 hover:text-slate-700 transition-colors flex-shrink-0">
          <RefreshCw size={13}/> Refresh
        </button>
      </div>

      {/* TAB CONTENT */}
      <AnimatePresence mode="wait">
        <motion.div key={tab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.18 }}>
          {renderTab()}
        </motion.div>
      </AnimatePresence>

      {/* TOAST */}
      <AnimatePresence>
        {toast && (
          <motion.div initial={{opacity:0,y:30}} animate={{opacity:1,y:0}} exit={{opacity:0,y:30}}
            className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl text-sm font-semibold">
            {toast}
          </motion.div>
        )}
      </AnimatePresence>

      {/* EDIT FARM PROFILE MODAL */}
      {showProfileEdit && farmProfile && <EditProfileModal profile={farmProfile} onSave={handleSaveProfile} onClose={() => setShowProfileEdit(false)} />}

      {/* ADD SOIL READING MODAL */}
      {showAddSoil && <SimpleModal title="Add Soil Reading" color="emerald" onClose={() => setShowAddSoil(false)}
        onSubmit={handleAddSoil}
        fields={[
          {k:'date',label:'Test Date',type:'date'},{k:'nitrogen',label:'Nitrogen (kg/ha)',type:'number'},
          {k:'phosphorus',label:'Phosphorus (kg/ha)',type:'number'},{k:'potassium',label:'Potassium (kg/ha)',type:'number'},
          {k:'ph',label:'pH',type:'number'},{k:'organic_carbon',label:'Organic Carbon (%)',type:'number'},{k:'ec',label:'EC (dS/m)',type:'number'},
        ]} />}

      {/* ADD IRRIGATION EVENT MODAL */}
      {showAddIrrig && <SimpleModal title="Log Irrigation Event" color="cyan" onClose={() => setShowAddIrrig(false)}
        onSubmit={handleAddIrrig}
        fields={[
          {k:'date',label:'Date',type:'date'},{k:'zone',label:'Zone / Area',type:'text'},
          {k:'method',label:'Method (Drip/Flood)',type:'text'},{k:'duration_hrs',label:'Duration (hours)',type:'number'},
          {k:'water_kl',label:'Water Used (kL)',type:'number'},{k:'stage',label:'Crop Stage',type:'text'},
        ]} />}

      {/* ADD DISEASE INCIDENT MODAL */}
      {showAddDisease && <SimpleModal title="Log Disease Incident" color="red" onClose={() => setShowAddDisease(false)}
        onSubmit={handleAddDisease}
        fields={[
          {k:'date',label:'Date',type:'date'},{k:'crop',label:'Crop',type:'text'},
          {k:'disease',label:'Disease / Pest',type:'text'},
          {k:'severity',label:'Severity (Low/Medium/High)',type:'text'},
          {k:'zone',label:'Zone / Block',type:'text'},{k:'action_taken',label:'Action Taken',type:'text'},
          {k:'chemical_cost',label:'Treatment Cost (₹)',type:'number'},
        ]} />}

      {/* ADD WEATHER RECORD MODAL */}
      {showAddWeather && <SimpleModal title="Add Weather Record" color="blue" onClose={() => setShowAddWeather(false)}
        onSubmit={handleAddWeather}
        fields={[
          {k:'season',label:'Season Name',type:'text'},{k:'period',label:'Period (e.g. Jun–Oct 2025)',type:'text'},
          {k:'avg_temp',label:'Avg Temp (°C)',type:'number'},{k:'rainfall_mm',label:'Rainfall (mm)',type:'number'},
          {k:'humidity_pct',label:'Humidity (%)',type:'number'},{k:'frost_days',label:'Frost Days',type:'number'},
          {k:'notable',label:'Notable Observations',type:'text'},
        ]} />}
    </div>
  )
}

// ── Reusable Simple Modal Form ─────────────────────────────────
function SimpleModal({ title, color, fields, onSubmit, onClose }) {
  const colors = { emerald:'bg-emerald-600', cyan:'bg-cyan-600', red:'bg-red-600', blue:'bg-blue-600' }
  const borders = { emerald:'focus:border-emerald-500', cyan:'focus:border-cyan-500', red:'focus:border-red-500', blue:'focus:border-blue-500' }
  const [form, setForm] = useState(() => Object.fromEntries(fields.map(f => [f.k, ''])))
  const set = (k, v) => setForm(p => ({...p, [k]: v}))
  const handleSubmit = () => {
    const parsed = {}
    fields.forEach(f => { parsed[f.k] = f.type === 'number' ? (parseFloat(form[f.k]) || 0) : form[f.k] })
    onSubmit(parsed)
  }
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <motion.div initial={{opacity:0,scale:0.95}} animate={{opacity:1,scale:1}}
        className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden">
        <div className={`p-5 ${colors[color]} text-white flex justify-between items-center`}>
          <h2 className="text-lg font-black">{title}</h2>
          <button onClick={onClose} className="text-white/70 hover:text-white text-xl font-bold">✕</button>
        </div>
        <div className="p-5 grid grid-cols-2 gap-3">
          {fields.map(f => (
            <div key={f.k} className={f.k === 'notable' || f.k === 'action_taken' ? 'col-span-2' : ''}>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">{f.label}</label>
              <input type={f.type} value={form[f.k]} onChange={e => set(f.k, e.target.value)}
                className={`w-full border-2 border-slate-200 rounded-xl p-2.5 text-sm font-medium focus:outline-none bg-white ${borders[color]}`}/>
            </div>
          ))}
        </div>
        <div className="p-5 pt-0 flex gap-3">
          <button onClick={onClose} className="flex-1 py-3 rounded-xl font-bold text-sm bg-slate-100 text-slate-700 hover:bg-slate-200">Cancel</button>
          <button onClick={handleSubmit} className={`flex-1 py-3 rounded-xl font-bold text-sm text-white shadow-lg ${colors[color]}`}>
            <Save size={14} className="inline mr-1"/>Save Record
          </button>
        </div>
      </motion.div>
    </div>
  )
}

// ── Edit Farm Profile Modal ─────────────────────────────────────
function EditProfileModal({ profile, onSave, onClose }) {
  const [form, setForm] = useState({...profile, preferred_crops: Array.isArray(profile.preferred_crops) ? profile.preferred_crops.join(', ') : profile.preferred_crops})
  const set = (k, v) => setForm(p => ({...p, [k]: v}))
  const handleSave = () => {
    onSave({ ...form, size_ha: parseFloat(form.size_ha)||form.size_ha, preferred_crops: form.preferred_crops.split(',').map(s=>s.trim()) })
  }
  const F = ({label, k, type='text'}) => (
    <div>
      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">{label}</label>
      <input type={type} value={form[k]||''} onChange={e=>set(k,e.target.value)}
        className="w-full border-2 border-slate-200 rounded-xl p-2.5 text-sm font-medium focus:border-emerald-500 focus:outline-none bg-white"/>
    </div>
  )
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <motion.div initial={{opacity:0,scale:0.95}} animate={{opacity:1,scale:1}}
        className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
        <div className="p-6 bg-emerald-600 text-white flex justify-between items-center">
          <div><h2 className="text-xl font-black">Edit Farm Profile</h2><p className="text-emerald-100 text-sm mt-0.5">All changes are saved permanently</p></div>
          <button onClick={onClose} className="text-white/70 hover:text-white text-2xl font-bold">✕</button>
        </div>
        <div className="p-6 grid grid-cols-2 gap-4">
          <F label="Farmer Name" k="farmer_name"/>
          <F label="Farm Name" k="farm_name"/>
          <F label="Location" k="location"/>
          <F label="State" k="state"/>
          <F label="Farm Size (ha)" k="size_ha" type="number"/>
          <F label="Soil Type" k="soil_type"/>
          <F label="Irrigation Setup" k="irrigation"/>
          <F label="Bank" k="bank"/>
          <F label="Phone" k="phone"/>
          <F label="Established Year" k="established_year" type="number"/>
          <div className="col-span-2">
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Preferred Crops (comma-separated)</label>
            <input value={form.preferred_crops||''} onChange={e=>set('preferred_crops',e.target.value)}
              className="w-full border-2 border-slate-200 rounded-xl p-2.5 text-sm font-medium focus:border-emerald-500 focus:outline-none bg-white"/>
          </div>
          <div className="flex items-center gap-3">
            <input type="checkbox" id="pmkisan" checked={!!form.pmkisan_enrolled} onChange={e=>set('pmkisan_enrolled',e.target.checked)} className="w-4 h-4"/>
            <label htmlFor="pmkisan" className="text-sm font-semibold text-slate-700">PM-KISAN Enrolled</label>
          </div>
          <div className="flex items-center gap-3">
            <input type="checkbox" id="fasal" checked={!!form.fasal_bima} onChange={e=>set('fasal_bima',e.target.checked)} className="w-4 h-4"/>
            <label htmlFor="fasal" className="text-sm font-semibold text-slate-700">Fasal Bima Active</label>
          </div>
        </div>
        <div className="p-6 pt-0 flex gap-3">
          <button onClick={onClose} className="flex-1 py-3.5 rounded-xl font-bold text-sm bg-slate-100 text-slate-700 hover:bg-slate-200">Cancel</button>
          <button onClick={handleSave} className="flex-1 py-3.5 rounded-xl font-bold text-sm bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg">
            <Save size={14} className="inline mr-1"/>Save Profile
          </button>
        </div>
      </motion.div>
    </div>
  )
}
