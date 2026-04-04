export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// ── Seed data (used only to initialise JSON files the first time) ──
const SEEDS = {
  'farm-profile': {
    farmer_name: 'Ramesh Kumar', farm_name: 'Ramesh Family Farms',
    location: 'Nashik, Maharashtra', state: 'Maharashtra',
    lat: 20.011, lng: 73.76, size_ha: 12.0, soil_type: 'Black Cotton Soil',
    irrigation: 'Drip + Flood', preferred_crops: ['Tomato', 'Onion', 'Wheat', 'Soybean'],
    established_year: 2012, farm_id: 'FARM-MH-2012-0047',
    phone: '+91-98765-43210', aadhaar_masked: 'XXXX-XXXX-4321',
    bank: 'Bank of Maharashtra', pmkisan_enrolled: true, fasal_bima: true,
  },
  'crop-history': [
    { id:'CROP-2022-KHARIF', crop:'Soybean', variety:'JS-335', sown_date:'2022-06-20', harvested_date:'2022-10-05', area_ha:8.0, yield_tons:18.4, input_cost_inr:96000, revenue_inr:185000, disease_incidents:['Yellow Mosaic Virus'], irrigation_method:'Flood', market_sold:'Nashik APMC', sale_price_per_q:4800, season:'Kharif', weather_note:'Below normal rainfall — 620mm vs 780mm avg.', ai_outcome_rating:3, water_used_kl:420, labour_days:58, fertilizer_used:[{name:'DAP',qty:80,unit:'kg',cost:2400},{name:'Urea',qty:60,unit:'kg',cost:1140}], pesticide_used:[{name:'Imidacloprid',qty:200,unit:'ml',cost:320}], equipment:['Tractor (Plough)','Seed Drill'], market_transactions:[{date:'2022-10-10',qty_q:184,price_q:4800,mandi:'Nashik APMC',net:883200}] },
    { id:'CROP-2023-RABI', crop:'Wheat', variety:'Sharbati GW-322', sown_date:'2023-11-15', harvested_date:'2024-03-20', area_ha:10.0, yield_tons:45.0, input_cost_inr:120000, revenue_inr:250000, disease_incidents:['Aphids (Low)'], irrigation_method:'Flood', market_sold:'Malegaon Mandi', sale_price_per_q:2275, season:'Rabi', weather_note:'Good winter chill — 12°C avg night temp boosted grain fill.', ai_outcome_rating:4, water_used_kl:680, labour_days:72, fertilizer_used:[{name:'NPK 12-32-16',qty:100,unit:'kg',cost:2800},{name:'Urea (top-dress)',qty:80,unit:'kg',cost:1520}], pesticide_used:[{name:'Chlorpyrifos',qty:500,unit:'ml',cost:620}], equipment:['Tractor (Plough)','Combine Harvester'], market_transactions:[{date:'2024-03-25',qty_q:450,price_q:2275,mandi:'Malegaon Mandi',net:1023750}] },
    { id:'CROP-2024-KHARIF', crop:'Tomato', variety:'Arka Rakshak (Hybrid)', sown_date:'2024-06-10', harvested_date:'2024-09-15', area_ha:2.0, yield_tons:40.0, input_cost_inr:80000, revenue_inr:320000, disease_incidents:['Early Blight','Spider Mites'], irrigation_method:'Drip', market_sold:'Nashik APMC', sale_price_per_q:1800, season:'Kharif', weather_note:'Early market arrival secured premium price before glut.', ai_outcome_rating:5, water_used_kl:290, labour_days:95, fertilizer_used:[{name:'NPK 19-19-19',qty:25,unit:'kg',cost:1100}], pesticide_used:[{name:'Mancozeb 75%',qty:600,unit:'g',cost:480}], equipment:['Drip System','Pesticide Sprayer'], market_transactions:[{date:'2024-08-20',qty_q:200,price_q:2200,mandi:'Nashik APMC',net:440000},{date:'2024-09-10',qty_q:200,price_q:1400,mandi:'Nashik APMC',net:280000}] },
    { id:'CROP-2024-RABI', crop:'Onion', variety:'Nashik Red (N-2-4-1)', sown_date:'2024-11-05', harvested_date:'2025-03-10', area_ha:5.0, yield_tons:120.0, input_cost_inr:150000, revenue_inr:180000, disease_incidents:['Purple Blotch','Stemphylium Blight'], irrigation_method:'Drip', market_sold:'Lasalgaon APMC', sale_price_per_q:620, season:'Rabi', weather_note:'Unseasonal rain at harvest raised moisture — price crash at APMC.', ai_outcome_rating:2, water_used_kl:510, labour_days:140, fertilizer_used:[{name:'DAP',qty:100,unit:'kg',cost:3000}], pesticide_used:[{name:'Mancozeb 75%',qty:800,unit:'g',cost:640}], equipment:['Drip System','Tractor (Ridger)'], market_transactions:[{date:'2025-03-15',qty_q:600,price_q:620,mandi:'Lasalgaon APMC',net:372000}] },
  ],
  'soil-readings': [
    { id:'SR-001', date:'2022-04-10', nitrogen:62, phosphorus:34, potassium:50, ph:6.7, organic_carbon:0.68, ec:0.42 },
    { id:'SR-002', date:'2023-05-10', nitrogen:55, phosphorus:30, potassium:45, ph:6.8, organic_carbon:0.60, ec:0.45 },
    { id:'SR-003', date:'2024-05-12', nitrogen:48, phosphorus:28, potassium:40, ph:6.9, organic_carbon:0.51, ec:0.50 },
    { id:'SR-004', date:'2025-01-20', nitrogen:42, phosphorus:25, potassium:38, ph:7.1, organic_carbon:0.45, ec:0.54 },
  ],
  'irrigation-events': [
    { id:'IR-001', date:'2025-04-03', zone:'Zone A (Onion)', method:'Drip', duration_hrs:3.5, water_kl:12.4, stage:'Bulb Development', status:'completed' },
    { id:'IR-002', date:'2025-04-03', zone:'Zone B (Wheat)', method:'Flood', duration_hrs:2.0, water_kl:48.0, stage:'Grain Fill', status:'completed' },
    { id:'IR-003', date:'2025-04-02', zone:'Zone A (Onion)', method:'Drip', duration_hrs:3.5, water_kl:12.4, stage:'Bulb Development', status:'completed' },
    { id:'IR-004', date:'2025-04-01', zone:'Zone C (Tomato)', method:'Drip', duration_hrs:4.0, water_kl:9.8, stage:'Flowering', status:'completed' },
  ],
  'disease-history': [
    { id:'D-001', date:'2025-04-02', crop:'Onion (Current)', disease:'Purple Blotch', severity:'Medium', zone:'Block C', action_taken:'Mancozeb 75% @ 2.5g/L sprayed', resolved:false, chemical_cost:640 },
    { id:'D-002', date:'2025-03-15', crop:'Onion (Current)', disease:'Thrips Infestation', severity:'High', zone:'Block A & B', action_taken:'Fipronil 5% SC applied. Sticky traps deployed.', resolved:true, chemical_cost:980 },
    { id:'D-003', date:'2024-08-25', crop:'Tomato', disease:'Early Blight', severity:'Medium', zone:'Block D', action_taken:'Chlorothalonil spray + removed infected lower leaves', resolved:true, chemical_cost:520 },
    { id:'D-004', date:'2024-07-10', crop:'Tomato', disease:'Spider Mites', severity:'Low', zone:'Block D', action_taken:'Abamectin 1.9% EC applied', resolved:true, chemical_cost:720 },
    { id:'D-005', date:'2022-08-12', crop:'Soybean', disease:'Yellow Mosaic Virus', severity:'High', zone:'Field 1', action_taken:'Infected plants uprooted. No chemical. Yield loss ~18%.', resolved:true, chemical_cost:0 },
  ],
  'weather-history': [
    { id:'WH-001', season:'Kharif 2022', period:'Jun–Oct 2022', avg_temp:27.4, rainfall_mm:620, humidity_pct:72, frost_days:0, notable:'Below-normal rainfall. Drought stress in Aug.' },
    { id:'WH-002', season:'Rabi 2022-23', period:'Nov 2022–Mar 2023', avg_temp:19.2, rainfall_mm:48, humidity_pct:55, frost_days:3, notable:'Good fog cover. Ideal for Rabi cereals.' },
    { id:'WH-003', season:'Kharif 2023', period:'Jun–Oct 2023', avg_temp:28.1, rainfall_mm:830, humidity_pct:78, frost_days:0, notable:'Excess rain in Sep caused fungal surge.' },
    { id:'WH-004', season:'Rabi 2023-24', period:'Nov 2023–Mar 2024', avg_temp:18.6, rainfall_mm:55, humidity_pct:52, frost_days:5, notable:'Best winter in 5 yrs. Strong grain fill.' },
    { id:'WH-005', season:'Kharif 2024', period:'Jun–Sep 2024', avg_temp:29.0, rainfall_mm:760, humidity_pct:75, frost_days:0, notable:'Even distribution. Good for Tomato yield.' },
    { id:'WH-006', season:'Rabi 2024-25', period:'Nov 2024–Mar 2025', avg_temp:20.1, rainfall_mm:92, humidity_pct:64, frost_days:2, notable:'Unseasonal rain in Feb. Onion moisture issues.' },
  ],
  'feedback-log': [
    { id:'FB-001', date:'2024-10-01', recommendation:'Tomato — Early market sale', rating:5, outcome:'Confirmed — got ₹1,800/q before glut', followed:true, helpful:null },
    { id:'FB-002', date:'2024-03-25', recommendation:'Wheat foliar urea at tillering', rating:4, outcome:'Yield improved by ~8% vs previous season', followed:true, helpful:null },
    { id:'FB-003', date:'2023-10-10', recommendation:'Hold Soybean — price will rise', rating:2, outcome:'Price fell further — farmer sold at loss', followed:false, helpful:null },
    { id:'FB-004', date:'2025-02-05', recommendation:'Spray Mancozeb for Onion blight', rating:3, outcome:'Partially effective — continued disease spread', followed:true, helpful:null },
  ],
  'iot-events': [
    { id:'IOT-001', ts:'2025-04-03T18:00', type:'soil_moisture', value:'38%', zone:'Zone A', status:'normal' },
    { id:'IOT-002', ts:'2025-04-03T18:00', type:'temperature', value:'31°C', zone:'Ambient', status:'normal' },
    { id:'IOT-003', ts:'2025-04-03T06:00', type:'irrigation', value:'2.4L/plant', zone:'Zone B', status:'completed' },
    { id:'IOT-004', ts:'2025-04-02T14:30', type:'pest_trap', value:'12 pests/trap', zone:'Block C', status:'alert' },
    { id:'IOT-005', ts:'2025-04-02T08:00', type:'soil_moisture', value:'29%', zone:'Zone C', status:'low' },
    { id:'IOT-006', ts:'2025-04-01T18:00', type:'rainfall', value:'0mm', zone:'Farm', status:'dry' },
  ],
};

