'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Tractor, Search, Filter, CalendarDays, ShieldCheck, Shield, Users,
  MapPin, Star, Check, Phone, Wrench, Zap, Package, 
  Settings, Truck, X, PlusCircle, ArrowRight
} from 'lucide-react'

// ── HUGE MOCK DATASET (Equipment Hub) ──
const initialEquipment = [
  { id: 101, name: 'Mahindra 575 DI', type: 'Tractor', hp: '45 HP', priceHour: 800, priceDay: 4500, rating: 4.8, reviews: 112, owner: 'Raju Patel', ownerPhone: '919000000001', distance: '2.4 km', img: 'tractor', operatorIncluded: true, available: true, aiReliability: 96 },
  { id: 102, name: 'Swaraj 744 FE', type: 'Tractor', hp: '48 HP', priceHour: 750, priceDay: 4200, rating: 4.6, reviews: 84, owner: 'Singh AgriCorp', ownerPhone: '919000000002', distance: '5.1 km', img: 'tractor', operatorIncluded: false, available: true, aiReliability: 92 },
  { id: 103, name: 'DJI Agras T40', type: 'Drone', hp: 'Battery', priceHour: 1500, priceDay: 8000, rating: 4.9, reviews: 45, owner: 'Kisan Tech', ownerPhone: '919000000003', distance: '12.0 km', img: 'drone', operatorIncluded: true, available: true, aiReliability: 99 },
  { id: 104, name: 'John Deere Harvester', type: 'Harvester', hp: '75 HP', priceHour: 2500, priceDay: 15000, rating: 4.7, reviews: 29, owner: 'Amit Singh', ownerPhone: '919000000004', distance: '8.5 km', img: 'harvester', operatorIncluded: true, available: false, aiReliability: 88 },
  { id: 105, name: 'Heavy Duty Rotavator', type: 'Implement', hp: 'N/A', priceHour: 300, priceDay: 1800, rating: 4.5, reviews: 56, owner: 'Village Co-op', ownerPhone: '919000000005', distance: '1.5 km', img: 'implement', operatorIncluded: false, available: true, aiReliability: 94 },
  { id: 106, name: 'Kartar 4000', type: 'Harvester', hp: '101 HP', priceHour: 2800, priceDay: 16500, rating: 4.9, reviews: 67, owner: 'Balvinder S.', ownerPhone: '919000000006', distance: '22.0 km', img: 'harvester', operatorIncluded: true, available: true, aiReliability: 97 },
]

