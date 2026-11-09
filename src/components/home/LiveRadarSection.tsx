import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useAppStore } from '../../store/useAppStore';
import {
  Plane,
  Radio,
  Compass,
  ArrowRight,
  ShieldCheck,
  Clock,
  Wind,
  Navigation,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Layers,
  Activity,
  Maximize2,
} from 'lucide-react';
import { formatPrice } from '../../services/currency';

interface ActiveAircraft {
  id: string;
  flightNumber: string;
  route: string;
  originCode: string;
  destinationCode: string;
  aircraft: string;
  baseAltitudeFt: number;
  baseSpeedKts: number;
  originPos: { x: number; y: number };
  destPos: { x: number; y: number };
  progress: number; // 0.0 to 1.0
  speedMultiplier: number;
  category: 'domestic' | 'international' | 'charter';
  squawk: string;
  departureTime: string;
  startingPriceNgn: number;
  captain: string;
  passengersOnboard: number;
  capacity: number;
}

const INITIAL_FLEET: ActiveAircraft[] = [
  {
    id: 'rad-1',
    flightNumber: 'AV-304',
    route: 'LOS → ABV',
    originCode: 'LOS',
    destinationCode: 'ABV',
    aircraft: 'Airbus A330-900neo',
    baseAltitudeFt: 34000,
    baseSpeedKts: 495,
    originPos: { x: 34, y: 64 },
    destPos: { x: 44, y: 46 },
    progress: 0.45,
    speedMultiplier: 0.0035,
    category: 'domestic',
    squawk: '4721',
    departureTime: '07:30 WAT',
    startingPriceNgn: 132000,
    captain: 'Capt. T. Adeleke',
    passengersOnboard: 284,
    capacity: 298,
  },
  {
    id: 'rad-2',
    flightNumber: 'AV-810',
    route: 'LOS → DXB',
    originCode: 'LOS',
    destinationCode: 'DXB',
    aircraft: 'Boeing 787-10 Dreamliner',
    baseAltitudeFt: 39000,
    baseSpeedKts: 540,
    originPos: { x: 34, y: 64 },
    destPos: { x: 82, y: 28 },
    progress: 0.62,
    speedMultiplier: 0.002,
    category: 'international',
    squawk: '7104',
    departureTime: '13:45 WAT',
    startingPriceNgn: 1280000,
    captain: 'Capt. M. Al-Mansoor',
    passengersOnboard: 312,
    capacity: 330,
  },
  {
    id: 'rad-3',
    flightNumber: 'AV-109',
    route: 'LOS → LHR',
    originCode: 'LOS',
    destinationCode: 'LHR',
    aircraft: 'Airbus A350-1000',
    baseAltitudeFt: 41000,
    baseSpeedKts: 555,
    originPos: { x: 34, y: 64 },
    destPos: { x: 42, y: 12 },
    progress: 0.28,
    speedMultiplier: 0.0018,
    category: 'international',
    squawk: '6230',
    departureTime: '22:15 WAT',
    startingPriceNgn: 1840000,
    captain: 'Capt. C. Sterling',
    passengersOnboard: 345,
    capacity: 360,
  },
  {
    id: 'rad-4',
    flightNumber: 'AV-415',
    route: 'LOS → ACC',
    originCode: 'LOS',
    destinationCode: 'ACC',
    aircraft: 'Embraer E195-E2',
    baseAltitudeFt: 28000,
    baseSpeedKts: 440,
    originPos: { x: 34, y: 64 },
    destPos: { x: 22, y: 66 },
    progress: 0.78,
    speedMultiplier: 0.004,
    category: 'domestic',
    squawk: '3512',
    departureTime: '15:20 WAT',
    startingPriceNgn: 215000,
    captain: 'Capt. K. Osei',
    passengersOnboard: 128,
    capacity: 132,
  },
  {
    id: 'rad-5',
    flightNumber: 'AV-901',
    route: 'ABV → PHC',
    originCode: 'ABV',
    destinationCode: 'PHC',
    aircraft: 'Airbus A321LR',
    baseAltitudeFt: 31000,
    baseSpeedKts: 460,
    originPos: { x: 44, y: 46 },
    destPos: { x: 40, y: 72 },
    progress: 0.52,
    speedMultiplier: 0.0038,
    category: 'domestic',
    squawk: '2844',
    departureTime: '16:00 WAT',
    startingPriceNgn: 145000,
    captain: 'Capt. F. Briggs',
    passengersOnboard: 186,
    capacity: 195,
  },
  {
    id: 'rad-6',
    flightNumber: 'ROYAL-01',
    route: 'VIP LAGOS CHARTER',
    originCode: 'LOS',
    destinationCode: 'JNB',
    aircraft: 'Bombardier Global 7500',
    baseAltitudeFt: 45000,
    baseSpeedKts: 585,
    originPos: { x: 34, y: 64 },
    destPos: { x: 55, y: 90 },
    progress: 0.35,
    speedMultiplier: 0.0025,
    category: 'charter',
    squawk: '0001',
    departureTime: 'ON DISPATCH',
    startingPriceNgn: 4500000,
    captain: 'Capt. E. Vane-Tempest',
    passengersOnboard: 12,
    capacity: 16,
  },
];