// ── Helpers ────────────────────────────────────────────────────
function getFilePath(entity) {
  const dir = path.join(process.cwd(), 'data', 'memory');
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  return path.join(dir, `${entity}.json`);
}

function readEntity(entity) {
  const fp = getFilePath(entity);
  if (!fs.existsSync(fp)) {
    const seed = SEEDS[entity];
    if (!seed) return null;
    fs.writeFileSync(fp, JSON.stringify(seed, null, 2));
    return seed;
  }
  return JSON.parse(fs.readFileSync(fp, 'utf8'));
}

function writeEntity(entity, data) {
  fs.writeFileSync(getFilePath(entity), JSON.stringify(data, null, 2));
}

// ── Route Handlers ─────────────────────────────────────────────
export async function GET(req, { params }) {
  const { entity } = params;
  const data = readEntity(entity);
  if (data === null) return NextResponse.json({ error: 'Unknown entity' }, { status: 404 });
  return NextResponse.json(data);
}

export async function POST(req, { params }) {
  const { entity } = params;
  const body = await req.json();
  const current = readEntity(entity);
  if (!Array.isArray(current)) return NextResponse.json({ error: 'Entity is not an array' }, { status: 400 });
  const newItem = { id: body.id || `${entity.toUpperCase().slice(0,3)}-${Date.now()}`, ...body };
  current.unshift(newItem);
  writeEntity(entity, current);
  return NextResponse.json({ success: true, item: newItem });
}

export async function PUT(req, { params }) {
  const { entity } = params;
  const body = await req.json();
  const current = readEntity(entity);
  // For array entities: update by id. For object (farm-profile): replace entirely.
  if (Array.isArray(current)) {
    const updated = current.map(item => item.id === body.id ? { ...item, ...body } : item);
    writeEntity(entity, updated);
    return NextResponse.json({ success: true });
  } else {
    const merged = { ...current, ...body };
    writeEntity(entity, merged);
    return NextResponse.json({ success: true, data: merged });
  }
}

export async function DELETE(req, { params }) {
  const { entity } = params;
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  const current = readEntity(entity);
  if (!Array.isArray(current)) return NextResponse.json({ error: 'Entity is not an array' }, { status: 400 });
  const filtered = current.filter(item => item.id !== id);
  writeEntity(entity, filtered);
  return NextResponse.json({ success: true });
}
