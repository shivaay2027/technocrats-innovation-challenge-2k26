// ═══════════════════════════════════════════════════════════════
// SMARTFARM AI — FARM MEMORY MODULE  |  data.js
// Long-term Intelligence Data Layer
// ═══════════════════════════════════════════════════════════════

export const API = 'http://localhost:8001'

// ── Static Farm Profile ────────────────────────────────────────
export const FARM_PROFILE = {
  farmer_name: 'Ramesh Kumar',
  farm_name: 'Ramesh Family Farms',
  location: 'Nashik, Maharashtra',
  state: 'Maharashtra',
  lat: 20.011,
  lng: 73.76,
  size_ha: 12.0,
  soil_type: 'Black Cotton Soil',
  irrigation: 'Drip + Flood',
  preferred_crops: ['Tomato', 'Onion', 'Wheat', 'Soybean'],
  established_year: 2012,
  farm_id: 'FARM-MH-2012-0047',
  phone: '+91-98765-43210',
  aadhaar_masked: 'XXXX-XXXX-4321',
  bank: 'Bank of Maharashtra',
  pmkisan_enrolled: true,
  fasal_bima: true,
}

// ── Crop History (Long-Term Memory) ───────────────────────────
export const CROP_HISTORY = [
  {
    id: 'CROP-2022-KHARIF',
    crop: 'Soybean',
    variety: 'JS-335',
    sown_date: '2022-06-20',
    harvested_date: '2022-10-05',
    area_ha: 8.0,
    yield_tons: 18.4,
    input_cost_inr: 96000,
    revenue_inr: 185000,
    disease_incidents: ['Yellow Mosaic Virus'],
    irrigation_method: 'Flood',
    market_sold: 'Nashik APMC',
    sale_price_per_q: 4800,
    season: 'Kharif',
    weather_note: 'Below normal rainfall — 620mm vs 780mm avg.',
    ai_outcome_rating: 3,
    water_used_kl: 420,
    fertilizer_used: [
      { name: 'DAP', qty: 80, unit: 'kg', cost: 2400 },
      { name: 'Urea', qty: 60, unit: 'kg', cost: 1140 },
    ],
    pesticide_used: [
      { name: 'Imidacloprid', qty: 200, unit: 'ml', cost: 320 },
    ],
    labour_days: 58,
    equipment: ['Tractor (Plough)', 'Seed Drill'],
    market_transactions: [
      { date: '2022-10-10', qty_q: 184, price_q: 4800, mandi: 'Nashik APMC', net: 883200 },
    ],
  },
  {
    id: 'CROP-2023-RABI',
    crop: 'Wheat',
    variety: 'Sharbati GW-322',
    sown_date: '2023-11-15',
    harvested_date: '2024-03-20',
    area_ha: 10.0,
    yield_tons: 45.0,
    input_cost_inr: 120000,
    revenue_inr: 250000,
    disease_incidents: ['Aphids (Low)'],
    irrigation_method: 'Flood',
    market_sold: 'Malegaon Mandi',
    sale_price_per_q: 2275,
    season: 'Rabi',
    weather_note: 'Good winter chill — 12°C avg night temp boosted grain fill.',
    ai_outcome_rating: 4,
    water_used_kl: 680,
    fertilizer_used: [
      { name: 'NPK 12-32-16', qty: 100, unit: 'kg', cost: 2800 },
      { name: 'Urea (top-dress)', qty: 80, unit: 'kg', cost: 1520 },
      { name: 'Zinc Sulphate', qty: 10, unit: 'kg', cost: 450 },
    ],
    pesticide_used: [
      { name: 'Chlorpyrifos', qty: 500, unit: 'ml', cost: 620 },
      { name: 'Propiconazole', qty: 300, unit: 'ml', cost: 510 },
    ],
    labour_days: 72,
    equipment: ['Tractor (Plough)', 'Combine Harvester'],
    market_transactions: [
      { date: '2024-03-25', qty_q: 450, price_q: 2275, mandi: 'Malegaon Mandi', net: 1023750 },
    ],
  },
  {
    id: 'CROP-2024-KHARIF',
    crop: 'Tomato',
    variety: 'Arka Rakshak (Hybrid)',
    sown_date: '2024-06-10',
    harvested_date: '2024-09-15',
    area_ha: 2.0,
    yield_tons: 40.0,
    input_cost_inr: 80000,
    revenue_inr: 320000,
    disease_incidents: ['Early Blight', 'Spider Mites'],
    irrigation_method: 'Drip',
    market_sold: 'Nashik APMC',
    sale_price_per_q: 1800,
    season: 'Kharif',
    weather_note: 'Early market arrival secured premium price before glut.',
    ai_outcome_rating: 5,
    water_used_kl: 290,
    fertilizer_used: [
      { name: 'NPK 19-19-19', qty: 25, unit: 'kg', cost: 1100 },
      { name: 'Calcium Nitrate', qty: 20, unit: 'kg', cost: 960 },
      { name: 'Potassium Schoenite', qty: 15, unit: 'kg', cost: 750 },
    ],
    pesticide_used: [
      { name: 'Mancozeb 75%', qty: 600, unit: 'g', cost: 480 },
      { name: 'Abamectin', qty: 200, unit: 'ml', cost: 720 },
    ],
    labour_days: 95,
    equipment: ['Drip System', 'Pesticide Sprayer'],
    market_transactions: [
      { date: '2024-08-20', qty_q: 200, price_q: 2200, mandi: 'Nashik APMC', net: 440000 },
      { date: '2024-09-10', qty_q: 200, price_q: 1400, mandi: 'Nashik APMC', net: 280000 },
    ],
  },
  {
    id: 'CROP-2024-RABI',
    crop: 'Onion',
    variety: 'Nashik Red (N-2-4-1)',
    sown_date: '2024-11-05',
    harvested_date: '2025-03-10',
    area_ha: 5.0,
    yield_tons: 120.0,
    input_cost_inr: 150000,
    revenue_inr: 180000,
    disease_incidents: ['Purple Blotch', 'Stemphylium Blight'],
    irrigation_method: 'Drip',
    market_sold: 'Lasalgaon APMC',
    sale_price_per_q: 620,
    season: 'Rabi',
    weather_note: 'Unseasonal rain at harvest raised moisture — price crash at APMC.',
    ai_outcome_rating: 2,
    water_used_kl: 510,
    fertilizer_used: [
      { name: 'DAP', qty: 100, unit: 'kg', cost: 3000 },
      { name: 'MOP', qty: 60, unit: 'kg', cost: 1020 },
      { name: 'Urea', qty: 50, unit: 'kg', cost: 950 },
      { name: 'Boron', qty: 5, unit: 'kg', cost: 400 },
    ],
    pesticide_used: [
      { name: 'Mancozeb 75%', qty: 800, unit: 'g', cost: 640 },
      { name: 'Carbendazim', qty: 400, unit: 'g', cost: 380 },
      { name: 'Propiconazole', qty: 250, unit: 'ml', cost: 425 },
    ],
    labour_days: 140,
    equipment: ['Drip System', 'Tractor (Ridger)'],
    market_transactions: [
      { date: '2025-03-15', qty_q: 600, price_q: 620, mandi: 'Lasalgaon APMC', net: 372000 },
      { date: '2025-03-22', qty_q: 600, price_q: 590, mandi: 'Lasalgaon APMC', net: 354000 },
    ],
  },
]

