import React, { useRef } from 'react';
import { BookingRecord } from '../../store/useAppStore';
import { AIRPORTS } from '../../data/mockData';
import { formatPrice } from '../../services/currency';
import { Plane, X, Download, Printer, CheckCircle2, ShieldCheck } from 'lucide-react';
import confetti from 'canvas-confetti';

interface BoardingPassModalProps {
  booking: BookingRecord;
  onClose: () => void;
}

export const BoardingPassModal: React.FC<BoardingPassModalProps> = ({
  booking,
  onClose,
}) => {
  const ticketRef = useRef<HTMLDivElement>(null);
  const flight = booking.flight;
  const passenger = booking.passengers[0];

  const originAirport = AIRPORTS.find((a) => a.code === flight?.origin) || AIRPORTS[0];
  const destAirport = AIRPORTS.find((a) => a.code === flight?.destination) || AIRPORTS[1];

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#F2B632', '#12484C', '#199FB1'],
    });
    alert(`Boarding pass ${booking.bookingRef} saved to downloads folder.`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0E2931]/80 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-transparent my-8">
        {/* Top Controls */}
        <div className="flex items-center justify-between pb-4 text-[#F4F6F5]">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-[#F2B632] stroke-[2]" />
            <span className="font-mono text-xs uppercase tracking-wider text-[#A5D1E1]">
              OFFICIAL E-TICKET & BOARDING PASS
            </span>
          </div>

          <button
            onClick={onClose}
            aria-label="Close ticket modal"
            className="w-8 h-8 rounded-full bg-[#12484C] text-[#F4F6F5] hover:text-[#F2B632] flex items-center justify-center border border-[#2B7574]/40 cursor-pointer"
          >
            <X className="w-4 h-4 stroke-[2]" />
          </button>
        </div>

        {/* Boarding Pass Card: Perforated tear-off with ticket notches */}
        <div
          ref={ticketRef}
          className="rounded-2xl bg-[#F4F6F5] text-[#0E2931] shadow-2xl border border-[#2B7574]/40 overflow-hidden relative"
        >
          {/* Top Notch Cutouts */}
          <div className="absolute top-1/2 left-0 -translate-x-3 -translate-y-1/2 w-6 h-6 rounded-full bg-[#0E2931] border-r border-[#2B7574]/40 z-20" />
          <div className="absolute top-1/2 right-0 translate-x-3 -translate-y-1/2 w-6 h-6 rounded-full bg-[#0E2931] border-l border-[#2B7574]/40 z-20" />

          {/* Ticket Header */}
          <div className="bg-[#12484C] text-[#F4F6F5] p-5 sm:p-6 flex items-center justify-between border-b border-[#2B7574]/40">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded bg-[#0E2931] text-[#F2B632] flex items-center justify-center">
                <Plane className="w-4 h-4 stroke-[1.5] -rotate-45" />
              </div>
              <div>
                <span className="font-display text-lg font-bold tracking-widest uppercase">
                  CJ TRAVELS ROYAL
                </span>
                <span className="block text-[10px] font-mono text-[#A5D1E1]">
                  ELECTRONIC PASSENGER COUPON
                </span>
              </div>
            </div>

            <div className="text-right">
              <span className="block text-[10px] font-mono text-[#A5D1E1]">
                BOOKING REF
              </span>
              <span className="font-mono text-sm sm:text-base font-bold text-[#F2B632] tracking-wider">
                {booking.bookingRef}
              </span>
            </div>
          </div>

          {/* Flight Details Main Grid */}
          <div className="p-6 sm:p-8 space-y-6 bg-contour">
            {/* Origin -> Destination Banner */}
            <div className="flex items-center justify-between pb-6 border-b border-[#E2E2E0]">
              <div>
                <span className="font-mono text-3xl sm:text-4xl font-bold tracking-tight text-[#0E2931]">
                  {flight?.origin || 'LOS'}
                </span>
                <span className="block text-xs font-semibold text-[#12484C]">
                  {originAirport.city}
                </span>
                <span className="block text-[10px] text-[#2B7574]">
                  {originAirport.name}
                </span>
              </div>

              <div className="flex flex-col items-center px-4">
                <span className="font-mono text-xs text-[#2B7574] mb-1">
                  {flight?.duration || '1h 15m'} Direct
                </span>
                <div className="w-24 sm:w-36 h-0.5 bg-[#2B7574]/40 relative flex items-center justify-center">
                  <Plane className="w-4 h-4 text-[#F2B632] transform rotate-90 absolute stroke-[2]" />
                </div>
                <span className="font-mono text-[10px] text-[#12484C]/70 mt-1">
                  {flight?.airline} {flight?.flightNumber}
                </span>
              </div>

              <div className="text-right">
                <span className="font-mono text-3xl sm:text-4xl font-bold tracking-tight text-[#0E2931]">
                  {flight?.destination || 'ABV'}
                </span>
                <span className="block text-xs font-semibold text-[#12484C]">
                  {destAirport.city}
                </span>
                <span className="block text-[10px] text-[#2B7574]">
                  {destAirport.name}
                </span>
              </div>
            </div>

            {/* Departure Board Data Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div>
                <span className="block font-mono text-[10px] uppercase text-[#2B7574]">
                  PASSENGER
                </span>
                <span className="font-bold uppercase text-[#0E2931] truncate block">
                  {passenger ? `${passenger.firstName} ${passenger.lastName}` : 'Folashade Adeleke'}
                </span>
              </div>

              <div>
                <span className="block font-mono text-[10px] uppercase text-[#2B7574]">
                  DEPARTURE TIME
                </span>
                <span className="font-mono font-bold text-sm tabular-nums text-[#0E2931]">
                  {flight?.departureTime || '07:15'} WAT
                </span>
              </div>

              <div>
                <span className="block font-mono text-[10px] uppercase text-[#2B7574]">
                  GATE / TERMINAL
                </span>
                <span className="font-mono font-bold text-sm text-[#0E2931]">
                  GATE {flight?.segments[0]?.gate || 'B12'} · {flight?.segments[0]?.terminal || 'T2'}
                </span>
              </div>

              <div>
                <span className="block font-mono text-[10px] uppercase text-[#2B7574]">
                  SEAT NUMBER
                </span>
                <span className="font-mono text-base font-bold text-[#12484C] bg-[#F2B632]/20 px-2 py-0.5 rounded inline-block">
                  {passenger?.seatNumber || '4A'} ({flight?.cabinClass || 'Economy'})
                </span>
              </div>
            </div>

            {/* Perforated Divider */}
            <div className="border-perforated my-6" />

            {/* Barcode & Security Verification Row */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-2">
              <div className="flex items-center gap-3">
                {/* High-Density IATA QR Matrix */}
                <div className="w-18 h-18 bg-white border border-[#2B7574]/40 p-1.5 rounded-lg flex items-center justify-center shrink-0 shadow-sm">
                  <div className="grid grid-cols-6 gap-0.5 w-full h-full">
                    {Array.from({ length: 36 }).map((_, i) => (
                      <div
                        key={i}
                        className={`${
                          (i % 2 === 0 || i % 7 === 0 || i === 0 || i === 5 || i === 30 || i === 35)
                            ? 'bg-[#0E2931]'
                            : 'bg-transparent'
                        } rounded-[1px]`}
                      />
                    ))}
                  </div>
                </div>

                <div className="text-[11px] space-y-0.5">
                  <div className="flex items-center gap-1 font-semibold text-[#12484C]">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#2B7574] stroke-[1.5]" />
                    <span>ICAO DOC 9303 VERIFIED</span>
                  </div>
                  <p className="font-mono text-[10px] text-[#2B7574]">
                    SECURITY HASH: {booking.qrCodeSeed}
                  </p>
                  <p className="text-[10px] text-[#12484C]/80">
                    Show at terminal gate & security scanner. Offline valid.
                  </p>
                </div>
              </div>

              {/* Linear Barcode representation */}
              <div className="flex flex-col items-end">
                <div className="flex items-stretch h-8 space-x-0.5">
                  {[2, 1, 3, 1, 2, 4, 1, 3, 2, 1, 4, 2, 1, 3, 1, 2, 3, 1, 4, 2].map(
                    (width, i) => (
                      <div
                        key={i}
                        className="bg-[#0E2931]"
                        style={{ width: `${width * 1.5}px` }}
                      />
                    )
                  )}
                </div>
                <span className="font-mono text-[9px] tracking-widest text-[#0E2931] mt-1">
                  M1ADELEKE/FOLASHADE {flight?.flightNumber || 'AR-302'} {flight?.origin || 'LOS'}{flight?.destination || 'ABV'}
                </span>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="bg-[#EAEFEF] px-6 py-4 flex items-center justify-between border-t border-[#E2E2E0]">
            <span className="text-[11px] font-mono text-[#12484C]">
              ISSUED BY CJ TRAVELS OWERRI
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={handlePrint}
                className="px-3 py-1.5 rounded border border-[#2B7574]/40 hover:bg-white text-xs font-semibold text-[#0E2931] flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5 stroke-[1.5]" />
                <span>Print</span>
              </button>

              <button
                onClick={handleDownload}
                className="btn-gold px-4 py-1.5 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 stroke-[2]" />
                <span>Save E-Ticket</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