export const LiveRadarSection: React.FC = () => {
  const [fleet, setFleet] = useState<ActiveAircraft[]>(INITIAL_FLEET);
  const [selectedFlightId, setSelectedFlightId] = useState<string>(INITIAL_FLEET[0].id);
  const [activeCategory, setActiveCategory] = useState<'all' | 'domestic' | 'international' | 'charter'>('all');
  const [isSimPaused, setIsSimPaused] = useState(false);
  const [simSpeed, setSimSpeed] = useState<number>(1);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [sweepAngle, setSweepAngle] = useState(0);

  const { setFlightSearch, setActiveRoute, currency } = useAppStore();
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Play subtle radar beep when blip is scanned
  const playRadarPing = () => {
    if (!audioEnabled) return;
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.12);
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.12);
    } catch {
      // Audio not permitted without user gesture
    }
  };

  // Real-time animation loop for radar sweep and aircraft vector physics
  useEffect(() => {
    let lastTime = performance.now();
    let animationFrameId: number;

    const tick = (currentTime: number) => {
      const delta = (currentTime - lastTime) / 1000;
      lastTime = currentTime;

      if (!isSimPaused) {
        // Rotate sweep beam (45 degrees per second * simSpeed)
        setSweepAngle((prev) => (prev + 55 * delta * simSpeed) % 360);

        // Advance aircraft positions smoothly along corridors
        setFleet((prevFleet) =>
          prevFleet.map((flight) => {
            let nextProgress = flight.progress + flight.speedMultiplier * delta * simSpeed;
            if (nextProgress > 1) {
              nextProgress = 0; // Flight cycle resets smoothly
            }
            return {
              ...flight,
              progress: nextProgress,
            };
          })
        );
      }

      animationFrameId = requestAnimationFrame(tick);
    };

    animationFrameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isSimPaused, simSpeed]);

  // Filtered fleet
  const visibleFleet = useMemo(() => {
    if (activeCategory === 'all') return fleet;
    return fleet.filter((f) => f.category === activeCategory);
  }, [fleet, activeCategory]);

  const selectedFlight = useMemo(() => {
    return fleet.find((f) => f.id === selectedFlightId) || fleet[0];
  }, [fleet, selectedFlightId]);

  // Compute live current coordinates for each flight
  const getFlightCurrentPos = (f: ActiveAircraft) => {
    const x = f.originPos.x + (f.destPos.x - f.originPos.x) * f.progress;
    // Slight curvature arc
    const arcOffset = Math.sin(f.progress * Math.PI) * 4;
    const y = f.originPos.y + (f.destPos.y - f.originPos.y) * f.progress - arcOffset;
    return { x, y };
  };

  // Compute live altitude fluctuating with barometric turbulence
  const currentAltitude = useMemo(() => {
    const turbulence = Math.sin(selectedFlight.progress * 40) * 120;
    const alt = Math.round(selectedFlight.baseAltitudeFt + turbulence);
    return `${alt.toLocaleString()} FT`;
  }, [selectedFlight]);

  // Compute live ground speed
  const currentSpeed = useMemo(() => {
    const wind = Math.cos(selectedFlight.progress * 25) * 8;
    const spd = Math.round(selectedFlight.baseSpeedKts + wind);
    return `${spd} KTS`;
  }, [selectedFlight]);

  // Compute distance remaining (nm)
  const distanceRemaining = useMemo(() => {
    const totalDistance = 1450;
    const remaining = Math.max(12, Math.round((1 - selectedFlight.progress) * totalDistance));
    return `${remaining} NM`;
  }, [selectedFlight]);

  // Compute ETA countdown in minutes
  const etaMinutes = useMemo(() => {
    const mins = Math.max(2, Math.round((1 - selectedFlight.progress) * 165));
    const hours = Math.floor(mins / 60);
    const m = mins % 60;
    return hours > 0 ? `${hours}h ${m}m` : `${m} min`;
  }, [selectedFlight]);

  const handleBookSelected = (flight: ActiveAircraft) => {
    setFlightSearch({
      originCode: flight.originCode,
      destinationCode: flight.destinationCode,
    });
    setActiveRoute('/flights');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section id="live-radar-section" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header with High-Tech Aviation Radar Badge */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-xs font-mono tracking-widest text-[#2B7574] dark:text-[#F2B632] uppercase font-bold">
              04. SOVEREIGN CORRIDORS · RADAR TELEMETRY
            </span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-display font-bold text-[#0E2931] dark:text-[#EAEFEF] uppercase">
            Active Flight Corridors
          </h2>
          <p className="text-sm text-[#12484C]/80 dark:text-[#A5D1E1] mt-1 max-w-2xl font-light">
            Real-time radar transponder telemetry across West African domestic and intercontinental sovereign airways.
          </p>
        </div>

        {/* Telemetry Status Pill */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
          <div className="flex items-center gap-2 bg-[#09171C] text-[#F2B632] px-3.5 py-1.5 rounded-xl border border-[#2B7574]/40 shadow-sm">
            <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
            <span>LIVE RADAR · {visibleFleet.length} AIRBORNE</span>
          </div>

          {/* Audio Ping Toggle */}
          <button
            onClick={() => {
              setAudioEnabled(!audioEnabled);
              if (!audioEnabled) playRadarPing();
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition-colors cursor-pointer ${
              audioEnabled
                ? 'bg-[#12484C] text-[#F2B632] border-[#F2B632]/50'
                : 'bg-black/10 dark:bg-white/5 text-[#A5D1E1] border-white/10 hover:border-[#2B7574]'
            }`}
            title="Toggle synthesized radar sweep ping"
          >
            {audioEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            <span>{audioEnabled ? 'Audio Ping ON' : 'Audio Ping OFF'}</span>
          </button>
        </div>
      </div>

      {/* Corridor Filters & Speed Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 p-3 rounded-2xl bg-[#0E2931]/70 backdrop-blur-md border border-[#2B7574]/30 text-xs font-mono">
        {/* Category Filters */}
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar">
          <span className="text-[#A5D1E1]/70 text-[11px] uppercase mr-1">Route type:</span>
          {[
            { id: 'all', label: 'All routes' },
            { id: 'domestic', label: 'Domestic' },
            { id: 'international', label: 'International' },
            { id: 'charter', label: 'Charter Ops' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id as any)}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                activeCategory === cat.id
                  ? 'bg-[#F2B632] text-[#0E2931] font-bold shadow-sm'
                  : 'text-[#A5D1E1] hover:bg-white/10'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Speed & Pause Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsSimPaused(!isSimPaused)}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#12484C] text-[#F2B632] hover:bg-[#12484C]/80 cursor-pointer"
          >
            {isSimPaused ? <Play className="w-3 h-3 fill-current" /> : <Pause className="w-3 h-3" />}
            <span>{isSimPaused ? 'Resume animation' : 'Pause animation'}</span>
          </button>

          <button
            onClick={() => setSimSpeed(simSpeed === 1 ? 3 : 1)}
            className="px-2.5 py-1 rounded-lg bg-black/30 border border-white/10 text-[#A5D1E1] hover:text-white cursor-pointer"
          >
            {simSpeed}x Speed
          </button>
        </div>
      </div>

      {/* Main Radar Display Box — 10x Better Styling: 3D Glass, Depth, Glow, and Holographic Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 rounded-[32px] bg-[#0E2931]/80 backdrop-blur-[32px] border border-[#2B7574]/50 shadow-[0_40px_100px_-20px_rgba(9,23,28,0.9),inset_0_0_50px_rgba(25,159,177,0.15)] relative overflow-hidden p-5 sm:p-8 text-white">
        {/* 10x BETTER RADAR MAP CANVAS REPRESENTATION */}
        <div className="lg:col-span-8 relative min-h-[480px] sm:min-h-[580px] rounded-[24px] bg-[#061216] border border-[#199FB1]/30 overflow-hidden flex items-center justify-center select-none shadow-inner">
          {/* Holographic Grid Pattern with Depth */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2248%22%20height%3D%2248%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M0%200h48v48H0z%22%20fill%3D%22none%22%2F%3E%3Cpath%20d%3D%22M48%200L48%2048%200%2048%22%20fill%3D%22none%22%20stroke%3D%22%23199FB1%22%20stroke-width%3D%220.5%22%20opacity%3D%220.1%22%2F%3E%3Cpath%20d%3D%22M24%200v48M0%2024h48%22%20fill%3D%22none%22%20stroke%3D%22%23199FB1%22%20stroke-width%3D%220.5%22%20opacity%3D%220.05%22%2F%3E%3C%2Fsvg%3E') repeat center / 48px 48px opacity-30 pointer-events-none transition-opacity duration-1000\" />
          
          {/* Advanced Concentric Range Rings with Neon Glow */}
          <div className="absolute w-[95%] aspect-square rounded-full border border-[#199FB1]/20 shadow-[0_0_20px_rgba(25,159,177,0.1)] pointer-events-none animate-[pulse_8s_infinite]" />
          <div className="absolute w-[75%] aspect-square rounded-full border border-[#199FB1]/30 shadow-[0_0_15px_rgba(25,159,177,0.15)] pointer-events-none" />
          <div className="absolute w-[50%] aspect-square rounded-full border border-[#199FB1]/40 shadow-[0_0_10px_rgba(25,159,177,0.2)] pointer-events-none" />
          <div className="absolute w-[25%] aspect-square rounded-full border border-[#199FB1]/50 shadow-[0_0_8px_rgba(25,159,177,0.25)] pointer-events-none" />

          {/* 3D Laser Sweep Beam with Glow & Glass Reflection */}
          <div
            className="absolute top-1/2 left-1/2 w-[600px] h-[600px] -translate-x-1/2 -translate-y-1/2 pointer-events-none origin-center transition-transform duration-100 ease-linear"
            style={{
              transform: `translate(-50%, -50%) rotate(${sweepAngle}deg)`,
            }}
          >
            {/* Main Sweep Cone */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#199FB1]/60 via-[#F2B632]/30 to-transparent rotate-[15deg] transform origin-left" />
            {/* Central Core Laser */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[8px] h-[8px] bg-[#F2B632] rounded-full shadow-[0_0_30px_#F2B632] animate-[pulse_2s_infinite]" />
            {/* Outer Ring Scan */}
            <div className="absolute inset-0 border border-[#199FB1]/40 rounded-full animate-[spin_12s_linear_infinite]" />
          </div>

          {/* Advanced Flight Path Arc with Glitch & Glow Effect */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
            <defs>
              <filter id="glow-filter" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
              <linearGradient id="corridorGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#F2B632" stopOpacity="0.9" />
                <stop offset="50%" stopColor="#199FB1" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#199FB1" stopOpacity="0.2" />
              </linearGradient>
            </defs>
            <line
              x1={`${selectedFlight.originPos.x}%`}
              y1={`${selectedFlight.originPos.y}%`}
              x2={`${selectedFlight.destPos.x}%`}
              y2={`${selectedFlight.destPos.y}%`}
              stroke="url(#corridorGlow)"
              strokeWidth="3"
              strokeDasharray="8 4"
              filter="url(#glow-filter)"
              className="animate-[dash_4s_linear_infinite]"
              style={{ animationName: 'dash' }}
            />
          </svg>

          {/* Key Airport Waypoint Hubs with Advanced Pulse */}
          <div className="absolute left-[34%] top-[64%] text-[10px] font-mono text-[#199FB1] pointer-events-none flex items-center gap-1.5 z-10">
            <span className="w-2 h-2 rounded-full bg-[#199FB1] shadow-[0_0_12px_#199FB1] animate-[pulse_2s_infinite]" />
            <span className="font-bold tracking-wider">LOS (Lagos MM2)</span>
          </div>
          <div className="absolute left-[44%] top-[46%] text-[10px] font-mono text-[#199FB1] pointer-events-none flex items-center gap-1.5 z-10">
            <span className="w-2 h-2 rounded-full bg-[#199FB1] shadow-[0_0_12px_#199FB1] animate-[pulse_2s_infinite]" />
            <span className="font-bold tracking-wider">ABV (Abuja NAIA)</span>
          </div>
          <div className="absolute left-[40%] top-[72%] text-[10px] font-mono text-[#199FB1]/80 pointer-events-none flex items-center gap-1 z-10">
            <span className="w-1.5 h-1.5 rounded-full bg-[#199FB1]/70" />
            <span>PHC (Port Harcourt)</span>
          </div>
          <div className="absolute left-[22%] top-[66%] text-[10px] font-mono text-[#199FB1]/80 pointer-events-none flex items-center gap-1 z-10">
            <span className="w-1.5 h-1.5 rounded-full bg-[#199FB1]/70" />
            <span>ACC (Accra Kotoka)</span>
          </div>
          <div className="absolute left-[82%] top-[28%] text-[10px] font-mono text-[#199FB1] pointer-events-none flex items-center gap-1.5 z-10">
            <span className="w-2 h-2 rounded-full bg-[#199FB1] shadow-[0_0_12px_#199FB1] animate-[pulse_2s_infinite]" />
            <span className="font-bold tracking-wider">DXB (Dubai Intl)</span>
          </div>
          <div className="absolute left-[42%] top-[12%] text-[10px] font-mono text-[#199FB1] pointer-events-none flex items-center gap-1.5 z-10">
            <span className="w-2 h-2 rounded-full bg-[#199FB1] shadow-[0_0_12px_#199FB1] animate-[pulse_2s_infinite]" />
            <span className="font-bold tracking-wider">LHR (London Heathrow)</span>
          </div>

          {/* Interactive Airborne Aircraft Blips with Advanced Holographic Glow */}
          {visibleFleet.map((flight) => {
            const isSelected = selectedFlight.id === flight.id;
            const pos = getFlightCurrentPos(flight);

            // Compute angle of movement for plane rotation
            const dx = flight.destPos.x - flight.originPos.x;
            const dy = flight.destPos.y - flight.originPos.y;
            const angleDeg = (Math.atan2(dy, dx) * 180) / Math.PI + 45;

            return (
              <button
                key={flight.id}
                type="button"
                onClick={() => {
                  setSelectedFlightId(flight.id);
                  playRadarPing();
                }}
                style={{
                  left: `${pos.x}%`,
                  top: `${pos.y}%`,
                  transition: isSimPaused ? 'none' : 'left 0.1s linear, top 0.1s linear',
                }}
                className={`absolute -translate-x-1/2 -translate-y-1/2 p-3 rounded-2xl transition-all duration-300 cursor-pointer group z-20 ${
                  isSelected
                    ? 'scale-[1.3] bg-[#F2B632] text-[#0E2931] shadow-[0_0_40px_rgba(242,182,50,0.8),inset_0_0_15px_#F2B632] z-40 border border-[#F2B632]'
                    : 'bg-[#12484C]/95 text-[#199FB1] hover:scale-115 hover:bg-[#12484C] shadow-lg border border-[#199FB1]/50 group-hover:border-[#F2B632]'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <Plane
                    className={`w-5 h-5 transition-transform duration-500 ${isSelected ? 'text-[#F2B632]' : 'text-[#199FB1]'}`}
                    style={{ transform: `rotate(${angleDeg}deg)` }}
                  />
                  <span className={`font-mono text-[11px] font-bold whitespace-nowrap ${isSelected ? 'text-[#0E2931]' : 'text-[#199FB1]'}`}>
                    {flight.flightNumber}
                  </span>
                </div>

                {/* Advanced Pulsing Beacon Ping */}
                <span className={`absolute -top-1 -right-1 w-3 h-3 rounded-full ${isSelected ? 'bg-[#F2B632] shadow-[0_0_15px_#F2B632]' : 'bg-emerald-400 shadow-[0_0_8px_#199FB1]'} animate-ping`} />
                
                {/* Vector Trail */}
                {isSelected && (
                  <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-0.5 h-8 bg-gradient-to-b from-[#F2B632] to-transparent rounded-full" />
                )}
              </button>
            );
          })}

          {/* Glass Overlay Reflection */}
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-white/5 via-transparent to-black/30 rounded-[24px]" />
        </div>

        {/* Right Details Panel: Live Cockpit & Corridor Telemetry with 10x Better Glass UI */}
        <div className="lg:col-span-4 bg-[#0E2931]/60 rounded-[24px] p-7 sm:p-8 backdrop-blur-[24px] border border-[#199FB1]/40 flex flex-col justify-between space-y-6 shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
          <div>
            <div className="flex items-center justify-between mb-4 text-xs font-mono">
              <span className="text-[#F2B632] font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Navigation className="w-4 h-4" />
                FLIGHT TELEMETRY DATA
              </span>
              <span className="text-emerald-400 font-bold uppercase flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                SQUAWK {selectedFlight.squawk}
              </span>
            </div>

            <h3 className="font-display text-2xl sm:text-3xl font-bold uppercase tracking-tighter text-white drop-shadow-[0_2px_4px_rgba(242,182,50,0.3)]">
              {selectedFlight.flightNumber}
            </h3>
            <div className="text-sm font-mono text-[#A5D1E1] mt-0.5 flex items-center gap-2">
              <span>Route:</span>
              <strong className="text-white bg-[#12484C] px-2 py-0.5 rounded border border-[#199FB1]/40 font-bold">
                {selectedFlight.route}
              </strong>
            </div>

            {/* Live Avionics Telemetry Grid with Glass Cards */}
            <div className="grid grid-cols-2 gap-3 mt-6 pt-5 border-t border-[#199FB1]/30 text-xs font-mono">
              <div>
                <span className="text-[10px] text-[#A5D1E1] block uppercase tracking-wider">Cruising Altitude</span>
                <span className="text-base font-bold text-white tabular-nums drop-shadow-[0_1px_2px_rgba(255,255,255,0.5)]">{currentAltitude}</span>
              </div>
              <div>
                <span className="text-[10px] text-[#A5D1E1] block uppercase tracking-wider">Ground Speed</span>
                <span className="text-base font-bold text-white tabular-nums drop-shadow-[0_1px_2px_rgba(255,255,255,0.5)]">{currentSpeed}</span>
              </div>
              <div>
                <span className="text-[10px] text-[#A5D1E1] block uppercase tracking-wider">Assigned Aircraft</span>
                <span className="font-bold text-white truncate block">{selectedFlight.aircraft}</span>
              </div>
              <div>
                <span className="text-[10px] text-[#A5D1E1] block uppercase tracking-wider">Operating Carrier</span>
                <span className="font-bold text-[#F2B632] truncate block">{selectedFlight.captain}</span>
              </div>
              <div>
                <span className="text-[10px] text-[#A5D1E1] block uppercase tracking-wider">Distance Remaining</span>
                <span className="font-bold text-white">{distanceRemaining}</span>
              </div>
              <div>
                <span className="text-[10px] text-[#A5D1E1] block uppercase tracking-wider">Estimated Arrival</span>
                <span className="font-bold text-emerald-400">In {etaMinutes}</span>
              </div>
            </div>

            {/* Load Factor & Seat Capacity Bar with Advanced Glass Effect */}
            <div className="mt-5 p-4 rounded-[16px] bg-[#09171C]/80 border border-[#199FB1]/30 backdrop-blur-md space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-[#A5D1E1]">Passenger Load</span>
                <span className="text-white font-bold">
                  {selectedFlight.passengersOnboard} / {selectedFlight.capacity} ({Math.round((selectedFlight.passengersOnboard / selectedFlight.capacity) * 100)}%)
                </span>
              </div>
              <div className="w-full h-2 bg-[#18363F] rounded-full overflow-hidden border border-[#199FB1]/20">
                <div
                  className="h-full bg-gradient-to-r from-emerald-400 via-[#199FB1] to-[#F2B632] rounded-full shadow-[0_0_10px_rgba(242,182,50,0.4)]"
                  style={{ width: `${(selectedFlight.passengersOnboard / selectedFlight.capacity) * 100}%` }}
                />
              </div>
            </div>

            {/* Fare Price Box with Gold Gradient */}
            <div className="mt-5 p-5 rounded-[16px] bg-[#12484C]/80 border border-[#F2B632]/30 backdrop-blur-md flex flex-col items-center justify-center">
              <span className="text-[10px] font-mono text-[#A5D1E1] uppercase block mb-1">
                Fares from
              </span>
              <span className="text-3xl font-bold font-mono text-[#F2B632] tabular-nums drop-shadow-[0_2px_6px_rgba(242,182,50,0.5)]">
                {formatPrice(selectedFlight.startingPriceNgn, currency)}
              </span>
              <span className="text-[10px] text-[#A5D1E1]/70 block mt-1 font-mono">
                0% APR Financing Available
              </span>
            </div>
          </div>

          {/* Direct Booking Action with Glow */}
          <button
            type="button"
            onClick={() => handleBookSelected(selectedFlight)}
            className="w-full btn-gold py-4 px-5 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_25px_rgba(242,182,50,0.4)] group transition-all duration-300 hover:scale-[1.02]"
          >
            <span>Book Next Flight ({selectedFlight.route})</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Advanced CSS Keyframes for Radar Animations */}
        <style>{`
          @keyframes dash {
            0% { stroke-dashoffset: 100; }
            100% { stroke-dashoffset: 0; }
          }
          @keyframes pulse {
            0%, 100% { opacity: 0.6; transform: scale(1); }
            50% { opacity: 1; transform: scale(1.2); }
          }
        `}</style>
      </div>
    </section>
  );
};
