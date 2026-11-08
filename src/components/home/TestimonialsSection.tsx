import React, { useState, useEffect } from 'react';
import { MOCK_TESTIMONIALS } from '../../data/mockData';
import {
  Volume2,
  VolumeX,
  Radio,
  ShieldCheck,
  Disc,
  Play,
  Pause,
  Plane,
  Compass,
  CheckCircle2,
  Activity,
  Lock
} from 'lucide-react';

interface EnhancedLog {
  id: string;
  author: string;
  title: string;
  route: string;
  verifiedBookingRef: string;
  quote: string;
  travelMonth: string;
  frequency: string;
  aircraft: string;
  flightLevel: string;
  groundSpeed: string;
  duration: string;
  coordinates: string;
}

const BLACK_BOX_LOGS: EnhancedLog[] = [
  {
    id: 'fdr-01',
    author: 'Dr. Amina Bello-Kano',
    title: 'Senior Health Director · Dubai Delegation',
    route: 'LOS → DXB · Emirates Private Suite',
    verifiedBookingRef: 'PNR-90241-DXB',
    quote:
      'CJ Travels Owerri’s airside fast-track and lie-flat suite booking made my medical summit travel in Dubai completely seamless. The 0% Fly Now Pay Later facility allowed our medical team to travel on short notice without budget reallocation delays.',
    travelMonth: 'OCT 2026',
    frequency: '128.450 MHz',
    aircraft: 'Boeing 787-10 Dreamliner',
    flightLevel: 'FL390 (39,000 FT)',
    groundSpeed: '535 KTS (990 KM/H)',
    duration: '00:38 SEC',
    coordinates: '15°12\'N 048°21\'E',
  },
  {
    id: 'fdr-02',
    author: 'Engr. Babatunde Adeleke',
    title: 'Managing Director · West Africa Infra Fund',
    route: 'LOS → ABV · Presidential Corridor',
    verifiedBookingRef: 'PNR-78104-ABV',
    quote:
      'The synchronized Maybach chauffeur waiting on the tarmac at Nnamdi Azikiwe International saved our executive team over an hour during our ministerial briefing. The guaranteed power resilience in Maitama meant zero technical disruptions.',
    travelMonth: 'NOV 2026',
    frequency: '131.200 MHz',
    aircraft: 'Airbus A330-900neo',
    flightLevel: 'FL350 (35,000 FT)',
    groundSpeed: '470 KTS (870 KM/H)',
    duration: '00:44 SEC',
    coordinates: '09°00\'N 007°15\'E',
  },
  {
    id: 'fdr-03',
    author: 'Chief Oladipo Williams',
    title: 'Maritime & Continental Trade Delegate',
    route: 'LOS → LHR · Transatlantic Suite',
    verifiedBookingRef: 'PNR-66290-LHR',
    quote:
      'Unrivaled executive flight service. From private VIP suite boarding at MM2 Terminal 2 to the Heathrow tarmac escort, CJ Travels Owerri represents the pinnacle of sovereign African aviation and reliable dispatch.',
    travelMonth: 'OCT 2026',
    frequency: '119.800 MHz',
    aircraft: 'Airbus A350-1000',
    flightLevel: 'FL410 (41,000 FT)',
    groundSpeed: '550 KTS (1,018 KM/H)',
    duration: '00:52 SEC',
    coordinates: '24°48\'N 012°34\'E',
  },
];

