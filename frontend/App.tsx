import React, { useState, useEffect, useRef } from 'react';
import { 
  Leaf, CloudSun, TrendingUp, Landmark, Sprout, 
  ShieldCheck, Droplets, Mic, Camera, Upload, 
  ChevronLeft, Settings, User as UserIcon, LogOut,
  Navigation, Thermometer, Wind, AlertTriangle, PlayCircle,
  Search, Bell, MoreHorizontal, Calendar, DollarSign,
  Phone, Lock, MapPin, UserPlus, LogIn, MessageCircle, 
  X, Send, Moon, Sun, HelpCircle, FileText, ShoppingBag,
  Edit2, AlertCircle
} from 'lucide-react';
import { Screen, User, MarketItem, Scheme } from './types';
import { analyzePlantDisease, getCropAdvisory } from './services/geminiService';
import { PriceTrendChart, YieldChart, GrowthChart, FinancialGauge } from './components/Charts';

// --- Components ---

const Header = ({ title, onBack, rightAction }: { title: string, onBack?: () => void, rightAction?: React.ReactNode }) => (
  <div className="sticky top-0 z-20 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md px-4 py-3 flex items-center justify-between shadow-sm border-b border-gray-100 dark:border-gray-800 transition-all duration-300">
    <div className="flex items-center gap-3">
      {onBack && (
        <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 active:scale-95 transition-transform">
          <ChevronLeft className="w-6 h-6 text-gray-700 dark:text-gray-200" />
        </button>
      )}
      <h1 className="text-lg font-bold text-gray-800 dark:text-white">{title}</h1>
    </div>
    {rightAction && <div>{rightAction}</div>}
  </div>
);