// ── Irrigation / Water Usage Events ───────────────────────────
export const IRRIGATION_EVENTS = [
  { date: '2025-04-03', zone: 'Zone A (Onion)', method: 'Drip', duration_hrs: 3.5, water_kl: 12.4, stage: 'Bulb Development', status: 'completed' },
  { date: '2025-04-03', zone: 'Zone B (Wheat)', method: 'Flood', duration_hrs: 2.0, water_kl: 48.0, stage: 'Grain Fill', status: 'completed' },
  { date: '2025-04-02', zone: 'Zone A (Onion)', method: 'Drip', duration_hrs: 3.5, water_kl: 12.4, stage: 'Bulb Development', status: 'completed' },
  { date: '2025-04-01', zone: 'Zone C (Tomato)', method: 'Drip', duration_hrs: 4.0, water_kl: 9.8, stage: 'Flowering', status: 'completed' },
  { date: '2025-03-30', zone: 'Zone A (Onion)', method: 'Drip', duration_hrs: 3.0, water_kl: 10.6, stage: 'Bulb Development', status: 'completed' },
  { date: '2025-03-28', zone: 'Zone B (Wheat)', method: 'Flood', duration_hrs: 2.5, water_kl: 60.0, stage: 'Milky Stage', status: 'completed' },
]

