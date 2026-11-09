# CJ Travels Owerri — Missing Pages: Build Prompts

Use each prompt below with Kiro (or any AI coding assistant) to build the missing pages one at a time.
Each prompt is self-contained and references the existing codebase conventions (Tailwind, Zustand store, Cinzel/Plus Jakarta Sans fonts, gold `#F2B632` / teal `#2B7574` / deep `#0E2931` colour palette, `font-monument` class, `btn-gold` class, dark mode via `.dark` selector).

---

## 1. 🔴 Contact Page — `/contact`

```
Build a Contact page component at src/components/contact/ContactView.tsx and register it at the route '/contact' in src/App.tsx.

The page must:
- Match the existing site style (Tailwind, dark/light mode, gold #F2B632 / teal #2B7574 colour palette, Plus Jakarta Sans body font, Cinzel for headings via font-monument class)
- Have a top section with: page eyebrow label (font-mono uppercase tracking-widest text-[#F2B632]), large heading "Get in touch", and a short subheading
- Show 3 contact info cards in a horizontal row (stacked on mobile): Phone (+234 803 000 0001), Email (hello@cjtravels.ng), and Office Address (12 Douglas Road, Owerri, Imo State, Nigeria) — each card has an icon, label, and value
- Include a contact form with fields: Full name, Email address, Subject (select dropdown with options: Flight Enquiry, Hotel Booking, Fly Now Pay Later, Group Booking, General), Message textarea — all fields must have client-side validation (required, email format check) using React state; show an inline error message in red below each invalid field on submit
- On successful form submit show a success banner: "Message received. We will respond within 24 hours." and reset the form
- Add a link to this page in Footer.tsx navigationLinks array: { label: 'Contact', action: () => go('/contact') }
- Add a link in Navbar.tsx MOBILE_LINKS section '04 // OPERATIONS': { label: 'Contact', route: '/contact' }
- Add '/contact' to the KNOWN_ROUTES array in App.tsx
```

---

## 2. 🔴 Deals & Promotions Page — `/deals`

```
Build a Deals & Promotions page component at src/components/deals/DealsView.tsx and register it at the route '/deals' in src/App.tsx.

The page must:
- Match the existing site style (Tailwind, dark/light mode, gold #F2B632 / teal #2B7574 / deep ink #0E2931 palette, font-monument for headings, btn-gold for CTA buttons)
- Show a hero banner at the top: dark teal background (bg-ocean-gradient class already defined in index.css), eyebrow label "Limited Time Offers", heading "Deals & Promotions", subheading "Exclusive fares and bundle savings for CJ Travels Owerri guests"
- Display a filterable grid of deal cards. Hard-code at least 6 realistic deals: mix of flight discounts (e.g. "Lagos → Dubai from ₦850,000"), flight+hotel bundles (e.g. "Abuja Escape: Flight + 3 nights from ₦420,000"), and FNPL highlights (e.g. "0% APR on all bookings this month"). Each card must have: a badge (e.g. "FLASH SALE", "BUNDLE", "PAY LATER"), deal title, short description, price or saving, expiry date, and a CTA button that navigates to the relevant page (/flights, /hotels, or /fly-now-pay-later)
- Add filter pills above the grid: All, Flights, Hotels, Bundles, Pay Later — clicking filters the visible cards
- Add a countdown timer on at least 2 cards (hours:minutes:seconds) using useEffect and setInterval — show "Expires in HH:MM:SS"
- Add a link to this page in Footer.tsx navigationLinks: { label: 'Deals & Offers', action: () => go('/deals') }
- Add a link in Navbar.tsx MOBILE_LINKS section '04 // OPERATIONS': { label: 'Deals & Offers', route: '/deals' }
- Add '/deals' to the KNOWN_ROUTES array in App.tsx
```

---

## 3. 🟠 About Page — Wire into Navigation

