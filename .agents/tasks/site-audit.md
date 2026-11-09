# CJ Travels Owerri — Site Audit Report

**Audited:** src/App.tsx and all referenced components  
**Project type:** React + TypeScript + Vite + Tailwind CSS SPA (frontend-only)  
**Audit scope:** Routes, features, UI/UX gaps, missing pages, navigation, forms, admin, account, support widget

---

## 1. Executive Summary

CJ Travels Owerri is a well-designed, premium travel booking SPA with strong UI polish (dark/light theming, smooth scroll, GSAP animations, gold/teal brand system). The core booking funnel — flight search → seat selection → payment → boarding pass — is fully wired. However, the site is missing several pages and features that a real travel agency site needs, some features are UI-only (no real backend), a few routes are dead ends, and the overall navigation hides important pages from direct access.

**Top issues at a glance:**
- No dedicated Contact page (contact only accessible via the floating chat widget)
- No Promotions/Deals page despite having a "Bundle Showcase" section on the homepage
- No Blog or Travel Tips page
- No 404 page for truly unknown routes
- No visa information or travel insurance pages
- Hotel booking does NOT go through its own checkout — it reroutes to the flight booking flow (`/flights/book`)
- All forms lack client-side validation and show no inline errors
- The Navbar "04 // OPERATIONS" section in mobile is empty (no links)
- Privacy Policy and Terms of Service footer links navigate to `/` (broken) before InformationPage was properly wired
- `RouteJournal` renders for any route not matched — it silently drops unknown routes (fallback `null`) rather than a proper 404

---

## 2. Current Routes Table

| Route | Component | Accessible From | Status |
|---|---|---|---|
| `/` | Home (12 sections inline) | Navbar logo, footer | ✅ Working |
| `/flights` | `FlightsView` | Navbar, Footer, Home CTAs | ✅ Working |
| `/flights/book` | `BookingFlow` | Flight card "Select" button, hotel "Reserve" button | ✅ Working |
| `/hotels` | `HotelsView` | Navbar mega menu, Footer | ✅ Working |
| `/destinations` | `DestinationsView` | Navbar mega menu, Footer | ✅ Working |
| `/fly-now-pay-later` | `FlyNowPayLaterView` | Navbar mega menu, Footer | ✅ Working |
| `/account` | `AccountView` | Navbar drawer, Footer "My account" | ✅ Working |
| `/admin` | `AdminDashboard` | URL only (no nav link) — server-session gated | ✅ Working but hidden |
| `/about` | `InformationPage` | URL only — no nav link | ⚠️ Works but unreachable from UI |
| `/privacy` | `InformationPage` | Footer "Privacy policy" → calls `go('/')` — BROKEN | ❌ Footer link goes to `/`, not `/privacy` |
| `/terms` | `InformationPage` | Footer "Terms of service" → calls `go('/')` — BROKEN | ❌ Footer link goes to `/`, not `/terms` |
| Unknown routes | `RouteJournal` + null | Direct URL | ⚠️ No 404, silently drops |

### Dead/Broken Links Found

| Location | Label | Target | Issue |
|---|---|---|---|
| `Footer.tsx` ln ~29 | "Privacy policy" | `go('/')` | Should be `go('/privacy')` |
| `Footer.tsx` ln ~30 | "Terms of service" | `go('/')` | Should be `go('/terms')` |
| `Navbar.tsx` MOBILE_LINKS section 04 | "04 // OPERATIONS" | (empty items array) | Section renders with no links — dead section header |

---

## 3. Home Page Sections Audit

All 12 sections are lazy-loaded and wrapped in `RevealOnScroll`. The order in `App.tsx`:

| # | Section Component | What It Does | Status |
|---|---|---|---|
| 1 | `HeroCanvas` | Fullscreen video hero with flight search bar overlay, scroll animations | ✅ Working |
| 2 | `TrustMarquee` | Scrolling trust strip (airline/partner logos, certifications) | ✅ Working |
| 3 | `TripPlanner` | Natural-language itinerary input widget | ✅ Working (UI only, no AI backend) |
| 4 | `PopularDestinations` | Grid of popular flight route cards with prices | ✅ Working |
| 5 | `LiveRadarSection` | Animated SVG/canvas flight route map with live-style telemetry | ✅ Working |
| 6 | `ServicesBento` | Bento grid of 4 core services (Flights, Hotels, FNPL, Transfers) | ✅ Working |
| 7 | `FleetCabinShowcase` | Private cabin / aircraft fleet display with image carousel | ✅ Working |
| 8 | `LoanSpotlight` | FNPL 0% APR feature highlight with calculator preview | ✅ Working |
| 9 | `BundleShowcase` | Flight + hotel bundle deals grid | ✅ Working (no dedicated bundle checkout route) |
| 10 | `WhyTrustUs` | Trust badges, stats, USP cards | ✅ Working |
| 11 | `TestimonialsSection` | Customer testimonial cards | ✅ Working (all mock data) |
| 12 | `FaqSection` | Accordion FAQ questions | ✅ Working |