// ── Pest & Disease History ─────────────────────────────────────
export const DISEASE_HISTORY = [
  { id: 'D-001', date: '2025-04-02', crop: 'Onion (Current)', disease: 'Purple Blotch', severity: 'Medium', zone: 'Block C', action_taken: 'Mancozeb 75% @ 2.5g/L sprayed', resolved: false, chemical_cost: 640 },
  { id: 'D-002', date: '2025-03-15', crop: 'Onion (Current)', disease: 'Thrips Infestation', severity: 'High', zone: 'Block A & B', action_taken: 'Fipronil 5% SC applied. Sticky traps deployed.', resolved: true, chemical_cost: 980 },
  { id: 'D-003', date: '2024-08-25', crop: 'Tomato', disease: 'Early Blight', severity: 'Medium', zone: 'Block D', action_taken: 'Chlorothalonil spray + removed infected lower leaves', resolved: true, chemical_cost: 520 },
  { id: 'D-004', date: '2024-07-10', crop: 'Tomato', disease: 'Spider Mites', severity: 'Low', zone: 'Block D', action_taken: 'Abamectin 1.9% EC applied', resolved: true, chemical_cost: 720 },
  { id: 'D-005', date: '2022-08-12', crop: 'Soybean', disease: 'Yellow Mosaic Virus', severity: 'High', zone: 'Field 1', action_taken: 'Infected plants uprooted. No chemical. Yield loss ~18%.', resolved: true, chemical_cost: 0 },
]

// ── Weather History ────────────────────────────────────────────
export const WEATHER_HISTORY = [
  { season: 'Kharif 2022', period: 'Jun–Oct 2022', avg_temp: 27.4, rainfall_mm: 620, humidity_pct: 72, frost_days: 0, notable: 'Below-normal rainfall. Drought stress in Aug.' },
  { season: 'Rabi 2022-23', period: 'Nov 2022–Mar 2023', avg_temp: 19.2, rainfall_mm: 48, humidity_pct: 55, frost_days: 3, notable: 'Good fog cover. Ideal for Rabi cereals.' },
  { season: 'Kharif 2023', period: 'Jun–Oct 2023', avg_temp: 28.1, rainfall_mm: 830, humidity_pct: 78, frost_days: 0, notable: 'Excess rain in Sep caused fungal surge.' },
  { season: 'Rabi 2023-24', period: 'Nov 2023–Mar 2024', avg_temp: 18.6, rainfall_mm: 55, humidity_pct: 52, frost_days: 5, notable: 'Best winter in 5 yrs. Strong grain fill.' },
  { season: 'Kharif 2024', period: 'Jun–Sep 2024', avg_temp: 29.0, rainfall_mm: 760, humidity_pct: 75, frost_days: 0, notable: 'Even distribution. Good for Tomato yield.' },
  { season: 'Rabi 2024-25', period: 'Nov 2024–Mar 2025', avg_temp: 20.1, rainfall_mm: 92, humidity_pct: 64, frost_days: 2, notable: 'Unseasonal rain in Feb. Onion moisture issues.' },
]