```
The About page already exists at src/components/common/InformationPage.tsx and is accessible at '/about'. It just has no links pointing to it.

Make the following navigation changes only (do not rebuild the page):

1. In src/components/layout/Footer.tsx, in the navigationLinks array, add a new entry after 'My account':
   { label: 'About us', action: () => go('/about') }

2. In src/components/layout/Navbar.tsx, in the MOBILE_LINKS array, in section '04 // OPERATIONS' items array, add:
   { label: 'About', route: '/about' }

3. In the Navbar desktop mega dropdown (look for the section rendering the mega menu panel), add an "About" link in the bottom row alongside any existing footer links inside the dropdown.

These are the only changes needed. Do not modify InformationPage.tsx or App.tsx.
```

---

## 4. 🟠 Visa Information Page — `/visa-info`

```
Build a Visa Information page at src/components/visa/VisaInfoView.tsx and register it at '/visa-info' in App.tsx.

The page must:
- Match the existing site style (Tailwind, dark/light mode, existing colour palette, font-monument for headings)
- Show an eyebrow label, heading "Visa & Entry Requirements", and a short intro paragraph explaining that requirements shown are for reference only and users should verify with the relevant embassy
- Display visa info cards for the 6 international destinations already in the site's mockData: Dubai (UAE), London (UK), Nairobi (Kenya), Accra (Ghana), Johannesburg (South Africa), and New York (USA). Each card must show: destination flag emoji, country, visa requirement for Nigerian passport holders (e.g. "Visa required — apply at UAE Embassy"), processing time estimate, estimated cost in USD, and a "Check official requirements →" external link to the relevant embassy website
- Add a prominent disclaimer banner at the top: "Information is for guidance only. Always verify entry requirements with the official embassy or consulate before travelling."
- Add a link in Footer.tsx moreLinks: { label: 'Visa info', href: '' } — but make it a button that calls go('/visa-info') instead of an anchor (so change it to the navigationLinks array: { label: 'Visa info', action: () => go('/visa-info') })
- Add '/visa-info' to KNOWN_ROUTES in App.tsx
```

---

## 5. 🟠 Blog / Travel Tips Page — `/blog`

```
Build a Blog / Travel Tips page at src/components/blog/BlogView.tsx and register it at '/blog' in App.tsx.

The page must:
- Match the existing site style (Tailwind, dark/light mode, existing colour palette and fonts)
- Show a page header: eyebrow "CJ Travels Journal", heading "Travel Tips & Guides", subheading "Practical advice for journeys departing from Owerri and across West Africa"
- Display a grid of at least 6 hard-coded blog post cards. Each card must have: a coloured placeholder image area (use a teal/gold gradient div), category tag (e.g. "PACKING GUIDE", "DESTINATION", "FINANCE TIP"), post title, short excerpt (2 sentences), author name, and date. Categories to include: Packing Guides, Destination Spotlights, FNPL Tips, Airport Guides, Hotel Reviews, Visa Tips
- Clicking a card should show a simple modal or inline expanded view with the full article body (hard-code 2–3 paragraphs per post)
- Add filter pills for post categories above the grid
- Add a link in Footer.tsx navigationLinks: { label: 'Travel blog', action: () => go('/blog') }
- Add '/blog' to KNOWN_ROUTES in App.tsx
```

---

## 6. 🟠 Travel Insurance Page — `/insurance`

```
Build a Travel Insurance page at src/components/insurance/InsuranceView.tsx and register it at '/insurance' in App.tsx.

The page must:
- Match the existing site style (Tailwind, dark/light mode, existing colour palette and fonts)
- Have a hero section with heading "Travel Insurance", subheading "Protect your journey from cancellations, medical emergencies, and lost baggage", and a prominent disclaimer: "Insurance products shown are provided by third-party underwriters. CJ Travels Owerri acts as an introducer only."
- Display 3 insurance plan cards in a row (stacked on mobile): Basic (flight cancellation + baggage), Standard (Basic + medical emergency up to $50,000), Premium (Standard + trip curtailment + personal liability). Each card must show: plan name, price per trip (hard-coded in NGN), list of covered items with checkmarks, and a CTA button "Get a Quote" that opens the Support chat widget (calls setSupportOpen(true) from useAppStore)
- Add a FAQ section below the plans with 4 questions: "What does travel insurance cover?", "When should I buy insurance?", "How do I make a claim?", "Is insurance mandatory for my destination?"
- Add '/insurance' to KNOWN_ROUTES in App.tsx
- Add a link in Footer.tsx navigationLinks: { label: 'Travel insurance', action: () => go('/insurance') }
```