**Home page gaps:**
- `TripPlanner` is UI-only — the natural-language input has no backend or AI. When submitted it does nothing visible (no route change, no error message).
- `BundleShowcase` has CTA buttons but the route `/bundles` or a bundle checkout does not exist. Bundles link through to `/flights/book` which is only about flights.
- `TestimonialsSection` uses mock data only — there is no mechanism to collect or display real reviews.

---

## 4. Navbar Audit

**Desktop Navbar contains:**
- Logo (routes to `/`)
- "Explore" mega dropdown → 3 tabs: Flights & Routes, Hotels & Stays, Payment Plans
- Search pill button (opens `SearchModal`)
- "Book Flight" CTA → `/flights`
- Hamburger → Side Drawer (currency toggle, theme toggle, profile card, admin link if admin)

**Mobile Navbar contains:**
- Logo
- Search icon → `SearchModal`
- Hamburger → "Aperture" fullscreen mobile menu with 4 sections

**Missing from Navbar:**
- No direct link to `/about` — About page is invisible from navigation
- No Deals/Promotions link
- Mobile section "04 // OPERATIONS" has an empty `items` array — renders a heading with no links (dead section)
- No blog or news link
- Currency defaults to NGN/USD only (no GBP/EUR for international routes like London/Dubai which the site covers)

---

## 5. Footer Audit

**Footer has 3 link columns:**

| Column | Links |
|---|---|
| Menu | Home, Flights, Hotels, Destinations, Fly Now Pay Later |
| Navigation | Contact (opens support), My account, Privacy policy ❌, Terms of service ❌, Customer portal |
| More partners | IATA, AirPeace, IbomAir, EkoHotels, Transcorp, Amadeus, FlightRadar24 |

**Issues:**
- "Privacy policy" calls `go('/')` — navigates to home instead of `/privacy`
- "Terms of service" calls `go('/')` — navigates to home instead of `/terms`
- No social media links (Twitter/X, Instagram, Facebook, LinkedIn)
- No "/about" link in footer columns despite an `/about` page existing
- No newsletter sign-up

---

## 6. Feature Gaps Per Page

### 6.1 Flights View (`/flights`)

| Feature | Status | Gap |
|---|---|---|
| Airport origin/destination select | ✅ Working | Airports limited to ~8 Nigerian/African cities |
| Trip type (one-way/round-trip) | ✅ Working | |
| Cabin class select | ✅ Working | |
| Date picker | ✅ Working | |
| 7-day fare calendar | ✅ Working (mock prices) | |
| Filters: stops, airline, max price | ✅ Working | |
| Loading skeleton | ✅ Working | |
| Empty state | ✅ Working | |
| Multi-city trips | ❌ Missing | Very common booking type |
| Passenger count selector | ❌ Missing | No way to specify 2+ passengers |
| Return flight selection | ❌ Missing | Round-trip selects outbound only; no return leg UI |
| Price alert / fare watchlist | ❌ Missing | |
| Compare flights side-by-side | ❌ Missing | |
| Real airline logos | ❌ Missing | All flights show generic plane icon |

### 6.2 Booking Flow (`/flights/book`)

| Feature | Status | Gap |
|---|---|---|
| 3-step flow (Passenger → Seat → Payment) | ✅ Working | |
| Meal preference | ✅ Working | |
| Extra luggage | ✅ Working | |
| Seat map (6 rows, A-D) | ✅ Working | |
| Card / bank transfer / FNPL payment | ✅ Working | |
| Confirmation + confetti + boarding pass | ✅ Working | |
| Form validation | ❌ Missing | Fields have no required validation — empty name/email submits fine |
| Email format validation | ❌ Missing | |
| Passport / travel doc field | ❌ Missing | International routes need passport number |
| Date of birth field | ❌ Missing | Required for airline ticketing |
| Multiple passengers | ❌ Missing | BookingFlow only handles 1 passenger |
| Real payment gateway | ❌ Missing | Payment is purely mock/frontend simulation |
| Booking confirmation email (simulated or real) | ❌ Missing | |
| Add-ons: travel insurance, priority boarding | ❌ Missing | Common upsells |

