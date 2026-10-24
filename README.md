# CarTogether

CarTogether is a mobile-friendly mockup for festival travel in Kristiansand.
It lets you compare sample taxi fares, find people travelling the same way,
offer a ride, and try complete review and confirmation flows.

The interface uses Norwegian labels, prices in NOK (`kr`), a green and teal
palette, rounded cards, and a responsive layout for phones and desktop screens.

**Demo – no real bookings:** all providers, prices, drivers, ratings, departures,
and seats are fictional. Nothing is booked or paid for, and no driver is contacted.
The mockup runs entirely in the browser with a fixed demo user, Alex. Changes
survive navigation between views but disappear when the page is refreshed.

## What you can try

### Hjem: compare a journey

Choose an origin and destination from **Palmesus (festival)**,
**Kristiansand sentrum**, and **Vågsbygd**, or use the swap button to reverse
the journey. The default route is **Palmesus → Vågsbygd**.

Three fictional taxi providers appear immediately, with the lowest fare
highlighted. All fares cover a standard taxi for 1–4 people. The **Del prisen**
selector divides the lowest fare between 1–4 passengers, showing two decimals
when needed. For example, 195 kr shared by three people is 65 kr each.
Selecting the same origin and destination shows a validation message.

**Finn samkjøring** opens Carpool with the selected route.

### Carpool: join or offer a ride

Ride cards match the exact travel direction and show the driver, initials,
sample rating, departure, available seats, and price per passenger. Routes
without matching offers show an empty state.

To join a ride:

1. Select **Bli med** and review the route, driver, departure, and price for one seat.
2. Select **Bekreft demosete** to reserve a sample seat, or go back without changes.
3. The confirmation page shows the trip details and a demo reference, with links
   to **Mine turer** and the ride list.

Confirmation decreases the available seats once. Joined rides show
**Du er med – kun demo**. Full rides and Alex's own offer cannot be joined.

To offer a ride:

1. Select **Tilby en demotur**. The form starts with the selected route, departure
   21:00, two seats, and 60 kr per passenger.
2. Choose a route, departure time, 1–4 available seats, and a whole-number price
   of 1–500 kr. Invalid details show validation messages.
3. Select **Se over demoturen**, then either return to edit or choose
   **Publiser demotur**.
4. The confirmation page shows the published details and a demo reference.
   Carpool now uses the published route so the new offer is easy to find.

Returning from review to the form preserves the draft. Leaving the flow discards
it. No ride is added until publication is confirmed. Alex can have one active
offer at a time; withdrawing it makes it possible to offer another.

### Mine turer: manage confirmed trips

**Mine turer** lists joined rides and Alex's active offer, including their details
and demo references.

- **Avbestill demosete** opens a review before cancellation. Confirming returns
  one seat to the ride and allows you to join again.
- **Trekk tilbake demotur** opens a review before removing Alex's offer.
- **Behold turen** backs out of either action without changes.

Both cancellation and withdrawal end with a confirmation page.

### Om oss: the concept and team

The About view explains the idea of easier, more affordable festival travel
through price comparison and shared rides. It presents Ella (CEO), Amathea (CFO),
Emma (CPO), Sunniva (CMO), and Lucia (COO) with initials as avatar placeholders.

It also describes the concept's ambitions around innovation, sustainable cities,
and climate action, inspired by UN Sustainable Development Goals 9, 11, and 13.
It makes no calculated savings or emissions claims.

### Start again

**Nullstill demo** in the footer asks before clearing changes. Confirming restores
the original rides, default route, one-person fare split, and empty **Mine turer**
view. Refreshing the page also resets the mockup.

## Sample data

Taxi fares are the same in both directions:

| Route | Demo Taxi | Bytaxi Mock | Festivalbil Mock |
| --- | ---: | ---: | ---: |
| Palmesus ↔ Kristiansand sentrum | 120 kr | 140 kr | 130 kr |
| Palmesus ↔ Vågsbygd | 195 kr | 225 kr | 210 kr |
| Kristiansand sentrum ↔ Vågsbygd | 160 kr | 180 kr | 170 kr |

The initial private rides use separate prices per passenger:

| Driver | Route | Departure | Free seats | Price per seat | Rating |
| --- | --- | --- | ---: | ---: | ---: |
| Emma | Palmesus → Vågsbygd | 20:00 | 3 | 65 kr | 4.9 |
| Sofie | Palmesus → Vågsbygd | 20:30 | 2 | 70 kr | 4.7 |
| Maja | Kristiansand sentrum → Palmesus | 21:00 | 2 | 45 kr | 4.8 |

Times are demo values without dates or time-based availability checks.

## Scope

This is an interactive frontend prototype. It has no backend, database, external
APIs, registration, login, maps, GPS, address search, live prices, payments,
actual reservations, chat, or notifications. Ratings are static sample values.
All application state stays in React; nothing is persisted outside the page.

## Local development

Requires Node.js 22.15+.

```sh
npm ci
npm start      # Development server: http://localhost:8080
npm run build  # Production output: dist/
npm run lint   # JavaScript and CSS checks
```

The app uses React and webpack's experimental native HTML and CSS support.
`app/index.html` loads the JavaScript and stylesheet, and React renders into `#root`.

| File | Purpose |
| --- | --- |
| `app/app.js` | App shell, navigation, selected route, and flow navigation |
| `app/demo-state.js` | State transitions, offer validation, and confirmation guards |
| `app/mock-data.js` | Locations, providers, fares, demo user, rides, and team fixtures |
| `app/components/` | Route controls, cards, forms, review and confirmation screens, and view content |
| `app/style/style.css` | Color tokens, responsive layout, and keyboard focus styles |

## Testing

```sh
npx playwright install firefox  # Once, for browser tests
npm test                       # State tests and browser flows
npm run test:unit               # State transitions and validation only
npm run test:e2e                # Browser flows only
```

Six state tests cover confirmation guards, unavailable and own rides,
cancellation, offer validation, withdrawal, and reset. Six browser scenarios run
on both desktop (1440px) and phone (390px), for twelve browser tests covering
comparison, joining and cancellation, offering and withdrawal, abandoning drafts,
reset, refresh, and keyboard controls.

Browser tests reuse the development server on port 8080 locally, or start it
if none is running. Each test gets a fresh demo. Failed browser tests save
screenshots and traces under `test-results/`.

To use an existing Firefox executable, set `PLAYWRIGHT_FIREFOX_EXECUTABLE_PATH`
to its absolute path before running the tests.

## Suggested walkthrough

1. On **Hjem**, split the default 195 kr fare between three people, then choose
   **Finn samkjøring**.
2. Join Emma's ride, review the details, and confirm the demosete. Open
   **Mine turer**, try keeping the ride during cancellation review, then cancel
   with confirmation. Emma's available seats return to three.
3. In **Carpool**, offer a demotur. Change the time, seats, or price, review,
   return to edit, and publish. Withdraw it through **Mine turer**.
4. Use **Nullstill demo** to restore the starting point and try again.