export const TestimonialsSection: React.FC = () => {
  const [activeLogIndex, setActiveLogIndex] = useState(0);
  const [isPlayingAudio, setIsPlayingAudio] = useState(true);
  const [waveformBars, setWaveformBars] = useState<number[]>([
    25, 45, 70, 95, 80, 50, 65, 90, 100, 75, 40, 60, 85, 90, 70, 45, 30, 55, 85, 95, 60, 35, 20
  ]);

  const activeLog = BLACK_BOX_LOGS[activeLogIndex];

  // Dynamic waveform pulsation during transmission playback
  useEffect(() => {
    if (!isPlayingAudio) return;
    const interval = setInterval(() => {
      setWaveformBars((prev) =>
        prev.map(() => Math.floor(Math.random() * 85) + 15)
      );
    }, 180);
    return () => clearInterval(interval);
  }, [isPlayingAudio]);

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header with Aviation Telemetry Prefix */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-xs font-mono tracking-widest text-[#2B7574] dark:text-[#F2B632] uppercase">
              05. PASSENGER FLIGHT LOGBOOK &amp; DISPATCH TRANSMISSIONS
            </span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-display font-bold text-[#0E2931] dark:text-[#EAEFEF] uppercase">
            Voices From the Sovereign Flight Deck
          </h2>
          <p className="text-sm text-[#12484C]/80 dark:text-[#A5D1E1] mt-1 max-w-2xl">
            Authenticated passenger flight logs and executive journeys recorded across West African and international corridors.
          </p>
        </div>

        {/* Cryptographic Seal Watermark */}
        <div className="flex items-center gap-2 bg-[#12484C]/10 dark:bg-white/5 backdrop-blur-md px-4 py-2 rounded-xl text-xs font-mono text-[#12484C] dark:text-[#F2B632]">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span>VERIFIED PASSENGER LOGBOOK</span>
        </div>
      </div>

      {/* Unprecedented Flight Deck Black Box Console Container */}
      <div className="rounded-3xl bg-gradient-to-b from-[#09171C] via-[#0E2931] to-[#0A1B20] text-white p-6 sm:p-10 shadow-[0_30px_70px_-20px_rgba(9,23,28,0.7)] relative overflow-hidden">
        {/* Radar concentric sweep ambient background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full border border-[#2B7574]/10 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] rounded-full border border-[#199FB1]/10 pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Radio Channel & Flight Frequency Selector */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10 text-xs font-mono">
              <span className="text-[#A5D1E1] uppercase tracking-wider flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5 text-[#F2B632]" />
                COMM CHANNELS (VHF)
              </span>
              <span className="text-emerald-400 font-bold">MONITORING</span>
            </div>

            <div className="space-y-3">
              {BLACK_BOX_LOGS.map((log, idx) => {
                const isActive = activeLogIndex === idx;
                return (
                  <div
                    key={log.id}
                    onClick={() => setActiveLogIndex(idx)}
                    className={`p-4 rounded-2xl transition-all duration-300 cursor-pointer flex flex-col justify-between relative overflow-hidden ${
                      isActive
                        ? 'bg-gradient-to-r from-[#12484C] to-[#0D5C75] shadow-lg shadow-[#12484C]/50 translate-x-1'
                        : 'bg-white/5 hover:bg-white/10 hover:translate-x-0.5'
                    }`}
                  >
                    {/* Active Accent Bar */}
                    {isActive && (
                      <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#F2B632]" />
                    )}

                    <div className="flex items-center justify-between text-xs font-mono mb-1">
                      <span className="text-[#F2B632] font-bold">{log.frequency}</span>
                      <span className="text-[10px] text-[#A5D1E1]">{log.travelMonth}</span>
                    </div>

                    <div className="font-bold text-sm text-white uppercase tracking-wide">
                      {log.author}
                    </div>
                    <div className="text-xs text-[#A5D1E1]/80 font-mono mt-0.5">
                      {log.route}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Flight Recorder Telemetry Widget */}
            <div className="mt-6 p-4 rounded-2xl bg-black/30 border border-white/5 space-y-2 text-xs font-mono">
              <div className="text-[#F2B632] text-[10px] uppercase tracking-widest font-bold">
                TELEMETRY ENCODE ARCHIVE
              </div>
              <div className="flex justify-between text-[#A5D1E1]">
                <span>AIRCRAFT:</span>
                <span className="text-white font-bold">{activeLog.aircraft}</span>
              </div>
              <div className="flex justify-between text-[#A5D1E1]">
                <span>CRUISE LEVEL:</span>
                <span className="text-white font-bold">{activeLog.flightLevel}</span>
              </div>
              <div className="flex justify-between text-[#A5D1E1]">
                <span>AIRSPEED:</span>
                <span className="text-white font-bold">{activeLog.groundSpeed}</span>
              </div>
              <div className="flex justify-between text-[#A5D1E1]">
                <span>COORDINATES:</span>
                <span className="text-[#F2B632] font-bold">{activeLog.coordinates}</span>
              </div>
            </div>
          </div>

          {/* Right Column: Active Acoustic Tape & Verbatim Transcript */}
          <div className="lg:col-span-8 bg-black/40 rounded-3xl p-6 sm:p-8 border border-white/10 flex flex-col justify-between space-y-6 relative">
            {/* Top Playback Control Ribbon */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                  className="w-12 h-12 rounded-2xl bg-[#F2B632] hover:bg-[#e6a827] text-[#0E2931] flex items-center justify-center font-bold transition-transform active:scale-95 cursor-pointer shadow-md"
                  aria-label={isPlayingAudio ? 'Pause transcript audio' : 'Play transcript audio'}
                >
                  {isPlayingAudio ? (
                    <Pause className="w-5 h-5 fill-current" />
                  ) : (
                    <Play className="w-5 h-5 fill-current ml-0.5" />
                  )}
                </button>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono uppercase text-[#F2B632] font-bold">
                      {isPlayingAudio ? 'PLAYING AUDIO RECORD' : 'AUDIO PAUSED'}
                    </span>
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  </div>
                  <div className="text-xs font-mono text-[#A5D1E1]">
                    UTC TIME 14:22:08 · DURATION: {activeLog.duration}
                  </div>
                </div>
              </div>

              {/* Soundwave Bars Visualizer */}
              <div className="flex items-end gap-1.5 h-10 px-4 py-1 rounded-xl bg-white/5 self-start sm:self-auto">
                {waveformBars.map((height, i) => (
                  <div
                    key={i}
                    className="w-1 bg-[#F2B632] rounded-full transition-all duration-150"
                    style={{
                      height: `${isPlayingAudio ? height : 15}%`,
                      opacity: isPlayingAudio ? 0.9 : 0.3,
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Verbatim Transcription Body */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-[#A5D1E1] tracking-widest uppercase">
                  OFFICIAL DEBRIEF TRANSCRIPT
                </span>
                <span className="text-xs font-mono text-[#F2B632] bg-[#12484C] px-3 py-1 rounded-lg">
                  VERIFIED PNR: {activeLog.verifiedBookingRef}
                </span>
              </div>

              <blockquote className="text-base sm:text-xl font-body text-white leading-relaxed italic">
                "{activeLog.quote}"
              </blockquote>
            </div>

            {/* Verification Sign-Off Footer */}
            <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="font-display font-bold text-base uppercase text-white tracking-wide">
                  {activeLog.author}
                </div>
                <div className="text-xs text-[#A5D1E1] font-mono mt-0.5">
                  {activeLog.title}
                </div>
              </div>

              <div className="flex items-center gap-3 self-start sm:self-auto bg-white/5 px-4 py-2 rounded-xl text-xs font-mono text-[#A5D1E1]">
                <Lock className="w-3.5 h-3.5 text-emerald-400" />
                <span>SHA-256 SIGNATURE VALID</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