### 6.3 Hotels View (`/hotels`)

| Feature | Status | Gap |
|---|---|---|
| Hotel listing grid | ✅ Working | |
| Destination / date / guest filters | ✅ Working | |
| Amenity filters (generator, airport pickup) | ✅ Working | |
| Loading state | ✅ Working | |
| Hotel "Reserve Suite" button | ❌ Broken | Sends user to `/flights/book` (the flight booking flow, not a hotel checkout) |
| Hotel-specific booking flow | ❌ Missing | No dedicated hotel checkout |
| Hotel detail / photo gallery | ❌ Missing | No expand-to-detail page for individual hotels |
| Map view | ❌ Missing | Map toggle button exists in imports (`Map`, `List` icons) but map view is not implemented |
| Guest count filter | ❌ Missing | Filter panel has no guest count input despite the store field `hotelGuests` existing |
| Star rating / price filter | ❌ Missing | |
| Breakfast included filter | ❌ Missing | |
| Empty state | ❌ Missing | If all hotels are filtered out, no empty state renders |

### 6.4 Fly Now Pay Later (`/fly-now-pay-later`)

| Feature | Status | Gap |
|---|---|---|
| Loan calculator with sliders | ✅ Working | |
| Repayment schedule table | ✅ Working | |
| 4-step application form | ✅ Working | |
| Underwriting evaluation (simulated) | ✅ Working | |
| Confetti on approval | ✅ Working | |
| Form validation | ❌ Missing | Fields have pre-filled mock values; BVN/NIN field accepts any string |
| Real document upload | ❌ Missing | Upload UI shows "File selected locally" by default — hardcoded `setIdUploaded(true)` |
| Selfie verification | ❌ Missing | Hardcoded `setSelfieVerified(true)` — bypassed completely |
| Consent checkbox pre-checked | ⚠️ UX issue | `consentChecked` defaults to `true` — user doesn't actively consent |

### 6.5 Account View (`/account`)

| Feature | Status | Gap |
|---|---|---|
| Traveler profile HUD | ✅ Working | |
| Active trips timeline | ✅ Working (mock data) | |
| Boarding passes tab | ✅ Working | |
| Loan management tab | ✅ Working | |
| Loyalty miles tab | ✅ Working | |
| Saved hotels tab | ✅ Working | |
| Countdown to departure | ✅ Working | |
| Real authentication | ❌ Missing | Login is purely client-side role switching |
| Profile edit (name, phone, passport) | ❌ Missing | No way to update profile fields |
| Password / security settings | ❌ Missing | |
| Notification preferences | ❌ Missing | |
| Delete account | ❌ Missing | |
| Booking cancellation flow | ❌ Missing | Bookings cannot be cancelled from the UI |
| Flight check-in online | ❌ Missing | |

### 6.6 Admin Dashboard (`/admin`)

| Feature | Status | Gap |
|---|---|---|
| Flight ops / gate management | ✅ Working | |
| FNPL underwriting approve/decline | ✅ Working | |
| Passenger manifest search | ✅ Working | |
| Sanctuary/hotels tab | ✅ Working | |
| Revenue KPI cards | ✅ Working | |
| Admin session verification via `/api/admin/session` | ✅ Wired | Backend must exist for this to work |
| Route accessible only via direct URL | ⚠️ UX gap | No link to `/admin` from any nav element |
| Analytics / charts | ❌ Missing | KPI numbers are hardcoded (+₦428,500,000 seed) |
| Export bookings / reports | ❌ Missing | |
| Manage hotel inventory | ❌ Missing | |
| Create promotions/deals | ❌ Missing | |

### 6.7 Destinations View (`/destinations`)

| Feature | Status | Gap |
|---|---|---|
| 7-destination grid with editorial cards | ✅ Working | |
| "Book Route" CTA → flights page | ✅ Working | |
| Destination detail page | ❌ Missing | Each card has no expand/detail page |
| Visa requirements | ❌ Missing | International destinations (Dubai, London) require visa info |
| Travel advisories | ❌ Missing | |
| Packing guides / travel tips | ❌ Missing | |

### 6.8 Support Widget (Floating)

