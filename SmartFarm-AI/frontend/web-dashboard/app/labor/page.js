'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Users, Star, MapPin, Phone, Check, Search, Filter, CalendarDays, 
  Wallet, ShieldCheck, Map, Clock, BadgeCheck, X, Briefcase, 
  MessageSquare, ThumbsUp, Languages, Award
} from 'lucide-react'

// ── HUGE MOCK DATASET (AI Enriched) ──
const initialWorkers = [
  { id:1, name:'Suresh Yadav', phone:'919999999991', skills:['Harvesting','Sowing','Irrigation'], rating:4.9, reviews: 42, exp:'8 yrs', dist:'1.2 km', rate:650, available:true, lang:'Hindi', reliability: 98, aiMatch: 95, verified: true, avatar: 'SY', lastJob: 'Harvested Wheat' },
  { id:2, name:'Ramkali Devi', phone:'919999999992', skills:['Weeding','Transplanting'], rating:4.7, reviews: 31, exp:'5 yrs', dist:'3.1 km', rate:550, available:true, lang:'Hindi, Bhojpuri', reliability: 94, aiMatch: 88, verified: true, avatar: 'RD', lastJob: 'Paddy Transplanting' },
  { id:3, name:'Arjun Patil', phone:'919999999993', skills:['Tractor Operator','Spraying'], rating:4.8, reviews: 55, exp:'10 yrs', dist:'5.5 km', rate:850, available:false, lang:'Marathi, Hindi', reliability: 99, aiMatch: 92, verified: true, avatar: 'AP', lastJob: 'Pesticide Application' },
  { id:4, name:'Krishnamma S.', phone:'919999999994', skills:['Harvesting','Grading','Packing'], rating:4.6, reviews: 18, exp:'6 yrs', dist:'2.8 km', rate:600, available:true, lang:'Telugu, Kannada', reliability: 89, aiMatch: 85, verified: false, avatar: 'KS', lastJob: 'Tomato Grading' },
  { id:5, name:'Mohan Gawli', phone:'919999999995', skills:['Drone Operator','Spraying','Tech Equip'], rating:5.0, reviews: 12, exp:'3 yrs', dist:'8.2 km', rate:1200, available:true, lang:'Marathi, English', reliability: 100, aiMatch: 97, verified: true, avatar: 'MG', lastJob: 'Drone Spraying' },
  { id:6, name:'Fatima Shaikh', phone:'919999999996', skills:['Weeding','Sowing','Fertilization'], rating:4.5, reviews: 24, exp:'4 yrs', dist:'4.0 km', rate:500, available:true, lang:'Urdu, Hindi', reliability: 91, aiMatch: 81, verified: true, avatar: 'FS', lastJob: 'Fertilizer Spread' },
  { id:7, name:'Vijay Kumar', phone:'919999999997', skills:['Irrigation','Hard Labor','Tractor'], rating:4.9, reviews: 88, exp:'15 yrs', dist:'2.0 km', rate:700, available:true, lang:'Hindi, Punjabi', reliability: 96, aiMatch: 90, verified: true, avatar: 'VK', lastJob: 'Pipe Laying' },
  { id:8, name:'Sunita Meena', phone:'919999999998', skills:['Harvesting','Weeding'], rating:4.4, reviews: 9, exp:'2 yrs', dist:'6.0 km', rate:450, available:true, lang:'Hindi', reliability: 85, aiMatch: 75, verified: false, avatar: 'SM', lastJob: 'Cotton Picking' },
]

