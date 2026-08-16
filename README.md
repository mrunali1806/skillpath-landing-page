# Skillpath — Courses Section (Framer Code Component)

A React code component built for the "Skillpath" landing page assignment — a fake learning platform built in Framer. This component powers the courses grid, fetching live data from two independent APIs and handling every possible failure state gracefully.

## What it does

- Fetches course listings and the visitor's country code from two separate GET endpoints
- Displays price in the correct currency (₹ for India, $ for US) based on the country API response
- Handles four distinct UI states: **loading**, **error**, **empty results**, and **success**
- Falls back safely if the country API fails — shows "Price unavailable" instead of guessing the wrong currency
- Includes a search box and a sort-by-price dropdown
- Fully responsive grid: 3 columns on desktop, 2 on tablet, 1 on mobile
- Two Framer property controls (accent color, card border radius) so a designer can tweak the look without touching code

## Why it's built this way

**Two independent API calls.** The course data and country code come from separate endpoints that can each fail independently (the API is intentionally flaky — about 1 in 3 requests fail). Tracking their loading/error states separately means one failing doesn't break the other — courses can render even if pricing can't.

**`useState(null)` for courses instead of `useState([])`.** This distinguishes "data hasn't arrived yet" (`null`) from "data arrived and there are zero results" (`[]`) — two different states that need two different messages.

**No currency guessing.** If the country API fails, the component shows "Price unavailable" rather than defaulting to a currency that might be wrong for the visitor.

**Price conversion.** `pricePaise` and `priceUsdCents` are in the smallest currency unit — both are divided by 100 before formatting.

## Tech

- React (functional component, hooks: `useState`, `useEffect`)
- Plain JavaScript — no TypeScript types used despite the `.tsx` extension (Framer's default)
- CSS Grid with media queries for responsiveness

## Known limitations

- Very narrow mobile widths (under ~400px) could use more polish
- Property controls are currently styling-focused (color, radius); a column-count override or currency toggle would be more directly tied to the component's behavior

## Live demo

[Skillpath — Framer](https://fluffy-papaya-535554.framer.app/skillpath)