// ── MAIN APPLICATION COMPONENT ──
export default function EquipmentHub() {
  const [activeTab, setActiveTab] = useState('find') // 'find', 'dashboard', 'list'
  
  const [equipmentList, setEquipmentList] = useState(initialEquipment)
  
  const [bookings, setBookings] = useState([
    { id: 501, equipment: initialEquipment[0], date: 'Oct 26, 2026', duration: '2 Days', amount: 9000, status: 'Upcoming', as: 'Renter' }
  ])
  
  const [myProfileId, setMyProfileId] = useState(null)
  const [isLoaded, setIsLoaded] = useState(false)

  // Load from localStorage safely post-hydration
  useEffect(() => {
    const savedEq = localStorage.getItem('smartfarm_equipment')
    const savedBookings = localStorage.getItem('smartfarm_eq_bookings')
    const savedProfile = localStorage.getItem('smartfarm_myEqOwnerId')
    
    if (savedEq) setEquipmentList(JSON.parse(savedEq))
    if (savedBookings) setBookings(JSON.parse(savedBookings))
    if (savedProfile) setMyProfileId(parseInt(savedProfile))
    
    setIsLoaded(true)
  }, [])

  // Sync to localStorage only AFTER loading is complete
  useEffect(() => {
    if (isLoaded) localStorage.setItem('smartfarm_equipment', JSON.stringify(equipmentList))
  }, [equipmentList, isLoaded])
  
  useEffect(() => {
    if (isLoaded) localStorage.setItem('smartfarm_eq_bookings', JSON.stringify(bookings))
  }, [bookings, isLoaded])

  const handleBooking = (eqId, durationType, units, date) => {
    const eq = equipmentList.find(e => e.id === eqId)
    const amount = durationType === 'Hour' ? eq.priceHour * units : eq.priceDay * units
    
    setBookings([{ 
      id: Math.floor(Math.random()*10000), 
      equipment: eq, 
      date: date || 'Tomorrow',
      duration: `${units} ${durationType}(s)`,
      amount: amount,
      status: 'Pending',
      as: 'Renter'
    }, ...bookings])
    
    setEquipmentList(equipmentList.map(e => e.id === eqId ? {...e, available: false} : e))
    
    // Auto-open WhatsApp message directly to owner
    const targetPhone = eq.ownerPhone || '919999999999';
    const cleanPhone = targetPhone.replace(/\D/g, ''); 
    const finalPhone = cleanPhone.length === 10 ? '91' + cleanPhone : cleanPhone;
    
    const msg = `Namaste ${eq.owner},\nI would like to rent your *${eq.name}* for ${units} ${durationType}(s) starting ${date || 'Tomorrow'}.\nThe platform shows ₹${amount}. Please confirm!`;
    window.open(`https://wa.me/${finalPhone}?text=${encodeURIComponent(msg)}`, '_blank');
  }

  const handleRemoveProfile = () => {
    if(confirm('Are you sure you want to remove your listed equipment?')) {
      setEquipmentList(equipmentList.filter(e => e.id !== myProfileId))
      setMyProfileId(null)
      localStorage.removeItem('smartfarm_myEqOwnerId')
    }
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-20">
      {/* HEADER & NAV */}
      <div className="bg-gradient-to-r from-amber-700 via-amber-600 to-amber-700 rounded-3xl p-6 text-white relative overflow-hidden shadow-2xl">
        <div className="absolute right-0 top-0 opacity-10 pointer-events-none p-4 mix-blend-overlay">
          <Tractor size={200} />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-bold uppercase tracking-wider text-amber-100 flex items-center gap-1.5 backdrop-blur-md border border-white/20">
                <ShieldCheck size={14}/> Verified Fleet
              </span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-black mb-3 tracking-tight">Equipment Rental Hub</h1>
            <p className="text-amber-100 text-sm md:text-base max-w-2xl leading-relaxed">
              Find, book, and deploy heavy agricultural machinery instantly. Reduce capital costs by renting tractors, drones, and harvesters exactly when you need them.
            </p>
          </div>
        </div>

        {/* TABS */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar relative z-10 bg-black/20 p-1.5 rounded-2xl w-fit backdrop-blur-md border border-white/10">
          <button onClick={() => setActiveTab('find')} className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${activeTab==='find' ? 'bg-white text-amber-800 shadow-lg' : 'text-amber-100 hover:bg-white/10 hover:text-white'}`}>
            <Search size={16}/> Rent Machinery
          </button>
          <button onClick={() => setActiveTab('dashboard')} className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${activeTab==='dashboard' ? 'bg-white text-amber-800 shadow-lg' : 'text-amber-100 hover:bg-white/10 hover:text-white'}`}>
            <Package size={16}/> My Dashboard
            {bookings.filter(b=>b.status==='Pending').length > 0 && (
              <span className="bg-rose-500 text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px] ml-1">{bookings.filter(b=>b.status==='Pending').length}</span>
            )}
          </button>
          <button onClick={() => setActiveTab('list')} className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${activeTab==='list' ? 'bg-white text-amber-800 shadow-lg' : 'text-amber-100 hover:bg-white/10 hover:text-white'}`}>
            <PlusCircle size={16}/> List Machinery
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
          {activeTab === 'find' && <FindEquipment equipment={equipmentList} onBooking={handleBooking} myProfileId={myProfileId} onRemoveProfile={handleRemoveProfile} />}
          {activeTab === 'dashboard' && <EquipmentDashboard bookings={bookings} />}
          {activeTab === 'list' && <ListMachineryFlow setEquipment={setEquipmentList} setActiveTab={setActiveTab} setMyProfileId={setMyProfileId} />}
        </motion.div>
      </AnimatePresence>

    </div>
  )
}

// ── 1. FIND EQUIPMENT VIEW (Marketplace) ──
function FindEquipment({ equipment, onBooking, myProfileId, onRemoveProfile }) {
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('All')
  const [showAvail, setShowAvail] = useState(false)
  const [reqOperator, setReqOperator] = useState(false)
  
  const [selectedEq, setSelectedEq] = useState(null)
  
  // Booking Modal State
  const [bookType, setBookType] = useState('Hour') // Hour or Day
  const [bookUnits, setBookUnits] = useState(1)
  const [bookDate, setBookDate] = useState('')

  const allTypes = ['All', ...new Set(equipment.map(e => e.type))]

  const filtered = equipment.filter(e =>
    (!showAvail || e.available) &&
    (!reqOperator || e.operatorIncluded) &&
    (typeFilter === 'All' || e.type === typeFilter) &&
    (e.name.toLowerCase().includes(search.toLowerCase()) || e.owner.toLowerCase().includes(search.toLowerCase()))
  ).sort((a,b) => b.aiReliability - a.aiReliability)

  const calcTotal = () => {
    if(!selectedEq) return 0;
    return bookType === 'Hour' ? selectedEq.priceHour * bookUnits : selectedEq.priceDay * bookUnits;
  }

  return (
    <div className="space-y-6">
      {myProfileId && equipment.some(e => e.id === myProfileId) && (
        <div className="bg-amber-50 border border-amber-200 rounded-3xl p-5 mb-6 flex justify-between items-center shadow-sm">
          <div>
            <h3 className="font-bold text-amber-900 tracking-tight">Your Equipment is Live</h3>
            <p className="text-sm font-medium text-amber-700 mt-0.5">Farmers can now discover and rent your machinery.</p>
          </div>
          <button onClick={onRemoveProfile} className="bg-rose-600 text-white font-bold text-sm px-5 py-2.5 rounded-xl hover:bg-rose-700 shadow-md transition-colors leading-none flex items-center justify-center">
            Delist Machinery
          </button>
        </div>
      )}

      {/* Controls */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex flex-col xl:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18}/>
          <input 
            value={search} onChange={e=>setSearch(e.target.value)} 
            placeholder="Search by model, brand, or owner..." 
            className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all shadow-inner"
          />
        </div>
        <div className="flex gap-2 pb-1 overflow-x-auto no-scrollbar items-center">
          <div className="h-8 w-px bg-slate-200 hidden xl:block mx-2"></div>
          {allTypes.map(t => (
            <button key={t} onClick={()=>setTypeFilter(t)} className={`px-4 py-2 font-bold text-xs whitespace-nowrap rounded-xl border transition-all ${typeFilter===t ? 'bg-amber-600 text-white border-amber-600 shadow-md shadow-amber-600/20' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}>
              {t}
            </button>
          ))}
          <div className="h-8 w-px bg-slate-200 mx-2"></div>
          <button onClick={()=>setShowAvail(!showAvail)} className={`px-4 py-2 font-bold text-xs whitespace-nowrap rounded-xl border transition-all flex items-center gap-1.5 ${showAvail ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'}`}>
            <Check size={14}/> Avail. Only
          </button>
          <button onClick={()=>setReqOperator(!reqOperator)} className={`px-4 py-2 font-bold text-xs whitespace-nowrap rounded-xl border transition-all flex items-center gap-1.5 ${reqOperator ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'}`}>
            <UsersOrCogIcon size={14}/> Operator Req.
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(eq => (
          <div key={eq.id} className="bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col group relative">
            
            {/* AI Trust Banner */}
            <div className={`absolute top-0 left-0 w-full h-1.5 ${eq.aiReliability > 95 ? 'bg-amber-500' : eq.aiReliability > 85 ? 'bg-blue-400' : 'bg-slate-300'}`}></div>
            
            {/* Visual Region */}
            <div className="h-48 bg-slate-100 flex items-center justify-center relative overflow-hidden p-6 border-b border-slate-100">
               {/* Aesthetic Pattern */}
               <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #cbd5e1 1px, transparent 0)', backgroundSize: '16px 16px'}}></div>
               
               <div className="relative z-10 w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300 border-4 border-slate-50 text-slate-300">
                 {eq.type === 'Tractor' ? <Tractor size={48}/> : eq.type === 'Drone' ? <Zap size={48}/> : eq.type === 'Harvester' ? <Settings size={48}/> : <Wrench size={48}/> }
               </div>
               
               {eq.operatorIncluded && (
                 <div className="absolute bottom-3 left-3 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-lg text-xs font-bold text-white flex items-center gap-1.5 shadow-sm border border-white/10">
                   <UsersOrCogIcon size={14}/> With Operator
                 </div>
               )}
            </div>

            {/* Content Details */}
            <div className="p-5 flex-1 flex flex-col">
              <div className="flex justify-between items-start mb-1">
                <h3 className="font-black text-xl text-slate-900 tracking-tight">{eq.name}</h3>
                <div className="flex items-center gap-1 bg-amber-50 text-amber-700 px-2 py-1 rounded text-xs font-bold border border-amber-200">
                  <Star size={12} className="fill-amber-500 text-amber-500"/> {eq.rating}
                </div>
              </div>
              
              <p className="text-xs font-bold text-emerald-600 flex items-center gap-1 mb-4"><ShieldCheck size={14}/> Verified Owner: {eq.owner}</p>
              
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="bg-slate-100 text-slate-600 text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-md border border-slate-200">{eq.type}</span>
                <span className="bg-slate-100 text-slate-600 text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-md border border-slate-200">{eq.hp}</span>
              </div>

              <div className="mt-auto space-y-2">
                <div className="flex justify-between items-center bg-slate-50 px-3 py-2 rounded-lg border border-slate-100">
                  <div className="text-slate-500 text-xs font-medium flex items-center gap-1"><MapPin size={14}/> Distance</div>
                  <div className="text-slate-800 font-bold text-xs">{eq.distance}</div>
                </div>
                <div className="flex justify-between items-center bg-slate-50 px-3 py-2 rounded-lg border border-slate-100">
                  <div className="text-slate-500 text-xs font-medium flex items-center gap-1"><Shield size={14}/> AI Reliability</div>
                  <div className="text-emerald-600 font-black text-xs">{eq.aiReliability}%</div>
                </div>
              </div>
            </div>

            {/* Price Footer */}
            <div className="p-5 bg-white border-t border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">Pricing starts at</span>
                <div className="font-black text-xl text-slate-800">₹{eq.priceHour}<span className="text-sm text-slate-500 font-semibold">/hr</span></div>
              </div>
              <button 
                onClick={() => setSelectedEq(eq)}
                disabled={!eq.available} 
                className={`py-3 px-6 rounded-xl font-bold text-sm transition-all shadow-sm flex items-center gap-2 ${eq.available ? 'bg-amber-600 text-white hover:bg-amber-700 shadow-amber-600/20' : 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'}`}
              >
                {eq.available ? 'Rent Now' : 'In Use'}
              </button>
            </div>
            
          </div>
        ))}
      </div>

      {/* Heavy Modal for Booking */}
      <AnimatePresence>
        {selectedEq && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
              
              <div className="p-6 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-black text-slate-800 tracking-tight">Book {selectedEq.name}</h2>
                  <p className="text-sm font-medium text-slate-500">Provided by {selectedEq.owner}</p>
                </div>
                <button onClick={() => setSelectedEq(null)} className="p-2 hover:bg-slate-200 rounded-full text-slate-500 transition-colors"><X size={20}/></button>
              </div>
              
              <div className="px-6 py-6 overflow-y-auto space-y-6">
                
                {/* Rate Selector */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Select Pricing Model</label>
                  <div className="grid grid-cols-2 gap-3">
                    <div onClick={()=>setBookType('Hour')} className={`cursor-pointer p-4 rounded-xl border-2 transition-all ${bookType==='Hour'?'border-amber-500 bg-amber-50':'border-slate-200 bg-white hover:border-slate-300'}`}>
                      <div className="text-sm font-bold text-slate-700 mb-1">Hourly Rate</div>
                      <div className="text-xl font-black text-slate-900">₹{selectedEq.priceHour} <span className="text-sm font-medium text-slate-500">/hr</span></div>
                    </div>
                    <div onClick={()=>setBookType('Day')} className={`cursor-pointer p-4 rounded-xl border-2 transition-all ${bookType==='Day'?'border-amber-500 bg-amber-50':'border-slate-200 bg-white hover:border-slate-300'}`}>
                      <div className="text-sm font-bold text-slate-700 mb-1">Daily Rate</div>
                      <div className="text-xl font-black text-slate-900">₹{selectedEq.priceDay} <span className="text-sm font-medium text-slate-500">/day</span></div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Duration ({bookType}s)</label>
                    <input type="number" min="1" value={bookUnits} onChange={(e)=>setBookUnits(e.target.value)} className="w-full border-2 border-slate-200 rounded-xl p-3 text-lg font-black bg-white focus:border-amber-500 focus:outline-none focus:ring-0 transition-colors" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Start Date</label>
                    <input type="date" value={bookDate} onChange={(e)=>setBookDate(e.target.value)} className="w-full border-2 border-slate-200 rounded-xl p-3 text-base font-bold bg-white focus:border-amber-500 focus:outline-none focus:ring-0 transition-colors" />
                  </div>
                </div>

                {/* Logistics */}
                <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl flex items-center gap-4">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center flex-shrink-0 shadow-sm border border-slate-100 text-blue-500"><Truck size={20}/></div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm">Delivery Required?</h4>
                    <p className="text-xs text-slate-500 mt-0.5">Equipment is {selectedEq.distance} away. You can negotiate delivery costs directly directly via WhatsApp after request.</p>
                  </div>
                </div>

              </div>

              {/* Escrow Footer */}
              <div className="mt-auto bg-white border-t border-slate-200 p-6">
                <div className="flex justify-between items-end mb-4">
                  <div>
                    <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 tracking-wider mb-1 uppercase"><ShieldCheck size={14}/> Escrow Protected</span>
                    <span className="text-sm font-medium text-slate-500">Funds held until machine arrives</span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-slate-400 tracking-wider block mb-0.5 uppercase">Est. Total</span>
                    <div className="text-3xl font-black text-slate-900 leading-none">₹{calcTotal()}</div>
                  </div>
                </div>
                
                <button 
                  onClick={() => {
                    onBooking(selectedEq.id, bookType, bookUnits, bookDate)
                    setSelectedEq(null)
                  }} 
                  className="w-full py-4 rounded-xl font-bold text-base bg-amber-600 text-white hover:bg-amber-700 transition-colors shadow-lg shadow-amber-600/20 flex justify-center items-center gap-2"
                >
                  <CalendarDays size={20}/> Request Booking
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

function UsersOrCogIcon(props) {
  return <Users {...props} /> // Stub wrapper using users for 'operator'
}


// ── 2. DASHBOARD VIEW ──
function EquipmentDashboard({ bookings }) {
  if(bookings.length === 0) {
    return (
      <div className="bg-white rounded-3xl border border-slate-200 p-16 text-center shadow-sm max-w-2xl mx-auto">
        <div className="w-20 h-20 bg-slate-50 border-2 border-slate-100 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-400">
          <Package size={32}/>
        </div>
        <h3 className="text-xl font-black text-slate-800 mb-2">My Machinery Ledger</h3>
        <p className="text-slate-500 text-sm">Rentals you make and equipment you hire out will appear here.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-black text-slate-800 px-1">Active Transactions</h2>
      {bookings.map(b => (
        <div key={b.id} className="bg-white p-5 md:p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
          
          <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${b.status==='Pending'?'bg-amber-400':b.status==='Completed'?'bg-emerald-500':'bg-blue-500'}`}></div>

          <div className="flex items-center gap-5 pl-2">
            <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-100 text-amber-600 flex items-center justify-center flex-shrink-0">
               {b.equipment.type === 'Tractor' ? <Tractor size={28}/> : <Wrench size={28}/>}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-black uppercase tracking-wider bg-slate-100 text-slate-600 px-2 py-0.5 rounded">{b.as}</span>
                <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded ${b.status==='Pending'?'bg-amber-100 text-amber-700':b.status==='Completed'?'bg-emerald-100 text-emerald-700':'bg-blue-100 text-blue-700'}`}>{b.status}</span>
              </div>
              <h4 className="font-black text-xl text-slate-800">{b.equipment.name}</h4>
              <p className="text-sm font-medium text-slate-500 mt-0.5 flex items-center gap-2">
                <CalendarDays size={14}/> {b.date} • {b.duration}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-4 border-t border-slate-100 md:border-none pt-4 md:pt-0">
             <div className="text-right md:mr-4">
               <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Escrow Amount</span>
               <span className="font-black text-slate-800 text-xl">₹{b.amount}</span>
             </div>
             
             {b.status === 'Pending' && (
               <button onClick={() => {
                 const phone = b.equipment.ownerPhone || '919999999999';
                 const cleanPhone = phone.replace(/\D/g, '').length === 10 ? '91' + phone.replace(/\D/g, '') : phone.replace(/\D/g, '');
                 window.open(`https://wa.me/${cleanPhone}`, '_blank');
               }} className="flex items-center gap-2 bg-[#25D366] text-white font-bold text-sm px-5 py-2.5 rounded-xl hover:bg-[#128C7E] shadow-md">
                 <Phone size={16}/> WhatsApp Call
               </button>
             )}
          </div>
        </div>
      ))}
    </div>
  )
}

// ── 3. LIST MACHINERY VIEW (Wizard) ──
function ListMachineryFlow({ setEquipment, setActiveTab, setMyProfileId }) {
  const [step, setStep] = useState('BASICS'); // BASICS, SPECS, PRICING, VERIFY
  
  // States
  const [phone, setPhone] = useState('')
  const [name, setName] = useState('')
  const [model, setModel] = useState('')
  const [type, setType] = useState('Tractor')
  const [hp, setHp] = useState('')
  const [priceH, setPriceH] = useState(800)
  const [priceD, setPriceD] = useState(4000)
  const [opIncluded, setOpIncluded] = useState(false)

  const handleSubmit = () => {
    setStep('VERIFY')
    setTimeout(() => {
      const newId = Math.floor(Math.random()*10000)
      setEquipment(prev => [{
        id: newId,
        name: model || 'Unnamed Machine',
        type: type,
        hp: hp || 'N/A',
        priceHour: parseInt(priceH),
        priceDay: parseInt(priceD),
        rating: 5.0,
        reviews: 0,
        owner: name || 'New Owner',
        ownerPhone: phone || '919999999999',
        distance: '0.0 km',
        img: 'tractor',
        operatorIncluded: opIncluded,
        available: true,
        aiReliability: 100
      }, ...prev])
      setMyProfileId(newId)
      localStorage.setItem('smartfarm_myEqOwnerId', newId)
      setActiveTab('find')
    }, 2000)
  }

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden max-w-5xl mx-auto flex flex-col md:flex-row min-h-[550px]">
       {/* Left side brand panel */}
       <div className="bg-slate-900 text-white p-8 md:w-1/3 flex flex-col justify-between">
        <div>
          <div className="inline-flex items-center justify-center w-12 h-12 bg-amber-500/20 text-amber-500 rounded-2xl border border-amber-500/30 mb-6">
            <Wrench size={24} />
          </div>
          <h2 className="text-2xl font-black mb-3">Monetize Your Machinery</h2>
          <p className="text-slate-400 text-sm leading-relaxed mb-8">
            List idle equipment. Earn robust rental income. SmartFarm handles verification and scheduling.
          </p>

          <div className="space-y-3">
             <div className="flex items-center gap-3 bg-white/5 p-3 rounded-xl border border-white/10">
               <ShieldCheck size={18} className="text-amber-400"/>
               <div><p className="text-xs font-bold">100% Secure</p><p className="text-[10px] text-slate-400">Escrow backed payments</p></div>
             </div>
             <div className="flex items-center gap-3 bg-white/5 p-3 rounded-xl border border-white/10">
               <MapPin size={18} className="text-blue-400"/>
               <div><p className="text-xs font-bold">Local Matching</p><p className="text-[10px] text-slate-400">Rent to nearby farmers</p></div>
             </div>
          </div>
        </div>
      </div>

       {/* Right side Wizard */}
       <div className="p-8 md:p-12 md:w-2/3 flex flex-col justify-center bg-slate-50 relative overflow-hidden">
          <AnimatePresence mode="wait">
             
             {step === 'BASICS' && (
                <motion.div key="b" initial={{opacity:0,x:20}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-20}} className="max-w-md mx-auto w-full space-y-5">
                   <div>
                     <h3 className="text-2xl font-black text-slate-800 mb-2">Owner Registration</h3>
                     <p className="text-slate-500 text-sm mb-6">Setup your owner identity.</p>
                   </div>
                   
                   <div><label className="block text-xs font-bold text-slate-500 uppercase mb-2">Full Name</label><input type="text" value={name} onChange={e=>setName(e.target.value)} placeholder="Owner Name" className="w-full border-2 border-slate-200 rounded-xl p-3 text-sm font-bold bg-white focus:border-amber-500 focus:outline-none"/></div>
                   <div><label className="block text-xs font-bold text-slate-500 uppercase mb-2">Mobile Number (For WhatsApp)</label><input type="tel" value={phone} onChange={e=>setPhone(e.target.value)} placeholder="+91 XXXXX XXXXX" className="w-full border-2 border-slate-200 rounded-xl p-3 text-sm font-bold bg-white focus:border-amber-500 focus:outline-none"/></div>
                   
                   <button onClick={()=>setStep('SPECS')} className="w-full py-4 rounded-xl font-bold text-sm bg-slate-900 text-white hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/20 mt-4">Next Step</button>
                </motion.div>
             )}

             {step === 'SPECS' && (
                <motion.div key="s" initial={{opacity:0,x:20}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-20}} className="max-w-md mx-auto w-full space-y-5">
                   <div className="flex items-center gap-2 mb-4 text-slate-400 text-sm font-bold cursor-pointer hover:text-slate-600" onClick={()=>setStep('BASICS')}><X size={16}/> Back</div>
                   <h3 className="text-2xl font-black text-slate-800 mb-2">Equipment Specs</h3>
                   
                   <div><label className="block text-xs font-bold text-slate-500 uppercase mb-2">Category</label>
                     <select value={type} onChange={e=>setType(e.target.value)} className="w-full border-2 border-slate-200 rounded-xl p-3 text-sm font-bold bg-white focus:border-amber-500 focus:outline-none">
                       <option>Tractor</option><option>Harvester</option><option>Drone</option><option>Implement</option>
                     </select>
                   </div>
                   
                   <div className="grid grid-cols-2 gap-3">
                     <div><label className="block text-xs font-bold text-slate-500 uppercase mb-2">Model Name</label><input type="text" value={model} onChange={e=>setModel(e.target.value)} placeholder="e.g. Swaraj 744" className="w-full border-2 border-slate-200 rounded-xl p-3 text-sm font-bold bg-white focus:border-amber-500 focus:outline-none"/></div>
                     <div><label className="block text-xs font-bold text-slate-500 uppercase mb-2">Capacity / HP</label><input type="text" value={hp} onChange={e=>setHp(e.target.value)} placeholder="e.g. 50 HP" className="w-full border-2 border-slate-200 rounded-xl p-3 text-sm font-bold bg-white focus:border-amber-500 focus:outline-none"/></div>
                   </div>

                   <label className="flex items-center gap-3 p-4 border-2 border-slate-200 rounded-xl cursor-pointer hover:border-amber-500 transition-colors">
                     <input type="checkbox" checked={opIncluded} onChange={e=>setOpIncluded(e.target.checked)} className="w-5 h-5 accent-amber-600"/>
                     <div>
                       <div className="text-sm font-bold text-slate-800">Operator Included</div>
                       <div className="text-xs text-slate-500 mt-0.5">Will you provide a driver/pilot?</div>
                     </div>
                   </label>
                   
                   <button onClick={()=>setStep('PRICING')} className="w-full py-4 rounded-xl font-bold text-sm bg-slate-900 text-white hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/20">Set Pricing</button>
                </motion.div>
             )}

             {step === 'PRICING' && (
                <motion.div key="p" initial={{opacity:0,x:20}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-20}} className="max-w-md mx-auto w-full space-y-5">
                   <div className="flex items-center gap-2 mb-4 text-slate-400 text-sm font-bold cursor-pointer hover:text-slate-600" onClick={()=>setStep('SPECS')}><X size={16}/> Back</div>
                   <h3 className="text-2xl font-black text-slate-800 mb-2">Set Your Rates</h3>
                   
                   <div><label className="block text-xs font-bold text-slate-500 uppercase mb-2">Hourly Rate (₹)</label><input type="number" value={priceH} onChange={e=>setPriceH(e.target.value)} className="w-full border-2 border-slate-200 rounded-xl p-4 text-lg font-black bg-white focus:border-amber-500 focus:outline-none"/></div>
                   <div><label className="block text-xs font-bold text-slate-500 uppercase mb-2">Daily Rate (₹)</label><input type="number" value={priceD} onChange={e=>setPriceD(e.target.value)} className="w-full border-2 border-slate-200 rounded-xl p-4 text-lg font-black bg-white focus:border-amber-500 focus:outline-none"/></div>
                   
                   <button onClick={handleSubmit} className="w-full py-4 rounded-xl font-bold text-sm bg-amber-600 text-white hover:bg-amber-700 transition-colors shadow-lg shadow-amber-600/20 text-lg">Push to Live Platform <ArrowRight size={18} className="inline ml-1"/></button>
                </motion.div>
             )}

             {step === 'VERIFY' && (
                <motion.div key="v" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="max-w-md mx-auto w-full text-center py-10">
                   <div className="w-20 h-20 border-4 border-amber-100 border-t-amber-600 rounded-full animate-spin mx-auto mb-6"></div>
                   <h3 className="text-xl font-black text-slate-800 mb-2">Verifying Details</h3>
                   <p className="text-slate-500 text-sm">Processing listing and synchronizing local datasets...</p>
                </motion.div>
             )}

          </AnimatePresence>
       </div>
    </div>
  )
}