---

## 7. 🟡 Group Bookings Page — `/group-bookings`

```
Build a Group Bookings page at src/components/group/GroupBookingsView.tsx and register it at '/group-bookings' in App.tsx.

The page must:
- Match the existing site style (Tailwind, dark/light mode, existing colour palette and fonts)
- Show a hero section: heading "Group & Corporate Travel", subheading "Seamless air travel for 10 or more passengers — corporate delegations, school trips, NGO missions, and family reunions"
- Display 4 group type cards: Corporate Delegation, School / Youth Groups, NGO & Government Missions, Family Reunions — each with an icon, short description, and a key benefit
- Include a Group Enquiry form with: Organisation name, Contact person, Email, Phone, Number of passengers (number input, min 10), Departure city (select from Lagos, Abuja, Port Harcourt, Owerri), Destination, Preferred travel dates, Additional notes (textarea). All required fields must have client-side validation.
- On submit, show a success message: "Your group booking enquiry has been received. A dedicated travel consultant will contact you within 4 business hours."
- Add '/group-bookings' to KNOWN_ROUTES in App.tsx
- Add a link in Navbar.tsx MOBILE_LINKS section '04 // OPERATIONS': { label: 'Group Bookings', route: '/group-bookings' }
```

---

## 8. 🔴 Hotel Booking Checkout — `/hotels/book`

```
Build a Hotel Booking Flow component at src/components/hotels/HotelBookingFlow.tsx and register it at '/hotels/book' in App.tsx.

Context: The Hotels page (src/components/hotels/HotelsView.tsx) currently has a "Reserve Suite" button that saves the selected hotel to the Zustand store via setSelectedHotel(hotel) but navigates nowhere useful. This flow should be the hotel checkout.

The flow must have 3 steps (match the existing BookingFlow.tsx style at src/components/flights/BookingFlow.tsx for visual consistency):
  Step 1 — Guest Details: First name, Last name, Email, Phone. All fields required with inline validation.
  Step 2 — Stay Summary: Show the selected hotel name, check-in date, check-out date, number of nights (computed from store), price per night, and total price. Let the user confirm or go back.
  Step 3 — Payment: Same 3 payment method cards as BookingFlow (Card, Bank Transfer, Fly Now Pay Later). On confirm, create a BookingRecord of type 'hotel' using addBookingToHistory from the store, show a confetti burst (import canvas-confetti), and display a booking confirmation with a reference number.

Read the existing BookingFlow.tsx, HotelsView.tsx, and useAppStore.ts carefully before implementing. Reuse the existing Zustand state fields: selectedHotel, hotelCheckInDate, hotelCheckOutDate, hotelGuests, addBookingToHistory, currency.

After building:
1. In HotelsView.tsx, change the Reserve Suite button onClick to: setSelectedHotel(hotel); setActiveRoute('/hotels/book'); window.scrollTo({ top: 0, behavior: 'smooth' }); — and remove the toast.
2. Add '/hotels/book' to KNOWN_ROUTES in App.tsx.
3. Add setActiveRoute back to the HotelsView destructuring from useAppStore.
```

---

## Notes for all prompts

- Always run `npm run lint` (tsc --noEmit) after implementing to check for TypeScript errors
- Always run `npm run build` to confirm the production build passes before committing
- Commit each page separately: `git add -A && git commit -m "feat: add [page name] page"`
- The store file is at `src/store/useAppStore.ts` — read it before touching any store state
- The colour palette is in `src/index.css` CSS variables: `--gold: #F2B632`, `--teal: #2B7574`, `--ink: #0E2931`, `--paper: #F4F6F5`
- Dark mode uses the `.dark` class variant — use `dark:` Tailwind prefixes consistently
- Every new page component must be lazy-loaded in App.tsx using `const X = lazy(() => import(...).then(m => ({ default: m.X })))`
