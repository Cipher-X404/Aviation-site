import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CurrencyCode } from '../services/currency';
import { Flight, Hotel, BundleDeal, MOCK_FLIGHTS } from '../data/mockData';
import { LoanBreakdown, LoanDecisionResult, RepaymentInstallment } from '../config/loan';

export interface PassengerInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth?: string;
  passportNumber?: string;
  nationality?: string;
  seatNumber?: string;
  mealPreference?: string;
  extraBaggageKg?: number;
}

export interface BookingRecord {
  id: string;
  bookingRef: string;
  type: 'flight' | 'hotel' | 'bundle';
  flight?: Flight;
  hotel?: Hotel;
  hotelNights?: number;
  passengers: PassengerInfo[];
  totalPaidNgn: number;
  paymentMethod: 'card' | 'transfer' | 'paylater';
  loanDetails?: {
    tenureMonths: number;
    monthlyPaymentNgn: number;
    downPaymentPaidNgn: number;
    remainingBalanceNgn: number;
    totalPaidSoFarNgn: number;
    installmentsRemaining: number;
  };
  bookingDate: string;
  travelDate: string;
  status: 'confirmed' | 'active' | 'completed';
  qrCodeSeed: string;
  gate?: string;
  seat?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'traveler' | 'admin';
  tier: 'Onyx Presidential' | 'Gold Sovereign' | 'Silver Vanguard';
  milesBalance: number;
  passportNumber: string;
  phone: string;
  avatarUrl?: string;
  nationalIdMasked: string;
  jobTitle?: string;
  dispatchStation?: string;
}

export interface FlightOpsRecord {
  id: string;
  flightNumber: string;
  route: string;
  origin: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  aircraft: string;
  gate: string;
  status: 'On Time' | 'Boarding' | 'Airborne' | 'Landed' | 'Delayed';
  loadFactorPercent: number;
  passengersBooked: number;
  capacity: number;
  captain: string;
}

export interface UnderwritingApplication {
  id: string;
  applicantName: string;
  bvnMasked: string;
  monthlyIncomeNgn: number;
  requestedNgn: number;
  tenureMonths: number;
  creditScore: number;
  dtiRatioPercent: number;
  riskTier: 'Tier 1 Prime' | 'Tier 2 Low Risk' | 'Tier 3 Review Required';
  status: 'Pending' | 'Approved' | 'Declined';
  flightRoute: string;
  submittedAt: string;
}

export interface AppState {
  // Auth
  currentUser: UserProfile;
  isAuthModalOpen: boolean;
  setAuthModalOpen: (open: boolean) => void;
  login: (role: 'traveler' | 'admin', name?: string, email?: string) => void;
  logout: () => void;
  switchRole: () => void;

  // Navigation
  activeRoute: string;
  setActiveRoute: (route: string) => void;

  // Preferences
  currency: CurrencyCode;
  setCurrency: (c: CurrencyCode) => void;
  theme: 'light' | 'dark' | 'system';
  setTheme: (t: 'light' | 'dark' | 'system') => void;

  // Flight Search State
  originCode: string;
  destinationCode: string;
  departureDate: string;
  returnDate: string;
  tripType: 'round-trip' | 'one-way' | 'multi-city';
  passengersCount: number;
  cabinClass: 'Economy' | 'Business' | 'First';
  setFlightSearch: (params: Partial<{
    originCode: string;
    destinationCode: string;
    departureDate: string;
    returnDate: string;
    tripType: 'round-trip' | 'one-way' | 'multi-city';
    passengersCount: number;
    cabinClass: 'Economy' | 'Business' | 'First';
  }>) => void;

  // Hotel Search State
  hotelDestinationCode: string;
  hotelCheckInDate: string;
  hotelCheckOutDate: string;
  hotelGuests: number;
  setHotelSearch: (params: Partial<{
    hotelDestinationCode: string;
    hotelCheckInDate: string;
    hotelCheckOutDate: string;
    hotelGuests: number;
  }>) => void;