| Feature | Status | Gap |
|---|---|---|
| Live chat with canned responses | ✅ Working | |
| Help articles (4 articles) | ✅ Working | |
| Callback request form | ✅ Working | |
| Back-to-top button | ✅ Working | |
| Real AI or agent backend | ❌ Missing | Responses are string-matched keyword replies |
| More help articles | ❌ Missing | Only 4 topics covered |
| Ticket/case number after chat | ❌ Missing | |
| Chat transcript download | ❌ Missing | |
| Escalation to human agent | ❌ Missing (simulated) | Callback logs a local toast, not a real request |

---

## 7. Missing Pages (With Justification)

| Page | Route | Priority | Justification |
|---|---|---|---|
| **Contact** | `/contact` | 🔴 High | Currently only reachable via floating chat widget. A dedicated contact page with address, phone, email, and map is standard for trust/legitimacy |
| **Deals / Promotions** | `/deals` | 🔴 High | `BundleShowcase` on home and bundle links exist but there is no bundle checkout or deals landing page |
| **404 Not Found** | `*` (catch-all) | 🔴 High | Unknown routes silently show nothing. Any mistyped URL just renders an empty main area |
| **About** | `/about` | 🟠 Medium | Page exists and is wired but no nav link points to it. Users cannot discover it |
| **Blog / Travel Tips** | `/blog` | 🟠 Medium | Travel agency SEO and trust builder. Useful for Owerri/Nigeria-specific travel content |
| **Visa Information** | `/visa-info` | 🟠 Medium | Site features international routes to Dubai and London — visa requirements are a necessity |
| **Travel Insurance** | `/insurance` | 🟠 Medium | High-value upsell present on most booking platforms |
| **Group Bookings** | `/group-bookings` | 🟡 Low | Common for Nigerian travel agencies (corporate, delegation, school trips) |
| **Referral / Affiliate Program** | `/refer` | 🟡 Low | Growth channel common for travel loyalty programs |
| **Newsletter / Subscribe** | `/subscribe` | 🟡 Low | Capture returning visitors; pairs with deals page |

---

## 8. UI / UX Gaps

### Forms — No Client-Side Validation

Every form across the site (BookingFlow, FlyNowPayLaterView, AuthModal, SupportModal callback) uses uncontrolled or minimally controlled inputs with no inline validation. Specific gaps:

- **BookingFlow Step 1** — first name, last name, email, phone accept empty or invalid values; `required` HTML attribute is present on some fields but no JS prevents advancing to step 2
- **FNPL Application Step 1** — BVN/NIN field accepts any string; no length or format check
- **FNPL Application Step 2** — monthly income of 0 is accepted
- **FNPL Step 3** — `idUploaded` and `selfieVerified` are hardcoded `true` — document/selfie steps are cosmetic only

### Missing Empty States

- **Hotels View** — if both `filterGeneratorOnly` and `filterAirportPickup` eliminate all results, the grid is empty with no message
- **Account trips tab** — if `bookingHistory` is empty (new user), the timeline section shows the hardcoded "Lagos → Abuja" flight regardless (it never actually reads from bookingHistory for the fixed timeline items)
- **Admin dashboard** — if `bookingHistory` is empty, the passenger manifest shows nothing with no empty state

### Missing Loading States

- **Destinations View** — no loading skeleton; transitions directly from empty to populated
- **Account View** — no loading state on tabs

### Other UX Issues

- **Hotel booking redirect** — `HotelsView` "Reserve Suite" button sets `setSelectedHotel(hotel)` and navigates to `/flights/book`. The BookingFlow component does not read or display hotel data at all. Hotel bookings are non-functional.
- **`TripPlanner`** — natural-language input has a "Plan My Journey" button but no visible action on submit (no route change, no feedback, no error)
- **Seat map** — only 6 rows × 4 seats. There is no cabin class distinction in the map (business rows 1-2 look identical to economy). The seat map is static (same seats across all flights)
- **Boarding pass** — boarding pass data is partially hardcoded (always "Flight AV-304", always "Lagos → Abuja") regardless of which booking was made
- **`RouteJournal`** — renders a soft content block below pages like `/flights`, `/hotels` etc., but also renders (returning `null`) for unrecognised routes — silently absorbing typos that should 404

---

## 9. Priority Recommendations

### 🔴 High Priority

