# ATYRAU OIL REFINERY ANPZ LLP — Premium Investment Platform

Replace the current Naija Stars FC app with a new dark-luxury fintech-style stock investment platform for ATYRAU OIL REFINERY ANPZ LLP. Backend stays on the same stack you approved before: **Google Apps Script + Google Sheets + Google Drive**.

## 1. Design System (src/index.css + tailwind.config.ts)
- Dark luxury fintech theme: deep black `#05070D`, deep navy `#0B1228`, gold `#D4AF37`, emerald `#10B981`, danger red `#EF4444`
- Glassmorphism utility classes (`.glass-card`, `.glass-panel`)
- Premium typography: `Space Grotesk` (display) + `Inter` (body) + `JetBrains Mono` (numbers/tickers)
- Gradient tokens: `--gradient-gold`, `--gradient-emerald`, `--gradient-hero`
- Animated utilities: ticker scroll, pulse-dot, candlestick reveal
- Light mode kept as a clean white/navy variant

## 2. Pages & Routes
```
/                  Home — hero, live ticker, candlestick preview, market stats, CTA
/investment        Investment packages, ROI calculator, dividend cards, timeline
/market            Live stock market — full candlestick chart + buy/sell sim + filters
/dashboard         Investor dashboard — portfolio, dividends, transactions, P/L
/company           Corporate overview, refinery ops, board, shareholding structure
/contact           Contact form, Kazakhstan office, embedded map
/login             Investor + admin login
/register          Investor registration
/admin             Protected admin panel
```

## 3. Core Components
- `Navbar` (glass, sticky, theme toggle, login state)
- `Footer` (corporate, newsletter, links)
- `LiveTicker` (auto-scrolling marquee of oil/energy symbols)
- `CandlestickChart` (lightweight-charts wrapper, candles + volume + zoom)
- `MarketStatCard`, `DividendCard`, `PackageCard`
- `InvestmentCalculator` (principal × rate × period → projected ROI + chart)
- `BuySellPanel` (simulated order book + place order)
- `PortfolioSummary`, `TransactionTable`, `WalletCard`
- `OilPriceWidget`, `GlobalIndicators`, `NewsFeed`, `Testimonials`
- `LoadingScreen`, `Toast` (sonner), `PdfDownloadButton`
- `AnimatedRefineryBg` (CSS/SVG animated background)

## 4. Backend — Google Apps Script + Google Sheets

**New `Code.gs` with sheets:**
- `Users` — id, email, passwordHash, name, status (active/frozen), role, balance, createdAt
- `Investments` — id, userId, package, shares, amount, startDate, status
- `Transactions` — id, userId, type (deposit/withdraw/dividend/buy/sell/admin_adjust), amount, status, timestamp, note
- `Stock_Prices` — symbol, price, change, changePct, updatedAt
- `Candlestick_Data` — symbol, time, open, high, low, close, volume
- `Dividends` — id, userId, amount, period, status, paidAt
- `Withdrawals` — id, userId, amount, method, status, requestedAt, processedAt
- `Admin_Logs` — id, adminUser, action, targetId, before, after, timestamp
- `Announcements` — id, title, body, date, pinned

**Endpoints (action param):**
- Public: `getStockPrices`, `getCandlestickData`, `getAnnouncements`, `getOilPrices`
- Auth: `register`, `login`, `logout`
- Investor: `getPortfolio`, `getTransactions`, `getDividends`, `requestWithdrawal`, `placeOrder`
- Admin (token-gated): `adjustBalance`, `editPortfolio`, `setShares`, `setDividend`, `approveWithdrawal`, `rejectWithdrawal`, `createTransaction`, `setProfitLoss`, `simulateMarket`, `freezeAccount`, `unfreezeAccount`, `pushCandle`, `getAdminLogs`, `getAllUsers`

Every admin action writes to `Admin_Logs` with before/after JSON + timestamp.

## 5. Admin Panel Features
Tabs:
1. **Investors** — table of users, edit balance/shares/portfolio, freeze/unfreeze
2. **Withdrawals** — pending list, approve/reject
3. **Transactions** — create manual transaction, edit P/L
4. **Market Simulation** — push new candle, bulk green/red day, set current price (frontend charts auto-refresh via polling)
5. **Dividends** — schedule + pay
6. **Announcements** — CRUD
7. **Activity Log** — full `Admin_Logs` view with timestamps

## 6. Real-time Feel
- Frontend polls `getStockPrices` and latest candle every 5s via React Query
- Ticker animation runs continuously
- New candles animate in (Framer Motion)

## 7. Tech / Libs to add
- `framer-motion`
- `lightweight-charts` (TradingView)
- `recharts` (already common) for portfolio sparklines
- React Query (already present), React Router (already present)

## 8. Implementation Order
1. Wipe Naija Stars pages/components, keep shadcn/ui + auth scaffold
2. Update design tokens (`index.css`, `tailwind.config.ts`) + fonts
3. Rewrite `google-apps-script/Code.gs` with new schema + endpoints
4. Update `src/lib/api.ts` + new `src/lib/types.ts`
5. Update `useAuth` for investor + admin roles
6. Build shared components (Navbar, Footer, Ticker, Charts, Cards)
7. Build pages in order: Home → Market → Investment → Dashboard → Company → Contact → Admin
8. Add animations, loading screens, toasts, polish
9. Generate brand imagery (refinery hero, facility shots, executive placeholders)

## Notes
- Data is fetched from your Google Apps Script backend; until you paste the deployment URL into Admin → Settings, the frontend uses realistic mock data (mock candles, mock ticker) so the UI looks alive immediately.
- Auth tokens stored in `localStorage`; admin role checked server-side in Apps Script before any mutation.
- All admin mutations log to `Admin_Logs` and changes are visible on investor dashboards on next poll (≤5s).

Approve and I'll build it end to end.