// ── Soil Readings (Time-Series Memory) ────────────────────────
export const SOIL_READINGS = [
  { date: '2022-04-10', nitrogen: 62, phosphorus: 34, potassium: 50, ph: 6.7, organic_carbon: 0.68, ec: 0.42 },
  { date: '2023-05-10', nitrogen: 55, phosphorus: 30, potassium: 45, ph: 6.8, organic_carbon: 0.60, ec: 0.45 },
  { date: '2024-05-12', nitrogen: 48, phosphorus: 28, potassium: 40, ph: 6.9, organic_carbon: 0.51, ec: 0.50 },
  { date: '2025-01-20', nitrogen: 42, phosphorus: 25, potassium: 38, ph: 7.1, organic_carbon: 0.45, ec: 0.54 },
]

// ── IoT / Sensor Events (Short-Term Memory stream) ────────────
export const IOT_EVENTS = [
  { ts: '2025-04-03T18:00', type: 'soil_moisture', value: '38%', zone: 'Zone A', status: 'normal' },
  { ts: '2025-04-03T18:00', type: 'temperature',   value: '31°C', zone: 'Ambient', status: 'normal' },
  { ts: '2025-04-03T06:00', type: 'irrigation',    value: '2.4L/plant', zone: 'Zone B', status: 'completed' },
  { ts: '2025-04-02T14:30', type: 'pest_trap',     value: '12 pests/trap', zone: 'Block C', status: 'alert' },
  { ts: '2025-04-02T08:00', type: 'soil_moisture', value: '29%', zone: 'Zone C', status: 'low' },
  { ts: '2025-04-01T18:00', type: 'rainfall',      value: '0mm', zone: 'Farm', status: 'dry' },
]

// ── Voice / Assistant Interaction Log (Short-Term Memory) ─────
export const INTERACTION_LOG = [
  { ts: '2025-04-03T09:15', query: 'What is the onion price in Lasalgaon today?', intent: 'mandi_price', outcome: 'Answered ₹640/q. Farmer noted price improved vs last week.' },
  { ts: '2025-04-02T07:30', query: 'My tomato leaves are turning yellow.', intent: 'disease_detect', outcome: 'Gemini detected Nitrogen deficiency. Urea top-dress recommended.' },
  { ts: '2025-04-01T11:00', query: 'Government scheme for irrigation pump?', intent: 'scheme_info', outcome: 'PMKSY scheme explained. Farmer eligibility confirmed.' },
  { ts: '2025-03-28T16:45', query: 'Best crop to sow in June on my black cotton soil?', intent: 'crop_recommend', outcome: 'Soybean & Cotton recommended. Farmer confirmed Soybean preference.' },
  { ts: '2025-03-20T08:10', query: 'What did I grow last Kharif season?', intent: 'memory_query', outcome: 'Retrieved: Tomato (Arka Rakshak) on 2.0 ha, yield 40t, revenue ₹3.2L, AI rating 5/5.' },
  { ts: '2025-03-10T14:00', query: 'How much urea did I use last wheat cycle?', intent: 'memory_query', outcome: 'Retrieved: Urea 80 kg (top-dress) @ ₹1,520 in Rabi 2023-24 wheat cycle.' },
]

// ── Feedback History (Reinforcement Loop) ─────────────────────
export const FEEDBACK_LOG = [
  { id: 'FB-001', date: '2024-10-01', recommendation: 'Tomato — Early market sale', rating: 5, outcome: 'Confirmed — got ₹1,800/q before glut', followed: true },
  { id: 'FB-002', date: '2024-03-25', recommendation: 'Wheat foliar urea at tillering', rating: 4, outcome: 'Yield improved by ~8% vs previous season', followed: true },
  { id: 'FB-003', date: '2023-10-10', recommendation: 'Hold Soybean — price will rise', rating: 2, outcome: 'Price fell further — farmer sold at loss', followed: false },
  { id: 'FB-004', date: '2025-02-05', recommendation: 'Spray Mancozeb for Onion blight', rating: 3, outcome: 'Partially effective — continued disease spread', followed: true },
]