// ── MAIN APPLICATION COMPONENT ──
export default function LaborHub() {
  const [activeTab, setActiveTab] = useState('find') // 'find', 'bookings', 'register'
  
  // App-level state for demo interactions
  const [workers, setWorkers] = useState(initialWorkers)
  
  const [bookings, setBookings] = useState([
    { id: 101, worker: initialWorkers[0], date: 'Oct 24, 2026', status: 'Upcoming', type: 'Harvesting', amount: 650 },
    { id: 102, worker: initialWorkers[2], date: 'Oct 15, 2026', status: 'Completed', type: 'Spraying', amount: 850 }
  ])
  
  const [myProfileId, setMyProfileId] = useState(null)
  const [isLoaded, setIsLoaded] = useState(false)

  // Load from localStorage naturally post-hydration
  useEffect(() => {
    const savedWorkers = localStorage.getItem('smartfarm_workers')
    const savedBookings = localStorage.getItem('smartfarm_bookings')
    const savedProfile = localStorage.getItem('smartfarm_myProfileId')
    
    if (savedWorkers) setWorkers(JSON.parse(savedWorkers))
    if (savedBookings) setBookings(JSON.parse(savedBookings))
    if (savedProfile) setMyProfileId(parseInt(savedProfile))
    
    setIsLoaded(true)
  }, [])

  // Sync to localStorage only AFTER the initial loading pass is complete
  useEffect(() => {
    if (isLoaded) localStorage.setItem('smartfarm_workers', JSON.stringify(workers))
  }, [workers, isLoaded])
  
  useEffect(() => {
    if (isLoaded) localStorage.setItem('smartfarm_bookings', JSON.stringify(bookings))
  }, [bookings, isLoaded])

  const handleRemoveProfile = () => {
    if(confirm('Are you sure you want to remove your profile from the SmartFarm Marketplace?')) {
      setWorkers(workers.filter(w => w.id !== myProfileId))
      setMyProfileId(null)
      localStorage.removeItem('smartfarm_myProfileId')
    }
  }

  // Book a worker from the Find Tab
  const handleHire = (workerId, jobType, date) => {
    const worker = workers.find(w => w.id === workerId)
    setBookings([{ 
      id: Math.floor(Math.random()*10000), 
      worker, 
      date: date || 'Tomorrow', 
      status: 'Pending', 
      type: jobType || 'General Farm Work', 
      amount: worker.rate 
    }, ...bookings])
    
    // Mark as pending/booked locally
    setWorkers(workers.map(w => w.id === workerId ? {...w, available: false} : w))
    
    // Auto-open WhatsApp message directly to the real mobile number
    const targetPhone = worker.phone || '919999999999';
    // Format the mobile number to ensure it has 91 prefix if missing, WhatsApp requires country code usually without + but + is also supported
    const cleanPhone = targetPhone.replace(/\D/g, ''); 
    const finalPhone = cleanPhone.length === 10 ? '91' + cleanPhone : cleanPhone;
    
    // Construct the WhatsApp URI
    const msg = `Namaste ${worker.name},\nI would like to hire you for *${jobType || 'General Farm Work'}* on ${date || 'Tomorrow'}.\nI am offering ₹${worker.rate}/day via SmartFarm. Please confirm!`;
    const uri = `https://wa.me/${finalPhone}?text=${encodeURIComponent(msg)}`;
    window.open(uri, '_blank');
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-20">
      {/* HEADER & NAV */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-6 text-white relative overflow-hidden shadow-2xl">
        <div className="absolute right-0 top-0 opacity-10 pointer-events-none p-4">
          <Users size={180} />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 bg-white/10 rounded-full text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5 backdrop-blur-md">
                <ShieldCheck size={14}/> Verified Network
              </span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-black mb-3 tracking-tight">SmartFarm Labour Hub</h1>
            <p className="text-slate-300 text-sm md:text-base max-w-2xl leading-relaxed">
              Connect with reliable, skilled agricultural workers in your area. AI-matched for your specific farm needs based on proximity, skills, and past performance.
            </p>
          </div>
        </div>

        {/* TABS */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar relative z-10 bg-white/10 p-1.5 rounded-2xl w-fit backdrop-blur-md border border-white/10">
          <button onClick={() => setActiveTab('find')} className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${activeTab==='find' ? 'bg-white text-slate-900 shadow-lg' : 'text-slate-300 hover:bg-white/10 hover:text-white'}`}>
            <Search size={16}/> Hire Labour
          </button>
          <button onClick={() => setActiveTab('bookings')} className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${activeTab==='bookings' ? 'bg-white text-slate-900 shadow-lg' : 'text-slate-300 hover:bg-white/10 hover:text-white'}`}>
            <Briefcase size={16}/> My Bookings
            {bookings.filter(b=>b.status==='Pending').length > 0 && (
              <span className="bg-rose-500 text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px] ml-1">{bookings.filter(b=>b.status==='Pending').length}</span>
            )}
          </button>
          <button onClick={() => setActiveTab('register')} className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${activeTab==='register' ? 'bg-white text-slate-900 shadow-lg' : 'text-slate-300 hover:bg-white/10 hover:text-white'}`}>
            <Users size={16}/> Join Hub
          </button>
        </div>
      </div>

      {/* RENDER ACTIVE TAB */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === 'find' && <FindLabour workers={workers} onHire={handleHire} myProfileId={myProfileId} onRemoveProfile={handleRemoveProfile} />}
          {activeTab === 'bookings' && <MyBookings bookings={bookings} />}
          {activeTab === 'register' && <JoinHubFlow setWorkers={setWorkers} setActiveTab={setActiveTab} setMyProfileId={setMyProfileId} />}
        </motion.div>
      </AnimatePresence>

    </div>
  )
}

// ── 1. FIND LABOUR VIEW (The Marketplace) ──
function FindLabour({ workers, onHire, myProfileId, onRemoveProfile }) {
  const [search, setSearch] = useState('')
  const [skillFilter, setSkillFilter] = useState('All')
  const [showAvail, setShowAvail] = useState(false)
  const [selectedWorker, setSelectedWorker] = useState(null) // for booking modal
  
  const allSkills = ['All', ...new Set(workers.flatMap(w => w.skills))]

  const filtered = workers.filter(w =>
    (!showAvail || w.available) &&
    (skillFilter === 'All' || w.skills.includes(skillFilter)) &&
    (w.name.toLowerCase().includes(search.toLowerCase()) || w.skills.some(s=>s.toLowerCase().includes(search.toLowerCase())))
  ).sort((a,b) => b.aiMatch - a.aiMatch) // Sort by AI match score

  return (
    <div className="space-y-6">
      {myProfileId && workers.some(w => w.id === myProfileId) && (
        <div className="bg-rose-50 border border-rose-200 rounded-3xl p-5 mb-6 flex justify-between items-center shadow-sm">
          <div>
            <h3 className="font-bold text-rose-800 tracking-tight">Your Profile is Active</h3>
            <p className="text-sm font-medium text-rose-600 mt-0.5">You are currently visible to farmers in the marketplace.</p>
          </div>
          <button onClick={onRemoveProfile} className="bg-rose-600 text-white font-bold text-sm px-5 py-2.5 rounded-xl hover:bg-rose-700 shadow-md transition-colors leading-none flex items-center justify-center">
            Remove My Profile
          </button>
        </div>
      )}

      {/* Controls */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18}/>
          <input 
            value={search} onChange={e=>setSearch(e.target.value)} 
            placeholder="Search by worker name, skill, or location..." 
            className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all shadow-inner"
          />
        </div>
        <div className="flex gap-2 pb-1 overflow-x-auto no-scrollbar items-center">
          <div className="h-8 w-px bg-slate-200 hidden md:block mx-2"></div>
          {allSkills.map(s => (
            <button key={s} onClick={()=>setSkillFilter(s)} className={`px-4 py-2 font-bold text-xs whitespace-nowrap rounded-xl border transition-all ${skillFilter===s ? 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-600/20' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}>
              {s}
            </button>
          ))}
          <button onClick={()=>setShowAvail(!showAvail)} className={`ml-2 px-4 py-2 font-bold text-xs whitespace-nowrap rounded-xl border transition-all flex items-center gap-1.5 ${showAvail ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'}`}>
            <Filter size={14}/> Avail. Only
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filtered.map(w => (
          <div key={w.id} className="bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col group relative">
            
            {/* AI Match Banner */}
            <div className={`absolute top-0 left-0 w-full h-1.5 ${w.aiMatch > 90 ? 'bg-emerald-500' : w.aiMatch > 80 ? 'bg-amber-400' : 'bg-slate-300'}`}></div>
            
            {/* Top Stats */}
            <div className="p-5 pb-3 flex justify-between items-start">
               <div className="flex flex-col items-center">
                  <div className="w-16 h-16 rounded-2xl font-black text-2xl text-white flex items-center justify-center flex-shrink-0 bg-gradient-to-br from-slate-700 to-slate-900 shadow-md relative">
                    {w.avatar}
                    {w.verified && (
                      <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-0.5 shadow-sm">
                        <BadgeCheck size={20} className="text-blue-500"/>
                      </div>
                    )}
                  </div>
               </div>
               <div className="text-right">
                  <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 font-black text-sm border border-emerald-100">
                    <Award size={14}/> {w.aiMatch}% Match
                  </div>
                  <div className="mt-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider flex justify-end items-center gap-1">
                    <Star size={10} className="text-amber-400 fill-amber-400"/> {w.rating} ({w.reviews} Reviews)
                  </div>
               </div>
            </div>

            {/* Content */}
            <div className="px-5 flex-1 flex flex-col">
              <h3 className="font-black text-lg text-slate-900 mb-1">{w.name}</h3>
              {w.verified ? (
                <p className="text-xs font-bold text-emerald-600 flex items-center gap-1 mb-3"><ShieldCheck size={12}/> Aadhaar Verified ID</p>
              ) : (
                <p className="text-xs font-bold text-slate-400 flex items-center gap-1 mb-3"><Map size={12}/> Standard Profile</p>
              )}
              
              <div className="flex flex-wrap gap-1.5 mb-4">
                {w.skills.map(s=><span key={s} className="bg-slate-100 text-slate-600 text-[10px] font-bold tracking-wide uppercase px-2 py-1 rounded-lg border border-slate-200">{s}</span>)}
              </div>

              <div className="space-y-2 mt-auto">
                <div className="flex items-center justify-between text-xs font-medium text-slate-500">
                  <span className="flex items-center gap-1.5"><MapPin size={14} className="text-slate-400"/> {w.dist} away</span>
                  <span className="flex items-center gap-1.5"><Clock size={14} className="text-slate-400"/> {w.exp} exp</span>
                </div>
                <div className="flex items-center justify-between text-xs font-medium text-slate-500">
                  <span className="flex items-center gap-1.5"><ThumbsUp size={14} className="text-slate-400"/> {w.reliability}% Reliable</span>
                  <span className="flex items-center gap-1.5"><Languages size={14} className="text-slate-400"/> {w.lang}</span>
                </div>
              </div>
            </div>

            {/* Footer / Action */}
            <div className="mt-5 p-5 pt-4 bg-slate-50 border-t border-slate-100 flex items-end justify-between">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">Est. Wage</span>
                <div className="font-black text-xl text-slate-900">₹{w.rate}<span className="text-sm text-slate-500 font-semibold">/day</span></div>
              </div>
              <button 
                onClick={() => setSelectedWorker(w)}
                disabled={!w.available} 
                className={`py-2.5 px-5 rounded-xl font-bold text-sm transition-all shadow-sm flex items-center gap-2 ${w.available ? 'bg-emerald-600 text-white hover:bg-emerald-700 hover:shadow-emerald-600/20' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}
              >
                {w.available ? <><CalendarDays size={16}/> Hire</> : 'Booked'}
              </button>
            </div>
            
          </div>
        ))}
      </div>

      {/* Quick Booking Modal */}
      <AnimatePresence>
        {selectedWorker && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <motion.div 
               initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
               className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden"
            >
              <div className="p-6 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
                <h2 className="text-xl font-black text-slate-800">Hire {selectedWorker.name}</h2>
                <button onClick={() => setSelectedWorker(null)} className="p-2 hover:bg-slate-200 rounded-full text-slate-500 transition-colors"><X size={20}/></button>
              </div>
              <div className="p-6 space-y-5">
                <p className="text-sm text-slate-600 font-medium">Please confirm job details. We will hold the payment securely in escrow until job completion.</p>
                
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Job Type</label>
                  <select className="w-full border border-slate-200 rounded-xl p-3 text-sm font-bold bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none">
                    {selectedWorker.skills.map(s => <option key={s}>{s}</option>)}
                    <option>General Labour</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Date Needed</label>
                  <input type="date" className="w-full border border-slate-200 rounded-xl p-3 text-sm font-bold bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none" />
                </div>

                <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 flex justify-between items-center">
                   <div>
                     <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider block mb-1">Total Expected Wage</span>
                     <span className="text-emerald-600 text-xs font-medium block">Secured payment option enabled</span>
                   </div>
                   <div className="text-2xl font-black text-emerald-600">₹{selectedWorker.rate}</div>
                </div>

              </div>
              <div className="p-6 pt-0 flex gap-3">
                <button onClick={() => setSelectedWorker(null)} className="flex-1 py-3.5 rounded-xl font-bold text-sm bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors">Cancel</button>
                <button 
                  onClick={() => {
                    onHire(selectedWorker.id, selectedWorker.skills[0], 'Scheduled')
                    setSelectedWorker(null)
                  }} 
                  className="flex-1 py-3.5 rounded-xl font-bold text-sm bg-emerald-600 text-white hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-600/20 flex justify-center items-center gap-2"
                >
                  <Check size={18}/> Send Request
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ── 2. MY BOOKINGS VIEW ──
function MyBookings({ bookings }) {
  if(bookings.length === 0) {
    return (
      <div className="bg-white rounded-3xl border border-slate-200 p-16 text-center shadow-sm max-w-2xl mx-auto">
        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Briefcase size={32} className="text-slate-400"/>
        </div>
        <h3 className="text-xl font-bold text-slate-800 mb-2">No active bookings</h3>
        <p className="text-slate-500 text-sm">You haven't hired any labourers yet. Head over to the Find Labour tab to start hiring.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {bookings.map(b => (
        <div key={b.id} className="bg-white p-5 md:p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl font-black text-xl text-white flex items-center justify-center flex-shrink-0 bg-gradient-to-br from-slate-700 to-slate-900 shadow-sm">
              {b.worker.avatar}
            </div>
            <div>
              <h4 className="font-black text-lg text-slate-800 flex items-center gap-2">
                {b.worker.name} 
                <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full ${b.status==='Pending'?'bg-amber-100 text-amber-700':b.status==='Completed'?'bg-emerald-100 text-emerald-700':'bg-blue-100 text-blue-700'}`}>
                  {b.status}
                </span>
              </h4>
              <p className="text-sm font-medium text-slate-500 mt-1">{b.type} • {b.date}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4 border-t border-slate-100 md:border-none pt-4 md:pt-0">
             <div className="text-right md:mr-4">
               <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Agreed Wage</span>
               <span className="font-black text-slate-800 text-lg">₹{b.amount}</span>
             </div>
             
             {b.status === 'Pending' && (
               <button onClick={() => window.location.href = `tel:${b.worker.phone || '919999999999'}`} className="flex items-center gap-2 bg-slate-900 text-white font-bold text-sm px-5 py-2.5 rounded-xl hover:bg-slate-800 shadow-md">
                 <Phone size={16}/> Call
               </button>
             )}
             
             {b.status === 'Completed' && (
               <div className="flex gap-2">
                 <button className="flex items-center justify-center bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold text-sm w-11 h-11 py-2.5 rounded-xl hover:bg-emerald-100 transition-colors" title="Release Payment">
                   <Wallet size={18}/>
                 </button>
                 <button className="flex items-center justify-center bg-slate-50 text-slate-700 border border-slate-200 font-bold text-sm w-11 h-11 py-2.5 rounded-xl hover:bg-slate-100 transition-colors" title="Leave Review">
                   <MessageSquare size={18}/>
                 </button>
               </div>
             )}
          </div>
        </div>
      ))}
    </div>
  )
}