  // Active selections
  selectedFlight: Flight | null;
  setSelectedFlight: (f: Flight | null) => void;
  selectedHotel: Hotel | null;
  setSelectedHotel: (h: Hotel | null) => void;
  selectedBundle: BundleDeal | null;
  setSelectedBundle: (b: BundleDeal | null) => void;

  // Booking Flow Draft
  passengers: PassengerInfo[];
  setPassengers: (p: PassengerInfo[]) => void;
  addPassenger: (p: PassengerInfo) => void;
  selectedSeat: string;
  setSelectedSeat: (s: string) => void;

  // Active confirmed booking / E-ticket
  latestBooking: BookingRecord | null;
  setLatestBooking: (b: BookingRecord | null) => void;
  bookingHistory: BookingRecord[];
  addBookingToHistory: (b: BookingRecord) => void;
  payLoanInstallment: (bookingId: string, amountNgn: number) => void;

  // Fly Now Pay Later Draft & Decision
  loanDraft: {
    requestedAmount: number;
    tenureMonths: number;
    downPaymentPercent: number;
    fullName: string;
    email: string;
    phone: string;
    bvnOrNin: string;
    monthlyIncome: number;
    employmentType: 'employed' | 'self-employed' | 'business' | 'contract';
    employerName: string;
    idUploaded: boolean;
    selfieVerified: boolean;
  };
  setLoanDraft: (draft: Partial<AppState['loanDraft']>) => void;
  activeLoanDecision: LoanDecisionResult | null;
  setActiveLoanDecision: (d: LoanDecisionResult | null) => void;

  // Saved Items
  savedHotelIds: string[];
  toggleSaveHotel: (id: string) => void;

  // Admin Operational State
  flightOps: FlightOpsRecord[];
  underwritingQueue: UnderwritingApplication[];
  updateFlightOps: (flightId: string, partial: Partial<FlightOpsRecord>) => void;
  approveUnderwriting: (appId: string) => void;
  declineUnderwriting: (appId: string) => void;

  // Support Widget
  isSupportOpen: boolean;
  setSupportOpen: (open: boolean) => void;
}

const DEFAULT_TRAVELER_PROFILE: UserProfile = {
  id: 'usr-folashade',
  name: 'Dr. Folashade Adeleke',
  email: 'folashade.adeleke@lagoonhealth.ng',
  role: 'traveler',
  tier: 'Onyx Presidential',
  milesBalance: 148_250,
  passportNumber: 'A18944201',
  phone: '+234 803 456 7890',
  nationalIdMasked: '2234 •••• 8901',
  jobTitle: 'Consultant Cardiovascular Surgeon',
};

const DEFAULT_ADMIN_PROFILE: UserProfile = {
  id: 'adm-capt-kayode',
  name: 'Capt. Kayode Balogun',
  email: 'dispatch.director@aerovista.aero',
  role: 'admin',
  tier: 'Onyx Presidential',
  milesBalance: 980_000,
  passportNumber: 'A00918234',
  phone: '+234 802 999 1000',
  nationalIdMasked: '1102 •••• 9922',
  jobTitle: 'Chief Dispatcher & Underwriting Oversight',
  dispatchStation: 'Lagos MM2 Flight Deck Control (LOS/DNMM)',
};