const BottomNav = ({ current, onNavigate }: { current: Screen, onNavigate: (s: Screen) => void }) => {
  const navItems = [
    { id: Screen.HOME, icon: <Sprout size={24} />, label: 'Home' },
    { id: Screen.ANALYTICS, icon: <TrendingUp size={24} />, label: 'Analytics' },
    { id: Screen.VOICE_ASSISTANT, icon: <Mic size={24} />, label: 'Assistant' },
    { id: Screen.SETTINGS, icon: <Settings size={24} />, label: 'Settings' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 pb-safe pt-2 px-6 flex justify-between items-center z-30 pb-4 rounded-t-2xl shadow-[0_-5px_20px_rgba(0,0,0,0.05)]">
      {navItems.map((item) => (
        <button
          key={item.id}
          onClick={() => onNavigate(item.id)}
          className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all duration-300 ${
            current === item.id ? 'text-agri-600 dark:text-agri-500 -translate-y-1' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
          }`}
        >
          {item.icon}
          <span className="text-[10px] font-medium">{item.label}</span>
          {current === item.id && <div className="w-1 h-1 bg-agri-600 dark:bg-agri-500 rounded-full mt-0.5"></div>}
        </button>
      ))}
    </div>
  );
};

// --- ChatBot Component ---

const ChatBot = ({ isOpen, onClose, userLang }: { isOpen: boolean, onClose: () => void, userLang: string }) => {
  const [messages, setMessages] = useState<{role: 'user' | 'bot', text: string}[]>([
    {role: 'bot', text: 'Hello! I am your AI farming assistant. Ask me anything about crops, weather, or prices.'}
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);
    
    const response = await getCropAdvisory(userMsg, userLang);
    
    setLoading(false);
    setMessages(prev => [...prev, { role: 'bot', text: response }]);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-20 right-4 w-80 h-96 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 flex flex-col z-50 animate-slide-up overflow-hidden">
      {/* Header */}
      <div className="bg-agri-600 p-3 flex justify-between items-center text-white">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
            <MessageCircle size={16} />
          </div>
          <div>
            <h3 className="font-bold text-sm">AgriSmart Bot</h3>
            <span className="text-[10px] opacity-80 flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-green-300 rounded-full animate-pulse"></span> Online
            </span>
          </div>
        </div>
        <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-full transition-colors">
          <X size={18} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-gray-50 dark:bg-gray-900/50">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-2.5 rounded-xl text-xs leading-relaxed ${
              msg.role === 'user' 
                ? 'bg-agri-600 text-white rounded-tr-none' 
                : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 border border-gray-100 dark:border-gray-600 rounded-tl-none shadow-sm'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
        {loading && (
           <div className="flex justify-start">
             <div className="bg-white dark:bg-gray-700 p-3 rounded-xl rounded-tl-none shadow-sm border border-gray-100 dark:border-gray-600 flex gap-1">
               <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></div>
               <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-75"></div>
               <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-150"></div>
             </div>
           </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-3 bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700 flex gap-2">
        <input 
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask a question..." 
          className="flex-1 bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white text-xs rounded-full px-4 py-2 outline-none focus:ring-1 focus:ring-agri-500"
        />
        <button 
          onClick={handleSend}
          disabled={!input.trim() || loading}
          className="w-8 h-8 bg-agri-600 rounded-full flex items-center justify-center text-white disabled:opacity-50 hover:bg-agri-700 transition-colors"
        >
          <Send size={14} className={loading ? 'opacity-0' : 'ml-0.5'} />
        </button>
      </div>
    </div>
  );
};

// --- Screens ---

const LoginScreen = ({ onLogin }: { onLogin: (u: User) => void }) => {
  const [lang, setLang] = useState<'en'|'hi'|'ta'|'pa'>('en');
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  
  // Form States
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [password, setPassword] = useState('');
  
  const [showForm, setShowForm] = useState(false);
  
  if (!showForm) {
    return (
      <div className="h-screen w-full relative overflow-hidden bg-emerald-900">
        {/* HD Agriculture Image - Rows of Crops */}
        <img 
          src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=1920&auto=format&fit=crop" 
          className="absolute inset-0 w-full h-full object-cover"
          alt="Green Agriculture Field Rows"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/20"></div>

        {/* Floating 3D Stats */}
        <div className="absolute top-1/4 left-6 animate-pulse-slow perspective-[1000px]">
           <div className="bg-white/20 backdrop-blur-md border border-white/30 p-3 rounded-2xl shadow-xl transform rotate-y-12 rotate-x-6 hover:scale-105 transition-transform duration-500">
             <div className="flex items-center gap-2">
                <div className="bg-green-500 p-1.5 rounded-full text-white"><Leaf size={14} /></div>
                <div className="text-white">
                   <p className="text-[10px] opacity-80 uppercase tracking-wider">Growth</p>
                   <p className="text-lg font-bold leading-none">12 cm</p>
                </div>
             </div>
           </div>
        </div>

        <div className="absolute top-1/3 right-6 animate-pulse-slow delay-700 perspective-[1000px]">
           <div className="bg-white/20 backdrop-blur-md border border-white/30 p-3 rounded-2xl shadow-xl transform -rotate-y-12 -rotate-x-6 hover:scale-105 transition-transform duration-500">
             <div className="flex items-center gap-2">
                <div className="bg-blue-500 p-1.5 rounded-full text-white"><Droplets size={14} /></div>
                <div className="text-white">
                   <p className="text-[10px] opacity-80 uppercase tracking-wider">Moisture</p>
                   <p className="text-lg font-bold leading-none">75%</p>
                </div>
             </div>
           </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-8 pb-12 flex flex-col items-start animate-slide-up">
           <div className="mb-6">
             <div className="w-10 h-10 bg-agri-500 rounded-xl mb-4 flex items-center justify-center text-white">
               <Sprout size={24} />
             </div>
             <p className="text-agri-400 font-bold tracking-widest text-xs uppercase mb-2">Smart Farming</p>
             <h1 className="text-5xl font-bold text-white leading-tight mb-2">
               THE NEW ERA <br/>OF <span className="text-agri-500">AGRICULTURE</span>
             </h1>
             <p className="text-gray-300 text-sm max-w-xs mt-4">
               Sustainable farming solutions for a better tomorrow. AI-driven insights at your fingertips.
             </p>
           </div>
           
           <button 
             onClick={() => setShowForm(true)}
             className="w-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/30 text-white font-bold py-4 rounded-2xl shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2 group"
           >
             Get Started <ChevronLeft className="rotate-180 group-hover:translate-x-1 transition-transform" />
           </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col p-6 animate-fade-in transition-colors">
      <button onClick={() => setShowForm(false)} className="self-start mb-4">
        <ChevronLeft size={28} className="text-gray-800 dark:text-white" />
      </button>

      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-1">Select Language</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">Choose your preferred language</p>
      </div>

      {/* Language Selection Grid */}
      <div className="grid grid-cols-2 gap-3 mb-8">
        {[
          { code: 'en', label: 'English', native: 'English' },
          { code: 'pa', label: 'Punjabi', native: 'ਪੰਜਾਬੀ' },
          { code: 'hi', label: 'Hindi', native: 'हिंदी' },
          { code: 'ta', label: 'Tamil', native: 'தமிழ்' }
        ].map((l) => (
          <button
            key={l.code}
            onClick={() => setLang(l.code as any)}
            className={`flex items-center gap-3 p-3 rounded-xl border transition-all text-left ${
              lang === l.code 
                ? 'border-agri-500 bg-agri-50 dark:bg-agri-900/30 text-agri-700 dark:text-agri-400 shadow-sm ring-1 ring-agri-500' 
                : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-750'
            }`}
          >
            <span className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center font-bold text-sm">
              {l.native.charAt(0)}
            </span>
            <div>
              <p className="font-bold text-sm">{l.native}</p>
              <p className="text-[10px] opacity-70">{l.label}</p>
            </div>
            {lang === l.code && <div className="ml-auto w-2 h-2 rounded-full bg-agri-500"></div>}
          </button>
        ))}
      </div>

      {/* Auth Toggle */}
      <div className="flex p-1 bg-gray-200 dark:bg-gray-800 rounded-xl mb-6">
        <button 
          onClick={() => setAuthMode('login')}
          className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all ${
            authMode === 'login' 
            ? 'bg-white dark:bg-gray-700 text-gray-800 dark:text-white shadow-sm' 
            : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'
          }`}
        >
          User Login
        </button>
        <button 
          onClick={() => setAuthMode('signup')}
          className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all ${
            authMode === 'signup' 
            ? 'bg-white dark:bg-gray-700 text-gray-800 dark:text-white shadow-sm' 
            : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'
          }`}
        >
          Sign Up
        </button>
      </div>

      <div className="flex-1 flex flex-col gap-4">
        {authMode === 'signup' && (
          <div className="space-y-4 animate-fade-in">
             <div className="bg-white dark:bg-gray-800 px-4 py-3 rounded-xl border border-gray-100 dark:border-gray-700 focus-within:ring-2 focus-within:ring-agri-500 focus-within:border-transparent transition-all flex items-center gap-3">
               <UserIcon size={20} className="text-gray-400" />
               <div className="flex-1">
                 <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">Full Name</label>
                 <input 
                   type="text" 
                   value={name}
                   onChange={(e) => setName(e.target.value)}
                   placeholder="e.g. Rahul Kumar"
                   className="w-full bg-transparent border-none p-0 text-sm font-medium text-gray-800 dark:text-white placeholder-gray-300 focus:ring-0 outline-none"
                 />
               </div>
             </div>
             <div className="bg-white dark:bg-gray-800 px-4 py-3 rounded-xl border border-gray-100 dark:border-gray-700 focus-within:ring-2 focus-within:ring-agri-500 focus-within:border-transparent transition-all flex items-center gap-3">
               <MapPin size={20} className="text-gray-400" />
               <div className="flex-1">
                 <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">Location</label>
                 <input 
                   type="text" 
                   value={location}
                   onChange={(e) => setLocation(e.target.value)}
                   placeholder="e.g. Punjab, India"
                   className="w-full bg-transparent border-none p-0 text-sm font-medium text-gray-800 dark:text-white placeholder-gray-300 focus:ring-0 outline-none"
                 />
               </div>
             </div>
          </div>
        )}

        <div className="bg-white dark:bg-gray-800 px-4 py-3 rounded-xl border border-gray-100 dark:border-gray-700 focus-within:ring-2 focus-within:ring-agri-500 focus-within:border-transparent transition-all flex items-center gap-3">
           <Phone size={20} className="text-gray-400" />
           <div className="flex-1">
             <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">Phone Number</label>
             <input 
               type="tel" 
               value={phone}
               onChange={(e) => setPhone(e.target.value)}
               placeholder="+91 98765 43210"
               className="w-full bg-transparent border-none p-0 text-sm font-medium text-gray-800 dark:text-white placeholder-gray-300 focus:ring-0 outline-none"
             />
           </div>
        </div>

        <div className="bg-white dark:bg-gray-800 px-4 py-3 rounded-xl border border-gray-100 dark:border-gray-700 focus-within:ring-2 focus-within:ring-agri-500 focus-within:border-transparent transition-all flex items-center gap-3">
           <Lock size={20} className="text-gray-400" />
           <div className="flex-1">
             <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">Password</label>
             <input 
               type="password" 
               value={password}
               onChange={(e) => setPassword(e.target.value)}
               placeholder="••••••••"
               className="w-full bg-transparent border-none p-0 text-sm font-medium text-gray-800 dark:text-white placeholder-gray-300 focus:ring-0 outline-none"
             />
           </div>
        </div>

        <button 
          onClick={() => onLogin({ name: name || 'Farmer', language: lang, location: location || 'Punjab, India' })}
          className="mt-6 w-full bg-agri-600 hover:bg-agri-700 text-white font-bold py-4 rounded-xl shadow-xl shadow-agri-600/30 active:scale-95 transition-all flex items-center justify-center gap-2"
        >
          {authMode === 'login' ? <LogIn size={20} /> : <UserPlus size={20} />}
          {authMode === 'login' ? 'Login to Dashboard' : 'Create Account'}
        </button>

        <p className="text-center text-gray-400 text-xs mt-2">
          By continuing you agree to our Terms & Conditions
        </p>
      </div>
    </div>
  );
};

const HomeScreen = ({ user, onNavigate }: { user: User, onNavigate: (s: Screen) => void }) => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  
  const commodities = [
    { name: 'Rice', icon: '🌾', trend: '+2%' },
    { name: 'Corn', icon: '🌽', trend: '-1%' },
    { name: 'Grapes', icon: '🍇', trend: '+5%' },
    { name: 'Potato', icon: '🥔', trend: '0%' },
    { name: 'Olive', icon: '🫒', trend: '+3%' },
  ];

  return (
    <div className="pb-28 animate-fade-in bg-gray-50/50 dark:bg-gray-900 min-h-screen transition-colors">
      {/* Top Bar */}
      <div className="bg-agri-700 text-white p-6 pb-12 rounded-b-[40px] shadow-lg relative z-10">
        <div className="flex justify-between items-start mb-6">
          <div>
            <p className="text-agri-200 text-sm mb-1">Hello, {user.name.split(' ')[0]}</p>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold">{new Date().toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' })}</h1>
              <ChevronLeft className="-rotate-90 w-4 h-4 text-agri-300" />
            </div>
          </div>
          <div className="flex gap-3">
             <button className="bg-white/10 p-2 rounded-full backdrop-blur-sm hover:bg-white/20"><Bell size={20} /></button>
             <div className="w-10 h-10 bg-agri-500 rounded-full flex items-center justify-center border-2 border-white/20">
               <UserIcon size={20} />
             </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-agri-200" size={20} />
          <input 
            type="text" 
            placeholder="Search plant here..." 
            className="w-full bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-white placeholder-agri-200 focus:bg-white/20 outline-none transition-colors"
          />
          <button className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 bg-agri-500 rounded-lg">
             <Navigation size={14} />
          </button>
        </div>

        {/* Weather Widget (Floating) */}
        <div className="absolute left-4 right-4 -bottom-16 bg-white dark:bg-gray-800 rounded-3xl p-5 shadow-xl flex flex-col justify-between border border-gray-100 dark:border-gray-700 transition-colors">
           <div className="flex justify-between items-center mb-4">
             <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm font-medium">
               <Navigation size={14} className="text-agri-600" />
               {user.location.split(',')[0]}
             </div>
             <div className="flex items-center gap-2">
               <CloudSun className="text-blue-400" size={32} />
               <span className="text-3xl font-bold text-gray-800 dark:text-white">+16°</span>
             </div>
           </div>

           <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
             <div className="flex flex-col items-center gap-1">
               <Thermometer size={16} className="text-orange-400" />
               <span className="font-bold text-gray-800 dark:text-gray-200">+22 C</span>
               <span>Soil Temp</span>
             </div>
             <div className="w-[1px] h-8 bg-gray-100 dark:bg-gray-700"></div>
             <div className="flex flex-col items-center gap-1">
               <Droplets size={16} className="text-blue-400" />
               <span className="font-bold text-gray-800 dark:text-gray-200">50%</span>
               <span>Humidity</span>
             </div>
             <div className="w-[1px] h-8 bg-gray-100 dark:bg-gray-700"></div>
             <div className="flex flex-col items-center gap-1">
               <Wind size={16} className="text-gray-400" />
               <span className="font-bold text-gray-800 dark:text-gray-200">8 m/s</span>
               <span>Wind</span>
             </div>
             <div className="w-[1px] h-8 bg-gray-100 dark:bg-gray-700"></div>
             <div className="flex flex-col items-center gap-1">
               <CloudSun size={16} className="text-yellow-500" />
               <span className="font-bold text-gray-800 dark:text-gray-200">12 mm</span>
               <span>Precipitation</span>
             </div>
           </div>
           
           {/* Solar Curve Mockup */}
           <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 relative h-12">
             <div className="absolute bottom-0 left-0 right-0 h-8 border-t-2 border-dashed border-orange-200 dark:border-orange-900 rounded-[50%] scale-y-75 translate-y-2"></div>
             <div className="absolute top-1 left-[40%] bg-orange-400 w-3 h-3 rounded-full shadow-[0_0_10px_rgba(251,146,60,0.6)]"></div>
             <div className="flex justify-between text-[10px] text-gray-400 mt-6 relative z-10">
               <span>5:25 am<br/>Sunrise</span>
               <span className="text-right">5:25 pm<br/>Sunset</span>
             </div>
           </div>
        </div>
      </div>

      <div className="mt-20 px-4">
        {/* Commodities */}
        <div className="flex justify-between items-center mb-3 mt-4">
          <h3 className="font-bold text-gray-800 dark:text-white">Commodities and Food</h3>
          <button onClick={() => onNavigate(Screen.MARKET_PRICES)} className="p-1 bg-gray-100 dark:bg-gray-800 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"><MoreHorizontal size={20} /></button>
        </div>
        <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
          {commodities.map((item, idx) => (
            <div key={idx} className="bg-white dark:bg-gray-800 min-w-[80px] p-3 rounded-2xl shadow-sm flex flex-col items-center gap-2 border border-gray-100 dark:border-gray-700 transition-colors">
               <span className="text-2xl">{item.icon}</span>
               <span className="text-xs font-semibold text-gray-600 dark:text-gray-300">{item.name}</span>
            </div>
          ))}
        </div>

        {/* My Fields */}
        <div className="flex justify-between items-center mb-3 mt-6">
          <h3 className="font-bold text-gray-800 dark:text-white">My Fields</h3>
          <button className="text-xs font-bold text-agri-600 bg-agri-50 dark:bg-agri-900/30 px-3 py-1 rounded-full">See All</button>
        </div>
        <div className="space-y-4">
          <div 
             onClick={() => onNavigate(Screen.DISEASE_DETECTION)}
             className="relative h-48 rounded-3xl overflow-hidden shadow-lg group cursor-pointer"
          >
             <img src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=800&auto=format&fit=crop" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="Field" />
             <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
             <div className="absolute bottom-4 left-4 right-4 text-white">
                <div className="flex justify-between items-end">
                   <div>
                     <h4 className="text-xl font-bold">Olive Fields</h4>
                     <p className="text-xs text-gray-300 flex items-center gap-1 mt-1"><Calendar size={12}/> Harvest on Dec 24, 2024</p>
                   </div>
                   <div className="bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                     <Sprout size={14} className="text-agri-400" />
                     <span className="font-bold text-sm">7500 kg/ha</span>
                   </div>
                </div>
             </div>
             {/* Floating Action Buttons overlaid on image */}
             <div className="absolute top-4 right-4 flex flex-col gap-2">
                <button className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/40"><Camera size={18} /></button>
                <button className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/40"><Settings size={18} /></button>
             </div>
          </div>
          
          {/* Quick Access Grid */}
          <div className="grid grid-cols-2 gap-3">
             <button onClick={() => onNavigate(Screen.GOVT_SCHEMES)} className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-2xl flex items-center gap-3 border border-blue-100 dark:border-blue-900/30">
                <div className="bg-white dark:bg-blue-800 p-2 rounded-full text-blue-500 shadow-sm"><Landmark size={20} /></div>
                <div className="text-left">
                  <p className="font-bold text-gray-800 dark:text-gray-200 text-sm">Govt Schemes</p>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400">Explore benefits</p>
                </div>
             </button>
             <button onClick={() => onNavigate(Screen.CROP_ADVISORY)} className="bg-green-50 dark:bg-green-900/20 p-4 rounded-2xl flex items-center gap-3 border border-green-100 dark:border-green-900/30">
                <div className="bg-white dark:bg-green-800 p-2 rounded-full text-green-500 shadow-sm"><Leaf size={20} /></div>
                <div className="text-left">
                  <p className="font-bold text-gray-800 dark:text-gray-200 text-sm">Advisory</p>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400">Ask AI Expert</p>
                </div>
             </button>
          </div>
        </div>
      </div>

      {/* ChatBot Floating Action Button */}
      <div className="fixed bottom-20 right-4 z-40">
        {!isChatOpen && (
          <button 
            onClick={() => setIsChatOpen(true)}
            className="w-14 h-14 bg-agri-600 text-white rounded-full shadow-xl flex items-center justify-center hover:bg-agri-700 transition-transform active:scale-95 animate-pulse-slow"
          >
            <MessageCircle size={28} />
          </button>
        )}
      </div>

      {/* ChatBot Popup */}
      <ChatBot isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} userLang={user.language} />
    </div>
  );
};

const SettingsScreen = ({ user, onBack, onLogout, onThemeToggle, isDarkMode }: { user: User, onBack: () => void, onLogout: () => void, onThemeToggle: () => void, isDarkMode: boolean }) => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20 transition-colors">
      <Header title="Settings" onBack={onBack} />
      <div className="p-4 space-y-6">
         
         {/* Profile Card */}
         <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl flex items-center gap-4 shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="w-14 h-14 bg-agri-100 dark:bg-agri-900 rounded-full flex items-center justify-center text-agri-700 dark:text-agri-300 font-bold text-2xl">
              {user.name.charAt(0)}
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-lg dark:text-white">{user.name}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">{user.location}</p>
            </div>
            <button className="p-2 bg-gray-100 dark:bg-gray-700 rounded-full text-gray-500 dark:text-gray-300">
              <Edit2 size={16} />
            </button>
         </div>

         {/* General Settings */}
         <div className="space-y-1">
            <p className="px-1 text-xs font-bold text-gray-400 uppercase tracking-wider">General</p>
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
               <button onClick={onThemeToggle} className="w-full p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
                  <div className="flex items-center gap-3">
                     <div className="w-8 h-8 rounded-full bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                        {isDarkMode ? <Moon size={16} /> : <Sun size={16} />}
                     </div>
                     <span className="font-medium text-gray-800 dark:text-gray-200">Dark Mode</span>
                  </div>
                  <div className={`w-10 h-6 rounded-full p-1 transition-colors ${isDarkMode ? 'bg-agri-600' : 'bg-gray-200'}`}>
                    <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${isDarkMode ? 'translate-x-4' : ''}`}></div>
                  </div>
               </button>
               <div className="h-[1px] bg-gray-100 dark:bg-gray-700 mx-4"></div>
               <button className="w-full p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
                  <div className="flex items-center gap-3">
                     <div className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                        <UserIcon size={16} />
                     </div>
                     <span className="font-medium text-gray-800 dark:text-gray-200">Change Details</span>
                  </div>
                  <ChevronLeft className="w-5 h-5 text-gray-400 rotate-180" />
               </button>
            </div>
         </div>

         {/* Account & Activity */}
         <div className="space-y-1">
            <p className="px-1 text-xs font-bold text-gray-400 uppercase tracking-wider">Activity</p>
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
               <button className="w-full p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
                  <div className="flex items-center gap-3">
                     <div className="w-8 h-8 rounded-full bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 flex items-center justify-center">
                        <ShoppingBag size={16} />
                     </div>
                     <span className="font-medium text-gray-800 dark:text-gray-200">My Bookings</span>
                  </div>
                  <ChevronLeft className="w-5 h-5 text-gray-400 rotate-180" />
               </button>
               <div className="h-[1px] bg-gray-100 dark:bg-gray-700 mx-4"></div>
               <button className="w-full p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
                  <div className="flex items-center gap-3">
                     <div className="w-8 h-8 rounded-full bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 flex items-center justify-center">
                        <FileText size={16} />
                     </div>
                     <span className="font-medium text-gray-800 dark:text-gray-200">Reports</span>
                  </div>
                  <ChevronLeft className="w-5 h-5 text-gray-400 rotate-180" />
               </button>
            </div>
         </div>

         {/* Support */}
         <div className="space-y-1">
            <p className="px-1 text-xs font-bold text-gray-400 uppercase tracking-wider">Support</p>
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
               <button className="w-full p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
                  <div className="flex items-center gap-3">
                     <div className="w-8 h-8 rounded-full bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 flex items-center justify-center">
                        <AlertCircle size={16} />
                     </div>
                     <span className="font-medium text-gray-800 dark:text-gray-200">Raise a Complaint</span>
                  </div>
                  <ChevronLeft className="w-5 h-5 text-gray-400 rotate-180" />
               </button>
               <div className="h-[1px] bg-gray-100 dark:bg-gray-700 mx-4"></div>
               <button className="w-full p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
                  <div className="flex items-center gap-3">
                     <div className="w-8 h-8 rounded-full bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400 flex items-center justify-center">
                        <HelpCircle size={16} />
                     </div>
                     <span className="font-medium text-gray-800 dark:text-gray-200">Help & FAQ</span>
                  </div>
                  <ChevronLeft className="w-5 h-5 text-gray-400 rotate-180" />
               </button>
            </div>
         </div>

         <button 
          onClick={onLogout}
          className="w-full bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 py-3 rounded-xl font-bold flex items-center justify-center gap-2 mt-4 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
         >
           <LogOut size={18} /> Logout
         </button>
      </div>
    </div>
  );
};

// ... (Other screens like DiseaseDetection, MarketPrices, etc., remain similar but need style tweaks to match)
// Re-implementing simplified versions for the demo to maintain consistency

const AnalyticsScreen = ({ onBack }: { onBack: () => void }) => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-24 transition-colors">
      <Header title="Farm Analytics" onBack={onBack} />
      
      <div className="p-4 space-y-6">
        {/* Plant Growth Activity */}
        <GrowthChart />

        <div className="grid grid-cols-2 gap-4">
          {/* Main Info Cards */}
          <div className="bg-[#dcfce7] dark:bg-agri-900 p-4 rounded-2xl flex flex-col justify-between h-32 relative overflow-hidden">
             <div className="flex justify-between items-start">
               <div className="bg-white/60 dark:bg-white/10 p-1.5 rounded-lg"><Sprout size={18} className="text-agri-700 dark:text-agri-300"/></div>
               <button className="text-agri-800 dark:text-agri-300"><MoreHorizontal size={16}/></button>
             </div>
             <div>
               <p className="text-xs text-agri-800 dark:text-agri-300 font-medium">Height plant</p>
               <p className="text-xl font-bold text-agri-900 dark:text-white">4.3 cm</p>
             </div>
             <div className="absolute right-0 bottom-0 w-16 h-16 bg-agri-300/20 rounded-tl-full"></div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl flex flex-col justify-between h-32 border border-gray-100 dark:border-gray-700 shadow-sm">
             <div className="flex justify-between items-start">
               <div className="bg-blue-50 dark:bg-blue-900/30 p-1.5 rounded-lg"><Droplets size={18} className="text-blue-500"/></div>
               <button className="text-gray-400"><MoreHorizontal size={16}/></button>
             </div>
             <div>
               <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Water quality</p>
               <p className="text-xl font-bold text-gray-800 dark:text-white">40%</p>
             </div>
          </div>
        </div>

        {/* Growth Phase Steps */}
        <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
           <div className="flex justify-between items-center mb-6">
             {['Seed Phase', 'Vegetation', 'Final Growth'].map((step, idx) => (
               <div key={idx} className="flex flex-col items-center gap-2 relative z-10">
                 <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${idx === 1 ? 'bg-white dark:bg-gray-700 border-agri-500 text-agri-500 shadow-[0_0_0_4px_rgba(34,197,94,0.1)]' : 'bg-gray-100 dark:bg-gray-700 border-transparent text-gray-400'}`}>
                    <Sprout size={18} />
                 </div>
                 <div className="text-center">
                   <p className={`text-[10px] font-bold ${idx === 1 ? 'text-gray-800 dark:text-gray-200' : 'text-gray-400'}`}>{step}</p>
                   <p className="text-[9px] text-gray-400">Week {idx + 1}</p>
                 </div>
               </div>
             ))}
             {/* Connector Line */}
             <div className="absolute left-10 right-10 h-0.5 bg-gray-100 dark:bg-gray-700 top-12 -z-0">
               <div className="w-1/2 h-full bg-agri-200 dark:bg-agri-700"></div>
             </div>
           </div>
        </div>
        
        {/* Financial Gauge */}
        <FinancialGauge />

        {/* Harvest Schedule */}
        <div>
          <h3 className="font-bold text-gray-800 dark:text-white mb-3">Harvest schedule</h3>
          <div className="space-y-3">
             <div className="bg-slate-800 text-white p-4 rounded-2xl flex items-center gap-4">
               <img src="https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=100&h=100&fit=crop" className="w-12 h-12 rounded-xl object-cover" alt="Wheat"/>
               <div className="flex-1">
                 <h4 className="font-bold text-sm">Gandum Harvest</h4>
                 <div className="flex items-center gap-4 mt-1 text-xs text-gray-400">
                   <span className="flex items-center gap-1"><Calendar size={12}/> Jan 30, 2022</span>
                   <span className="flex items-center gap-1"><AlertTriangle size={12}/> 09 am</span>
                 </div>
               </div>
             </div>
          </div>
        </div>

      </div>
    </div>
  );
};

const DiseaseDetection = ({ onBack }: { onBack: () => void }) => {
  const [image, setImage] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setResult(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyze = async () => {
    if (!image) return;
    setAnalyzing(true);
    // Remove data:image/jpeg;base64, prefix for API
    const base64Data = image.split(',')[1];
    const res = await analyzePlantDisease(base64Data);
    setResult(res);
    setAnalyzing(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20 transition-colors">
      <Header title="Disease Detection" onBack={onBack} />
      
      <div className="p-4 flex flex-col h-full">
        {!image ? (
          <div className="flex-1 flex flex-col items-center justify-center mt-10">
            <div className="w-64 h-64 bg-white dark:bg-gray-800 rounded-3xl border-2 border-dashed border-gray-300 dark:border-gray-700 flex flex-col items-center justify-center gap-4 shadow-sm">
               <Camera size={48} className="text-gray-300 dark:text-gray-600" />
               <p className="text-gray-400 dark:text-gray-500 text-sm font-medium">No Image Selected</p>
            </div>
            
            <div className="flex gap-4 mt-8 w-full max-w-xs">
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="flex-1 bg-agri-600 text-white py-3 rounded-xl font-bold shadow-lg shadow-agri-600/30 flex items-center justify-center gap-2 active:scale-95 transition-transform"
              >
                <Camera size={20} /> Camera
              </button>
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="flex-1 bg-white dark:bg-gray-800 text-agri-700 dark:text-agri-400 border border-agri-200 dark:border-gray-700 py-3 rounded-xl font-bold shadow-sm flex items-center justify-center gap-2 active:scale-95 transition-transform"
              >
                <Upload size={20} /> Gallery
              </button>
            </div>
            <input 
              type="file" 
              ref={fileInputRef} 
              accept="image/*" 
              className="hidden" 
              onChange={handleFileChange}
            />
          </div>
        ) : (
          <div className="animate-fade-in">
            <div className="relative rounded-2xl overflow-hidden shadow-lg aspect-square mb-6">
              <img src={image} alt="Upload" className="w-full h-full object-cover" />
              <button 
                onClick={() => setImage(null)}
                className="absolute top-2 right-2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70"
              >
                <LogOut size={16} />
              </button>
            </div>

            {!result && (
              <button
                onClick={analyze}
                disabled={analyzing}
                className="w-full bg-agri-600 disabled:bg-gray-400 text-white font-bold py-4 rounded-xl shadow-lg flex items-center justify-center gap-2"
              >
                {analyzing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Analyzing...
                  </>
                ) : (
                  <>
                    <ShieldCheck size={20} /> Detect Disease
                  </>
                )}
              </button>
            )}

            {result && (
              <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-agri-100 dark:border-gray-700 animate-slide-up">
                <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2 border-b dark:border-gray-700 pb-2">Analysis Result</h3>
                <div className="prose prose-sm prose-green dark:text-gray-300">
                  <pre className="whitespace-pre-wrap font-sans text-sm">{result}</pre>
                </div>
                <button 
                  onClick={() => { setImage(null); setResult(null); }}
                  className="mt-6 w-full py-3 text-agri-600 dark:text-agri-400 font-bold border border-agri-200 dark:border-gray-700 rounded-xl hover:bg-agri-50 dark:hover:bg-gray-700"
                >
                  Analyze Another
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const MarketPrices = ({ onBack }: { onBack: () => void }) => {
  const items: MarketItem[] = [
    { id: '1', name: 'Wheat', price: 2500, unit: 'quintal', trend: 'up', image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=100&h=100&fit=crop' },
    { id: '2', name: 'Rice (Basmati)', price: 4200, unit: 'quintal', trend: 'stable', image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=100&h=100&fit=crop' },
    { id: '3', name: 'Cotton', price: 6800, unit: 'quintal', trend: 'down', image: 'https://images.unsplash.com/photo-1605333552084-2a6d85949e22?w=100&h=100&fit=crop' },
    { id: '4', name: 'Tomato', price: 35, unit: 'kg', trend: 'up', image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=100&h=100&fit=crop' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20 transition-colors">
      <Header title="Market Prices (Mandi)" onBack={onBack} />
      <div className="p-4 space-y-3">
        {items.map((item) => (
          <div key={item.id} className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover bg-gray-100 dark:bg-gray-700" />
              <div>
                <h3 className="font-bold text-gray-800 dark:text-white">{item.name}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">Current Market Price</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-bold text-lg text-agri-700 dark:text-agri-400">₹{item.price}</p>
              <div className="flex items-center justify-end gap-1 text-xs">
                <span className="dark:text-gray-400">/{item.unit}</span>
                {item.trend === 'up' && <TrendingUp size={14} className="text-green-500" />}
                {item.trend === 'down' && <TrendingUp size={14} className="text-red-500 transform rotate-180" />}
                {item.trend === 'stable' && <span className="text-gray-400">-</span>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const Advisory = ({ onBack, lang }: { onBack: () => void, lang: string }) => {
  const [query, setQuery] = useState('');
  const [answer, setAnswer] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAsk = async () => {
    if (!query.trim()) return;
    setLoading(true);
    const res = await getCropAdvisory(query, lang);
    setAnswer(res);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20 transition-colors">
      <Header title="Crop Advisory" onBack={onBack} />
      <div className="p-4">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 mb-6">
          <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Ask an Expert (AI)</label>
          <div className="flex gap-2">
            <input 
              type="text" 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. Best fertilizer for rice?"
              className="flex-1 border border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white rounded-xl px-4 py-2 focus:ring-2 focus:ring-agri-500 outline-none"
            />
            <button 
              onClick={handleAsk}
              disabled={loading}
              className="bg-agri-600 text-white p-3 rounded-xl disabled:opacity-50"
            >
              {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <Navigation size={20} className="transform rotate-90" />}
            </button>
          </div>
          {answer && (
            <div className="mt-4 p-3 bg-agri-50 dark:bg-agri-900/30 text-agri-900 dark:text-agri-100 rounded-lg text-sm leading-relaxed border border-agri-100 dark:border-agri-800 animate-fade-in">
              <span className="font-bold">Answer: </span>{answer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const GovtSchemes = ({ onBack }: { onBack: () => void }) => {
  const schemes: Scheme[] = [
    { id: '1', title: 'PM-KISAN', description: 'Income support of ₹6,000 per year to farmer families.', eligibility: 'All landholding farmers.' },
    { id: '2', title: 'Fasal Bima Yojana', description: 'Crop insurance scheme providing financial support.', eligibility: 'Farmers with notified crops.' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20 transition-colors">
      <Header title="Government Schemes" onBack={onBack} />
      <div className="p-4 space-y-4">
        {schemes.map(scheme => (
          <div key={scheme.id} className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-sm border border-blue-100 dark:border-gray-700 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-blue-50 dark:bg-blue-900/20 rounded-bl-full -mr-4 -mt-4 z-0"></div>
            <div className="relative z-10">
              <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-1">{scheme.title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">{scheme.description}</p>
              <div className="inline-block bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full text-xs font-semibold">
                Eligibility: {scheme.eligibility}
              </div>
            </div>
            <button className="mt-4 w-full py-2 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 text-sm font-bold rounded-lg transition-colors border border-gray-200 dark:border-gray-600">
              View Details
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

const VoiceAssistant = ({ onBack }: { onBack: () => void }) => {
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("Tap microphone to ask...");
  
  const toggleListen = () => {
    if (!listening) {
      setListening(true);
      setTranscript("Listening...");
      setTimeout(() => {
        setListening(false);
        setTranscript("How can I increase my tomato yield?");
      }, 3000);
    } else {
      setListening(false);
      setTranscript("Tap microphone to ask...");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20 flex flex-col transition-colors">
      <Header title="Voice Assistant" onBack={onBack} />
      
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <div className={`w-32 h-32 rounded-full flex items-center justify-center mb-8 transition-all duration-500 ${listening ? 'bg-red-500 shadow-[0_0_0_20px_rgba(239,68,68,0.2)] animate-pulse-slow' : 'bg-agri-600 shadow-xl'}`}>
          <button onClick={toggleListen} className="text-white">
            <Mic size={48} />
          </button>
        </div>
        
        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
          {listening ? "I'm listening..." : "Hello, Farmer!"}
        </h2>
        <p className="text-gray-500 dark:text-gray-400 max-w-xs mx-auto text-lg leading-relaxed">
          "{transcript}"
        </p>

        {!listening && transcript !== "Tap microphone to ask..." && (
           <div className="mt-8 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 text-left w-full animate-slide-up">
             <p className="text-gray-700 dark:text-gray-300 text-sm leading-6">
               <span className="font-bold text-agri-600 dark:text-agri-400">AI Response:</span> To increase tomato yield, ensure soil pH is between 6.0-6.8. Apply NPK fertilizer in split doses. Prune the bottom leaves.
             </p>
           </div>
        )}
      </div>
    </div>
  );
};

// --- Main App ---

function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>(Screen.LOGIN);
  const [user, setUser] = useState<User | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const handleLogin = (u: User) => {
    setUser(u);
    setCurrentScreen(Screen.HOME);
  };

  const handleNavigate = (screen: Screen) => {
    setCurrentScreen(screen);
  };
  
  const goBack = () => {
    setCurrentScreen(Screen.HOME);
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  // Render logic based on state
  const renderScreen = () => {
    switch (currentScreen) {
      case Screen.LOGIN:
        return <LoginScreen onLogin={handleLogin} />;
      case Screen.HOME:
        return <HomeScreen user={user!} onNavigate={handleNavigate} />;
      case Screen.DISEASE_DETECTION:
        return <DiseaseDetection onBack={goBack} />;
      case Screen.MARKET_PRICES:
        return <MarketPrices onBack={goBack} />;
      case Screen.CROP_ADVISORY:
        return <Advisory onBack={goBack} lang={user?.language || 'en'} />;
      case Screen.GOVT_SCHEMES:
        return <GovtSchemes onBack={goBack} />;
      case Screen.ANALYTICS:
        return <AnalyticsScreen onBack={goBack} />;
      case Screen.VOICE_ASSISTANT:
        return <VoiceAssistant onBack={goBack} />;
      case Screen.SETTINGS:
        return (
          <SettingsScreen 
            user={user!} 
            onBack={goBack} 
            onLogout={() => setCurrentScreen(Screen.LOGIN)} 
            onThemeToggle={toggleTheme}
            isDarkMode={isDarkMode}
          />
        );
      default:
        return (
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center p-6 text-center transition-colors">
            <Header title="Coming Soon" onBack={goBack} />
            <div className="mt-20">
               <Sprout size={48} className="text-gray-300 dark:text-gray-600 mx-auto mb-4" />
               <h2 className="text-xl font-bold text-gray-700 dark:text-gray-300">Feature Coming Soon</h2>
               <button onClick={goBack} className="mt-8 text-agri-600 font-bold">Go Back</button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="font-sans text-gray-900 bg-white dark:bg-gray-900 min-h-screen mx-auto max-w-md shadow-2xl overflow-hidden relative border-x border-gray-100 dark:border-gray-800 transition-colors">
      {renderScreen()}
      {/* Show Bottom Nav only on main screens */}
      {user && [Screen.HOME, Screen.ANALYTICS, Screen.VOICE_ASSISTANT, Screen.SETTINGS].includes(currentScreen) && (
        <BottomNav current={currentScreen} onNavigate={handleNavigate} />
      )}
    </div>
  );
}

export default App;