| # | Recommendation | Why |
|---|---|---|
| H1 | **Fix footer Privacy Policy and Terms of Service links** — change `go('/')` to `go('/privacy')` and `go('/terms')` in `Footer.tsx` | Currently 100% broken — these are legal pages |
| H2 | **Add a 404 catch-all route** in `App.tsx` — render a proper "Page not found" component for any unmatched route | Any direct URL that isn't registered silently shows nothing |
| H3 | **Fix hotel booking flow** — hotel "Reserve Suite" should navigate to a hotel-specific checkout, not the flight booking flow | Hotel bookings are currently non-functional |
| H4 | **Add form validation to BookingFlow** — prevent advancing steps with empty name/email, add email format check | Users can book with blank passenger info |
| H5 | **Add a Contact page** at `/contact` with phone, email, address, and link it from Footer and Navbar | Trust essential for a travel agency |
| H6 | **Fix FNPL consent checkbox** — `consentChecked` should default to `false` and require user interaction | Legal/compliance concern |

### 🟠 Medium Priority

| # | Recommendation | Why |
|---|---|---|
| M1 | **Add About page to navigation** — add `/about` link to Footer "Navigation" column and Navbar drawer | Page exists but is completely undiscoverable |
| M2 | **Create a Deals / Promotions page** (`/deals`) and wire bundle CTAs to it | `BundleShowcase` on home has no destination |
| M3 | **Fix mobile Navbar "04 // OPERATIONS" section** — either add links or remove the empty section | Dead section header in mobile menu |
| M4 | **Add a Blog / Travel Tips page** | SEO, trust, user engagement |
| M5 | **Add Visa Information page** — especially for London, Dubai, Nairobi routes | Users booking international flights need this |
| M6 | **Add passenger count selector** to flights search | Families and groups can't search for multiple seats |
| M7 | **Add return flight selection** to the booking flow | Round-trip toggle exists but has no return flight UI |
| M8 | **Implement hotel empty state** — show a message when filters return no hotels | UX standard |

### 🟡 Low Priority

| # | Recommendation | Why |
|---|---|---|
| L1 | **Add social media links to footer** | Standard for brand presence |
| L2 | **Add newsletter sign-up** to footer or home | Retention / deals communication |
| L3 | **Add real profile editing** to AccountView | Users should be able to update contact info |
| L4 | **Expand Help Centre articles** in SupportModal | Currently only 4 topics |
| L5 | **Add Travel Insurance page** | Revenue opportunity, travel safety |
| L6 | **Add Group Bookings page** | Common use case for Nigerian travel agencies |
| L7 | **Make seat map dynamic** — load different configurations per flight | Currently one static layout for all aircraft types |
| L8 | **Add GBP / EUR currency options** | Site serves Dubai and London routes |
| L9 | **Make boarding pass data dynamic** — pull from `confirmedBooking` state | Currently partially hardcoded to AV-304 LOS→ABV |
| L10 | **Add TripPlanner feedback** — show a loading state and a results section when the user submits the itinerary form | Currently does nothing visible |

---

## 10. Digest

### Files with Confirmed Bugs

| File | Bug |
|---|---|
| `src/components/layout/Footer.tsx` line ~29-30 | `navigationLinks` array: "Privacy policy" action is `() => go('/')` and "Terms of service" action is `() => go('/')` — both should call `go('/privacy')` and `go('/terms')` respectively |
| `src/components/layout/Navbar.tsx` `MOBILE_LINKS` | Section `'04 // OPERATIONS'` has `items: []` — empty section renders a header with no links |
| `src/components/hotels/HotelsView.tsx` line ~130 | `onClick` of "Reserve Suite" calls `setActiveRoute('/flights/book')` — should route to a hotel checkout, not a flight checkout |
| `src/components/loan/FlyNowPayLaterView.tsx` | `setIdUploaded(true)` and `setSelfieVerified(true)` hardcoded on component mount — verification steps are bypassed |
| `src/components/loan/FlyNowPayLaterView.tsx` | `consentChecked` defaults to `true` — user never explicitly consents |
| `src/App.tsx` router | No catch-all for unknown routes — missing 404 |

### Files Missing Features

| File | Missing |
|---|---|
| `src/components/flights/BookingFlow.tsx` | Form validation (empty field guard), multi-passenger support, passport/DOB fields |
| `src/components/flights/FlightsView.tsx` | Passenger count selector, return flight booking UI |
| `src/components/hotels/HotelsView.tsx` | Hotel detail/expand view, map view (icons imported but not used), guest count filter, empty state |
| `src/components/account/AccountView.tsx` | Profile edit form, booking cancellation, online check-in |
| `src/App.tsx` | 404 route, `/contact` route, `/deals` route, `/blog` route |

---

*Report generated by automated audit of source files. All line references are approximate; use grep/IDE search on the cited functions to locate exact positions.*