const INITIAL_FLIGHT_OPS: FlightOpsRecord[] = [
  {
    id: 'fop-1',
    flightNumber: 'AV-304',
    route: 'LOS → ABV',
    origin: 'Lagos (LOS)',
    destination: 'Abuja (ABV)',
    departureTime: '07:30 WAT',
    arrivalTime: '08:45 WAT',
    aircraft: 'Airbus A330-900neo',
    gate: 'Gate B4',
    status: 'Airborne',
    loadFactorPercent: 94,
    passengersBooked: 264,
    capacity: 281,
    captain: 'Capt. S. Alabi',
  },
  {
    id: 'fop-2',
    flightNumber: 'AV-810',
    route: 'LOS → DXB',
    origin: 'Lagos (LOS)',
    destination: 'Dubai (DXB)',
    departureTime: '13:45 WAT',
    arrivalTime: '23:15 GST',
    aircraft: 'Boeing 787-10 Dreamliner',
    gate: 'Gate E12',
    status: 'Boarding',
    loadFactorPercent: 98,
    passengersBooked: 312,
    capacity: 318,
    captain: 'Capt. T. Danjuma',
  },
  {
    id: 'fop-3',
    flightNumber: 'AV-109',
    route: 'LOS → LHR',
    origin: 'Lagos (LOS)',
    destination: 'London (LHR)',
    departureTime: '22:15 WAT',
    arrivalTime: '05:10 BST',
    aircraft: 'Airbus A350-1000',
    gate: 'Gate E02',
    status: 'On Time',
    loadFactorPercent: 91,
    passengersBooked: 335,
    capacity: 369,
    captain: 'Capt. E. Okafor',
  },
  {
    id: 'fop-4',
    flightNumber: 'AV-415',
    route: 'LOS → ACC',
    origin: 'Lagos (LOS)',
    destination: 'Accra (ACC)',
    departureTime: '15:20 WAT',
    arrivalTime: '15:30 GMT',
    aircraft: 'Embraer E195-E2',
    gate: 'Gate C01',
    status: 'On Time',
    loadFactorPercent: 86,
    passengersBooked: 114,
    capacity: 132,
    captain: 'Capt. K. Boateng',
  },
  {
    id: 'fop-5',
    flightNumber: 'AV-702',
    route: 'LOS → NBO',
    origin: 'Lagos (LOS)',
    destination: 'Nairobi (NBO)',
    departureTime: '11:00 WAT',
    arrivalTime: '18:45 EAT',
    aircraft: 'Boeing 787-9 Dreamliner',
    gate: 'Gate D08',
    status: 'Delayed',
    loadFactorPercent: 89,
    passengersBooked: 258,
    capacity: 290,
    captain: 'Capt. F. Mwangi',
  },
];

