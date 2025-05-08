# Real-Time Crypto Price Tracker

A beautiful, professional, and fully responsive cryptocurrency price tracker inspired by CoinMarketCap. Built with React, Redux Toolkit, Tailwind CSS, and a simulated real-time price update engine.

---

## 🚀 Features
- **Live price updates** (simulated WebSocket)
- **All major crypto columns**: #, Logo, Name, Symbol, Price, 1h %, 24h %, 7d %, Market Cap, 24h Volume, Circulating Supply, Max Supply, 7D Chart
- **Responsive split-table UX**:
  - **Desktop (`xl` and up):** Full table, all columns visible
  - **Tablet/Mobile (`<xl`):** First 3 columns (#, Logo, Name) fixed, rest scroll horizontally
- **Color-coded % changes** (green/red)
- **Modern, clean UI** with Tailwind CSS
- **All state managed by Redux Toolkit**
- **No custom CSS**—all layout and style via Tailwind
- **Beautiful, creative, and professional look**

---

## 🛠️ Tech Stack
- **React** (Vite)
- **Redux Toolkit** (state management)
- **Tailwind CSS** (utility-first styling)
- **TypeScript** (type safety)
- **Simulated WebSocket** (real-time price updates)

---

## 🏗️ Architecture
- **src/components/CryptoTable.tsx**: Main responsive table component, all Tailwind
- **src/store/cryptoSlice.ts**: Redux slice for crypto asset state
- **src/store/store.ts**: Redux store setup
- **src/services/websocketService.ts**: Simulates real-time price updates
- **Public asset URLs** for logos and sparklines (no local images needed)

### Responsive Table Logic
- **Desktop (`xl` and up):**
  - Single table, all columns visible, perfectly aligned
- **Tablet/Mobile (`<xl`):**
  - Split-table: left half (#, Logo, Name) is sticky/fixed, right half (all other columns) is horizontally scrollable
  - Row heights are synced for perfect alignment

---

## ⚡ Setup Instructions

1. **Clone the repo:**
   ```bash
   git clone <your-repo-url>
   cd crypto-price-tracker
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the dev server:**
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:5173` (or as shown in your terminal).

4. **Build for production:**
   ```bash
   npm run build
   ```

---

## 🧩 Customization & Notes
- **Add more coins:** Edit the `initialState` in `src/store/cryptoSlice.ts`.
- **Change update frequency:** Edit `UPDATE_INTERVAL` in `src/services/websocketService.ts`.
- **Change columns:** Edit the table headers and rows in `CryptoTable.tsx`.
- **All styling is via Tailwind:** Tweak classes in JSX for instant design changes.

---

## 📱 Breakpoint Reference
- **Desktop (`xl` and up):** Full table, all columns
- **Tablet/Mobile (`<xl`):** Split-table, first 3 columns fixed, rest scrollable
- **Mobile:** Table is horizontally scrollable, all columns always visible

---

## 📦 Dependencies
- react, react-dom, @reduxjs/toolkit, react-redux, tailwindcss, typescript, vite

---

## 🙏 Credits
- Inspired by [CoinMarketCap](https://coinmarketcap.com/)
- Crypto logos and sparklines from public CoinMarketCap URLs

---

## 📝 License
MIT

---

## 🚦 Advanced Usage

### 1. **Customizing Columns & Data**
- To add/remove columns, simply edit the `<th>` and `<td>` elements in `CryptoTable.tsx`.
- To add more assets, update the `initialState` array in `src/store/cryptoSlice.ts`.
- You can add new fields to the asset type and display them in the table as needed.

### 2. **Integrating Real Crypto APIs**
- Replace the simulated WebSocket logic in `src/services/websocketService.ts` with real API calls (e.g., CoinGecko, CoinMarketCap API).
- Use Redux async thunks or RTK Query for fetching live data.
- You can keep the split-table and responsive logic unchanged.

### 3. **Sticky Headers**
- For sticky table headers, add `sticky top-0 z-20 bg-white` to `<th>` elements and their parent `<tr>`.
- This works best for the scrollable (right) table on mobile/tablet.

### 4. **Dark Mode**
- Enable Tailwind's dark mode in `tailwind.config.js`.
- Add `dark:` classes to your JSX (e.g., `dark:bg-gray-900 dark:text-gray-100`).
- You can use a toggle button to switch themes.

### 5. **Sorting & Filtering**
- Add sorting logic by storing sort state in Redux or local component state.
- Use clickable `<th>` elements to trigger sorting.
- For filtering, add a search input and filter the assets array before rendering.

### 6. **Accessibility**
- Use semantic table markup (`<thead>`, `<tbody>`, `<th>`, `<td>`).
- Add `aria-label` and `scope` attributes to headers for screen readers.
- Ensure color contrast is sufficient for all users.

### 7. **Performance**
- For large datasets, consider using React virtualization libraries (e.g., `react-virtualized`).
- Use memoized selectors and `React.memo` for table rows if needed.

### 8. **Deployment**
- Deploy to Vercel, Netlify, or any static hosting provider.
- The app is fully static and requires no backend server.

---