// ── 3. JOIN HUB VIEW (Onboarding Flow) ──
function JoinHubFlow({ setWorkers, setActiveTab, setMyProfileId }) {
  const [step, setStep] = useState('ROLE_SELECT'); // ROLE_SELECT, OTP, LABOUR_DETAILS, FARMER_DETAILS, VERIFICATION, SUCCESS_LABOUR, SUCCESS_FARMER
  const [role, setRole] = useState(null); // 'LABOURER', 'FARMER'
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [expectedOtp, setExpectedOtp] = useState('');

  // Form State
  const [name, setName] = useState('');
  const [wage, setWage] = useState(500);
  const [skills, setSelectedSkills] = useState(['Harvesting']);

  const handleRoleSelect = (r) => {
    setRole(r)
    setStep('OTP')
    setOtpSent(false)
    setOtp('')
  }

  const handleSendOtp = () => {
    if(phone.replace(/\D/g,'').length < 10) {
      alert("Please enter a valid 10-digit mobile number first.");
      return;
    }
    const generatedCode = Math.floor(1000 + Math.random() * 9000).toString();
    setExpectedOtp(generatedCode);
    setOtpSent(true);
    
    // Simulating SMS push logic for the hackathon prototype
    alert(`[Mock SMS Notification]\n\nSmartFarm Alert: Your verification code is ${generatedCode}. Do not share this with anyone.`);
  }

  const handleOtpSubmit = () => {
    if(!otpSent) {
      alert("Please click 'Send OTP' first.");
      return;
    }
    if(otp.trim() !== expectedOtp) {
      alert(`Invalid OTP. Please check the code sent to ${phone} and try again.`);
      return;
    }
    setStep(role === 'LABOURER' ? 'LABOUR_DETAILS' : 'FARMER_DETAILS')
  }

  const handleLabourSubmit = () => {
    setStep('VERIFICATION')
    setTimeout(() => {
      const newId = Math.floor(Math.random() * 10000)
      setStep('SUCCESS_LABOUR')
      setWorkers(prev => [{
        id: newId,
        name: name || 'Aman M.',
        phone: phone || '919999999999',
        skills: skills,
        rating: 5.0, reviews: 0, exp: '1 yr', dist: '0.5 km', rate: wage, available: true, lang: 'Hindi', reliability: 100, aiMatch: 99, verified: true, avatar: name ? name.substring(0,2).toUpperCase() : 'AM', lastJob: 'New Profile'
      }, ...prev])
      setMyProfileId(newId)
      localStorage.setItem('smartfarm_myProfileId', newId)
    }, 2000)
  }

  const handleFarmerSubmit = () => {
    setStep('SUCCESS_FARMER')
  }

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden max-w-5xl mx-auto flex flex-col md:flex-row min-h-[550px]">
       {/* Left side static brand panel */}
       <div className="bg-slate-900 text-white p-8 md:w-1/3 flex flex-col justify-between">
        <div>
          <div className="inline-flex items-center justify-center w-12 h-12 bg-white/10 rounded-2xl border border-white/20 mb-6">
            <Users size={24} className="text-emerald-400"/>
          </div>
          <h2 className="text-2xl font-black mb-3">Join SmartFarm Hub</h2>
          <p className="text-slate-400 text-sm leading-relaxed mb-8">
            The largest verified agricultural marketplace. Farmers find reliable help. Labourers find consistent, fair work.
          </p>

          <div className="mt-8 space-y-4">
             <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
               <div className="flex items-center gap-2 mb-2">
                 <ShieldCheck size={16} className="text-emerald-400"/> <span className="font-bold text-sm">Verified Network</span>
               </div>
               <p className="text-xs text-slate-400">All users undergo identity and phone verification for trust.</p>
             </div>
          </div>
        </div>

        <div className="mt-8 p-4 bg-emerald-900/30 rounded-2xl border border-emerald-500/20 shadow-inner">
          <p className="text-xs font-medium text-emerald-200/80 mb-2">Voice Support Enabled</p>
          <button className="w-full flex items-center justify-center gap-2 bg-emerald-600 py-3 rounded-xl font-bold text-sm hover:bg-emerald-500 transition-colors">
            Tap to Speak
          </button>
        </div>
      </div>

       {/* Right side Wizard */}
       <div className="p-8 md:p-12 md:w-2/3 flex flex-col justify-center bg-slate-50 relative overflow-hidden">
          <AnimatePresence mode="wait">

             {step === 'ROLE_SELECT' && (
                <motion.div key="role" initial={{opacity:0,x:20}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-20}} className="max-w-md mx-auto w-full">
                   <h3 className="text-2xl font-black text-slate-800 mb-2">How do you want to use the Hub?</h3>
                   <p className="text-slate-500 text-sm mb-8">Select your role to customize your onboarding experience.</p>

                   <div className="space-y-4">
                     <button onClick={()=>handleRoleSelect('LABOURER')} className="w-full text-left p-5 rounded-2xl border-2 border-slate-200 bg-white hover:border-emerald-500 group transition-all">
                       <h4 className="font-black text-lg text-slate-800 group-hover:text-emerald-700 flex items-center gap-2"><Briefcase size={20}/> I want to work</h4>
                       <p className="text-sm text-slate-500 mt-1">I am a labourer looking for agricultural jobs.</p>
                     </button>
                     <button onClick={()=>handleRoleSelect('FARMER')} className="w-full text-left p-5 rounded-2xl border-2 border-slate-200 bg-white hover:border-emerald-500 group transition-all">
                       <h4 className="font-black text-lg text-slate-800 group-hover:text-emerald-700 flex items-center gap-2"><MapPin size={20}/> I want to hire</h4>
                       <p className="text-sm text-slate-500 mt-1">I am a farmer or contractor looking to hire workers.</p>
                     </button>
                   </div>
                </motion.div>
             )}

             {step === 'OTP' && (
                <motion.div key="otp" initial={{opacity:0,x:20}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-20}} className="max-w-md mx-auto w-full">
                   <button onClick={()=>setStep('ROLE_SELECT')} className="text-sm font-bold text-slate-400 mb-6 flex items-center hover:text-slate-600"><X size={16}/> Back</button>
                   <h3 className="text-2xl font-black text-slate-800 mb-2">Verify Mobile Number</h3>
                   <p className="text-slate-500 text-sm mb-8">We sent a 4-digit code to verify your identity.</p>

                   <div className="space-y-5">
                     <div>
                       <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Mobile Number</label>
                       <div className="flex gap-2">
                         <input type="tel" value={phone} onChange={e=>setPhone(e.target.value)} disabled={otpSent} placeholder="+91 XXXXX XXXXX" className="w-full border-2 border-slate-200 rounded-xl p-4 text-base font-bold bg-white focus:border-emerald-500 focus:outline-none disabled:bg-slate-100 disabled:text-slate-500" />
                         <button onClick={handleSendOtp} disabled={otpSent} className="px-6 rounded-xl font-bold text-sm bg-slate-900 text-white hover:bg-slate-800 transition-colors disabled:bg-slate-300 whitespace-nowrap">
                           {otpSent ? 'Sent' : 'Send OTP'}
                         </button>
                       </div>
                     </div>
                     {otpSent && (
                       <motion.div initial={{opacity:0, height:0}} animate={{opacity:1, height:'auto'}}>
                         <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 mt-5">OTP Code</label>
                         <input type="text" value={otp} onChange={e=>setOtp(e.target.value)} placeholder="0 0 0 0" className="w-full border-2 border-slate-200 rounded-xl p-4 text-2xl tracking-widest font-black bg-white focus:border-emerald-500 focus:outline-none text-center" />
                       </motion.div>
                     )}
                     <button onClick={handleOtpSubmit} className={`w-full py-4 rounded-xl font-bold text-sm text-white transition-colors shadow-lg ${otpSent ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20' : 'bg-slate-300 cursor-not-allowed shadow-none'}`}>
                       Verify & Continue
                     </button>
                   </div>
                </motion.div>
             )}

             {step === 'LABOUR_DETAILS' && (
                <motion.div key="labour" initial={{opacity:0,x:20}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-20}} className="max-w-md mx-auto w-full">
                   <h3 className="text-2xl font-black text-slate-800 mb-1">Labour Profile</h3>
                   <p className="text-sm font-medium text-slate-500 mb-6">Select your top skills so right farmers can find you.</p>

                   <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 mt-4">Full Name</label>
                   <input type="text" value={name} onChange={e=>setName(e.target.value)} placeholder="e.g. Ramesh Kumar" className="w-full border-2 border-slate-200 rounded-xl p-3 text-base font-bold bg-white focus:border-emerald-500 focus:outline-none mb-4" />

                   <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Top Skills</label>
                   <div className="grid grid-cols-2 gap-3 mb-6">
                     {['Harvesting', 'Sowing', 'Pesticide Spray', 'Tractor Driving', 'Weeding', 'Loading'].map((s) => (
                       <label key={s} className={`cursor-pointer flex items-center gap-3 p-3 rounded-xl border-2 transition-all ${skills.includes(s) ? 'border-emerald-500 bg-emerald-50' : 'border-slate-200 bg-white hover:border-slate-300'}`}>
                         <input type="checkbox" checked={skills.includes(s)} onChange={(e)=>{
                           if(e.target.checked) setSelectedSkills([...skills, s]);
                           else setSelectedSkills(skills.filter(sk => sk !== s));
                         }} className="w-4 h-4 accent-emerald-600"/>
                         <span className={`text-xs font-bold ${skills.includes(s) ? 'text-emerald-800' : 'text-slate-600'}`}>{s}</span>
                       </label>
                     ))}
                   </div>

                   <div>
                     <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Expected Daily Wage (₹)</label>
                     <input type="number" value={wage} onChange={(e)=>setWage(e.target.value)} className="w-full border-2 border-slate-200 rounded-xl p-4 text-lg font-black bg-white focus:border-emerald-500 focus:outline-none" />
                   </div>

                   <div className="pt-6 mt-6 border-t border-slate-200 flex justify-between items-center gap-4">
                     <button onClick={handleLabourSubmit} className="flex-1 py-4 rounded-xl font-bold text-sm bg-slate-900 text-white hover:bg-slate-800 transition-colors flex justify-center items-center gap-2 shadow-xl shadow-slate-900/10">
                       Complete Setup <Check size={18}/>
                     </button>
                   </div>
                </motion.div>
             )}

             {step === 'FARMER_DETAILS' && (
                <motion.div key="farmer" initial={{opacity:0,x:20}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-20}} className="max-w-md mx-auto w-full">
                   <h3 className="text-2xl font-black text-slate-800 mb-1">Setup Farm Profile</h3>
                   <p className="text-sm font-medium text-slate-500 mb-6">Help us find the best labourers near your farm.</p>

                   <div className="space-y-5">
                     <div>
                       <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Farm Owner Name</label>
                       <input type="text" placeholder="e.g. Ramesh Kumar" className="w-full border-2 border-slate-200 rounded-xl p-3 text-base font-bold bg-white focus:border-emerald-500 focus:outline-none" />
                     </div>
                     <div>
                       <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Farm Location (Village / District)</label>
                       <input type="text" placeholder="Auto-detecting via GPS..." className="w-full border-2 border-slate-200 rounded-xl p-3 text-base font-bold bg-emerald-50 text-emerald-800 border-emerald-200 focus:outline-none" />
                     </div>
                     <button onClick={handleFarmerSubmit} className="w-full mt-4 py-4 rounded-xl font-bold text-sm bg-emerald-600 text-white flex justify-center items-center gap-2 shadow-lg shadow-emerald-600/20">
                       Start Hiring Local Labour <Check size={18}/>
                     </button>
                   </div>
                </motion.div>
             )}

             {step === 'VERIFICATION' && (
                <motion.div key="verif" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="max-w-sm mx-auto w-full text-center py-10">
                   <div className="w-20 h-20 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin mx-auto mb-6"></div>
                   <h3 className="text-xl font-black text-slate-800 mb-2">Verifying Identity</h3>
                   <p className="text-slate-500 text-sm">Cross-checking Aadhaar details and initializing SmartFarm AI Trust Score...</p>
                </motion.div>
             )}

             {step === 'SUCCESS_LABOUR' && (
                <motion.div key="succ_l" initial={{opacity:0,scale:0.9}} animate={{opacity:1,scale:1}} className="max-w-sm mx-auto w-full text-center py-10">
                   <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                     <BadgeCheck size={48} />
                   </div>
                   <h3 className="text-2xl font-black text-slate-800 mb-2">Profile Live!</h3>
                   <p className="text-slate-500 text-sm mb-8">You are now visible to hundreds of verified farmers in your district.</p>
                   <button onClick={()=>setActiveTab('find')} className="w-full py-4 rounded-xl font-bold text-sm bg-slate-900 text-white">Go to Marketplace</button>
                </motion.div>
             )}

             {step === 'SUCCESS_FARMER' && (
                <motion.div key="succ_f" initial={{opacity:0,scale:0.9}} animate={{opacity:1,scale:1}} className="max-w-sm mx-auto w-full text-center py-10">
                   <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                     <Check size={48} />
                   </div>
                   <h3 className="text-2xl font-black text-slate-800 mb-2">Account Ready</h3>
                   <p className="text-slate-500 text-sm mb-8">You can now post jobs and hire verified local labourers.</p>
                   <button onClick={()=>setActiveTab('find')} className="w-full py-4 rounded-xl font-bold text-sm bg-slate-900 text-white">Find Labour Now</button>
                </motion.div>
             )}

          </AnimatePresence>
       </div>
    </div>
  )
}