const INITIAL_UNDERWRITING_QUEUE: UnderwritingApplication[] = [
  {
    id: 'uw-101',
    applicantName: 'Dr. Folashade Adeleke',
    bvnMasked: '2234 •••• 8901',
    monthlyIncomeNgn: 850_000,
    requestedNgn: 650_000,
    tenureMonths: 6,
    creditScore: 785,
    dtiRatioPercent: 14.8,
    riskTier: 'Tier 1 Prime',
    status: 'Approved',
    flightRoute: 'LOS → DXB (Royal Suite)',
    submittedAt: 'Today, 09:15 WAT',
  },
  {
    id: 'uw-102',
    applicantName: 'Chinedu Eze & Associates',
    bvnMasked: '2288 •••• 1044',
    monthlyIncomeNgn: 1_400_000,
    requestedNgn: 1_250_000,
    tenureMonths: 4,
    creditScore: 740,
    dtiRatioPercent: 22.3,
    riskTier: 'Tier 1 Prime',
    status: 'Approved',
    flightRoute: 'LOS → LHR (Business)',
    submittedAt: 'Today, 10:40 WAT',
  },
  {
    id: 'uw-103',
    applicantName: 'Amina Bello',
    bvnMasked: '2211 •••• 4402',
    monthlyIncomeNgn: 450_000,
    requestedNgn: 380_000,
    tenureMonths: 6,
    creditScore: 690,
    dtiRatioPercent: 28.1,
    riskTier: 'Tier 2 Low Risk',
    status: 'Pending',
    flightRoute: 'LOS → ABV (Vanguard)',
    submittedAt: 'Today, 11:22 WAT',
  },
  {
    id: 'uw-104',
    applicantName: 'Tariq Al-Mansoor',
    bvnMasked: '2299 •••• 3311',
    monthlyIncomeNgn: 320_000,
    requestedNgn: 920_000,
    tenureMonths: 6,
    creditScore: 610,
    dtiRatioPercent: 52.4,
    riskTier: 'Tier 3 Review Required',
    status: 'Pending',
    flightRoute: 'LOS → JNB (Business)',
    submittedAt: 'Today, 12:05 WAT',
  },
];

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Auth State
      currentUser: DEFAULT_TRAVELER_PROFILE,
      isAuthModalOpen: false,
      setAuthModalOpen: (open) => set({ isAuthModalOpen: open }),
      login: (role, name, email) => {
        if (role === 'admin') {
          set({
            currentUser: {
              ...DEFAULT_ADMIN_PROFILE,
              name: name || DEFAULT_ADMIN_PROFILE.name,
              email: email || DEFAULT_ADMIN_PROFILE.email,
            },
            isAuthModalOpen: false,
          });
        } else {
          set({
            currentUser: {
              ...DEFAULT_TRAVELER_PROFILE,
              name: name || DEFAULT_TRAVELER_PROFILE.name,
              email: email || DEFAULT_TRAVELER_PROFILE.email,
            },
            isAuthModalOpen: false,
          });
        }
      },
      logout: () => {
        set({
          currentUser: DEFAULT_TRAVELER_PROFILE,
          isAuthModalOpen: false,
        });
      },
      switchRole: () => {
        const current = get().currentUser;
        if (current.role === 'traveler') {
          set({ currentUser: DEFAULT_ADMIN_PROFILE });
        } else {
          set({ currentUser: DEFAULT_TRAVELER_PROFILE });
        }
      },

      // Navigation
      activeRoute: '/',
      setActiveRoute: (route) => set({ activeRoute: route }),

      currency: 'NGN',
      setCurrency: (currency) => set({ currency }),

      theme: 'system',
      setTheme: (theme) => set({ theme }),

      originCode: 'LOS',
      destinationCode: 'ABV',
      departureDate: '2026-11-12',
      returnDate: '2026-11-18',
      tripType: 'round-trip',
      passengersCount: 1,
      cabinClass: 'Economy',
      setFlightSearch: (params) => {
        set((state) => ({
          ...state,
          ...params,
          hotelDestinationCode: params.destinationCode || state.hotelDestinationCode,
          hotelCheckInDate: params.departureDate || state.hotelCheckInDate,
          hotelCheckOutDate: params.returnDate || state.hotelCheckOutDate,
        }));
      },

      hotelDestinationCode: 'ABV',
      hotelCheckInDate: '2026-11-12',
      hotelCheckOutDate: '2026-11-18',
      hotelGuests: 1,
      setHotelSearch: (params) => set((state) => ({ ...state, ...params })),

      selectedFlight: null,
      setSelectedFlight: (selectedFlight) => set({ selectedFlight }),

      selectedHotel: null,
      setSelectedHotel: (selectedHotel) => set({ selectedHotel }),

      selectedBundle: null,
      setSelectedBundle: (selectedBundle) => set({ selectedBundle }),

      passengers: [
        {
          firstName: 'Folashade',
          lastName: 'Adeleke',
          email: 'folashade.adeleke@lagoonhealth.ng',
          phone: '+234 803 456 7890',
          seatNumber: '4A',
          passportNumber: 'A18944201',
          nationality: 'Nigerian',
          mealPreference: 'Gourmet Vegetarian / Halal',
        },
      ],
      setPassengers: (passengers) => set({ passengers }),
      addPassenger: (passenger) =>
        set((state) => ({ passengers: [...state.passengers, passenger] })),

      selectedSeat: '4A',
      setSelectedSeat: (selectedSeat) => set({ selectedSeat }),

      latestBooking: null,
      setLatestBooking: (latestBooking) => set({ latestBooking }),

      bookingHistory: [
        {
          id: 'bk-seeded-01',
          bookingRef: 'AV-7821-LOS',
          type: 'flight',
          passengers: [
            {
              firstName: 'Folashade',
              lastName: 'Adeleke',
              email: 'folashade.adeleke@lagoonhealth.ng',
              phone: '+234 803 456 7890',
              seatNumber: '4A',
              passportNumber: 'A18944201',
            },
          ],
          flight: MOCK_FLIGHTS[0],
          totalPaidNgn: 148_500,
          paymentMethod: 'paylater',
          loanDetails: {
            tenureMonths: 6,
            monthlyPaymentNgn: 27_850,
            downPaymentPaidNgn: 29_700,
            remainingBalanceNgn: 111_400,
            totalPaidSoFarNgn: 57_550,
            installmentsRemaining: 4,
          },
          bookingDate: '2026-10-24',
          travelDate: '2026-11-12',
          status: 'confirmed',
          qrCodeSeed: 'AV7821LOSCONFIRMED',
          gate: 'Gate B4',
          seat: '4A',
        },
      ],
      addBookingToHistory: (booking) =>
        set((state) => ({
          bookingHistory: [booking, ...state.bookingHistory],
          latestBooking: booking,
        })),

      payLoanInstallment: (bookingId, amountNgn) =>
        set((state) => {
          const updated = state.bookingHistory.map((b) => {
            if (b.id === bookingId && b.loanDetails) {
              const newRemaining = Math.max(0, b.loanDetails.remainingBalanceNgn - amountNgn);
              const newPaid = b.loanDetails.totalPaidSoFarNgn + amountNgn;
              const newInstallments = Math.max(0, b.loanDetails.installmentsRemaining - 1);
              return {
                ...b,
                loanDetails: {
                  ...b.loanDetails,
                  remainingBalanceNgn: newRemaining,
                  totalPaidSoFarNgn: newPaid,
                  installmentsRemaining: newInstallments,
                },
              };
            }
            return b;
          });
          return { bookingHistory: updated };
        }),

      loanDraft: {
        requestedAmount: 650_000,
        tenureMonths: 6,
        downPaymentPercent: 20,
        fullName: 'Dr. Folashade Adeleke',
        email: 'folashade.adeleke@lagoonhealth.ng',
        phone: '+234 803 456 7890',
        bvnOrNin: '22345678901',
        monthlyIncome: 850_000,
        employmentType: 'employed',
        employerName: 'Lagoon Premier Health Group',
        idUploaded: true,
        selfieVerified: true,
      },
      setLoanDraft: (draft) =>
        set((state) => ({ loanDraft: { ...state.loanDraft, ...draft } })),

      activeLoanDecision: null,
      setActiveLoanDecision: (activeLoanDecision) => set({ activeLoanDecision }),

      savedHotelIds: ['hotel-eko-grand'],
      toggleSaveHotel: (id) =>
        set((state) => {
          const exists = state.savedHotelIds.includes(id);
          return {
            savedHotelIds: exists
              ? state.savedHotelIds.filter((item) => item !== id)
              : [...state.savedHotelIds, id],
          };
        }),

      // Admin state
      flightOps: INITIAL_FLIGHT_OPS,
      underwritingQueue: INITIAL_UNDERWRITING_QUEUE,
      updateFlightOps: (flightId, partial) =>
        set((state) => ({
          flightOps: state.flightOps.map((f) => (f.id === flightId ? { ...f, ...partial } : f)),
        })),
      approveUnderwriting: (appId) =>
        set((state) => ({
          underwritingQueue: state.underwritingQueue.map((app) =>
            app.id === appId ? { ...app, status: 'Approved' } : app
          ),
        })),
      declineUnderwriting: (appId) =>
        set((state) => ({
          underwritingQueue: state.underwritingQueue.map((app) =>
            app.id === appId ? { ...app, status: 'Declined' } : app
          ),
        })),

      isSupportOpen: false,
      setSupportOpen: (isSupportOpen) => set({ isSupportOpen }),
    }),
    {
      name: 'aerovista-app-store',
      partialize: (state) => ({
        currency: state.currency,
        theme: state.theme,
        currentUser: state.currentUser,
        originCode: state.originCode,
        destinationCode: state.destinationCode,
        passengers: state.passengers,
        bookingHistory: state.bookingHistory,
        savedHotelIds: state.savedHotelIds,
      }),
    }
  )
);