// ── AI Accuracy over seasons (ML improvement chart data) ──────
export const AI_ACCURACY_TREND = [
  { season: 'Kharif 2022', accuracy: 62, rating: 3, crop: 'Soybean' },
  { season: 'Rabi 2023', accuracy: 74, rating: 4, crop: 'Wheat' },
  { season: 'Kharif 2024', accuracy: 91, rating: 5, crop: 'Tomato' },
  { season: 'Rabi 2025', accuracy: 45, rating: 2, crop: 'Onion' },
]

// ── Cross-Farm Regional Benchmarks (Anonymized) ───────────────
export const REGIONAL_BENCHMARKS = [
  { metric: 'Tomato Yield / Ha', your_farm: '20.0 t/ha', region_avg: '16.5 t/ha', rank: 'Top 15%' },
  { metric: 'Onion Yield / Ha', your_farm: '24.0 t/ha', region_avg: '22.0 t/ha', rank: 'Top 30%' },
  { metric: 'Wheat Yield / Ha', your_farm: '4.5 t/ha', region_avg: '4.1 t/ha', rank: 'Top 25%' },
  { metric: 'Water Use Efficiency', your_farm: '3.8 kg/L', region_avg: '2.9 kg/L', rank: 'Top 10%' },
  { metric: 'Input Cost / Ha', your_farm: '₹14,200', region_avg: '₹16,800', rank: 'Efficient' },
]

// ── Memory Layer Definitions (for Architecture view) ──────────
export const MEMORY_LAYERS = [
  {
    layer: 'Short-Term Memory',
    color: 'blue',
    icon: 'zap',
    desc: "Current session context — today's sensor readings, voice queries, and active crop status. Retained for 7 days.",
    items: ['Live IoT sensor stream', 'Voice assistant chat history', 'Active crop growth stage', "Today's weather & alerts"],
  },
  {
    layer: 'Long-Term Memory',
    color: 'green',
    icon: 'database',
    desc: 'Persistent historical records — all crop cycles, soil tests, market transactions, and decisions since farm onboarding.',
    items: ['Full crop history (all seasons)', 'Soil test time-series', 'Market transaction ledger', 'Disease incident log'],
  },
  {
    layer: 'Semantic Memory',
    color: 'purple',
    icon: 'brain',
    desc: 'AI-derived patterns and insights — what works for this specific farm, extracted from all historical data.',
    items: ['Crop success probability models', 'Soil health trajectory', 'Irrigation efficiency scores', 'Market timing intelligence'],
  },
]

// ── Q&A memory-based questions for the Voice/Chat interface ───
export const MEMORY_QA_EXAMPLES = [
  { q: 'What did I grow last Kharif season?', category: 'crop_history' },
  { q: 'How much water did I use for Tomato?', category: 'irrigation' },
  { q: 'Which crop gave the highest profit?', category: 'finance' },
  { q: 'What diseases affected my Onion crop?', category: 'disease' },
  { q: 'How much fertilizer did I use for Wheat?', category: 'inputs' },
  { q: 'How many labour days for Tomato season?', category: 'labour' },
]

// ── Payload for backend API calls ─────────────────────────────
export const MEMORY_API_PAYLOAD = {
  farm_profile: FARM_PROFILE,
  crop_history: CROP_HISTORY.map(c => ({
    id: c.id, crop: c.crop, variety: c.variety,
    sown_date: c.sown_date, harvested_date: c.harvested_date,
    area_ha: c.area_ha, yield_tons: c.yield_tons,
    input_cost_inr: c.input_cost_inr, revenue_inr: c.revenue_inr,
    disease_incidents: c.disease_incidents,
    irrigation_method: c.irrigation_method, notes: c.weather_note,
    season: c.season,
  })),
  soil_readings: SOIL_READINGS.map(s => ({
    date: s.date, nitrogen: s.nitrogen, phosphorus: s.phosphorus,
    potassium: s.potassium, ph: s.ph, organic_carbon: s.organic_carbon,
  })),
  event_count: IOT_EVENTS.length + INTERACTION_LOG.length + FEEDBACK_LOG.length,
  total_seasons: CROP_HISTORY.length,
}
