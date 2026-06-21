# 🌤️ Premium Weather Dashboard

A premium, interactive, and visually stunning Weather Dashboard application built using **React 19**, **Vite**, **Tailwind CSS v4**, and **Framer Motion**. This application goes beyond standard weather forecast templates by incorporating real-time canvas-based color extraction, custom mathematical SVG charts, timezone-synchronized local clocks, and responsive particle animation overlays.

---

## ✨ Features

### 🎨 1. Dynamic Contrast & Color Extraction (`useImageColors`)
* **How it works:** A custom React Hook utilizes the **HTML5 Canvas API** to draw weather card background illustrations in memory. 
* **Luminance Math:** It calculates the average RGB values and determines perceived brightness using the standard **BT.709 perceived luminance formula**:  
  $$\text{Luminance} = 0.2126R + 0.7152G + 0.0722B$$
* **Dynamic Styling:** Automatically adjusts text, badge backgrounds, borders, and accent colors dynamically to ensure WCAG-compliant contrast and a blended, premium appearance matching the weather condition's dominant background theme.

### ⚡ 2. Immersive Atmospheric Overlays
Uses **Framer Motion** to render micro-interactive atmospheric condition overlays:
* ☀️ **Sunny:** Pulsing sun rays and sparkling elements.
* ☁️ **Cloudy:** Multi-layered clouds drifting horizontally at varying speeds.
* 🌧️ **Rainy:** Slanted falling rain vectors with speed changes based on conditions.
* ❄️ **Snowy:** Drifting snowflakes with sinusoidal horizontal sway.
* 🌩️ **Thunderstorm:** Multi-interval lightning flash flashes coupled with purple/blue rain.
* 🌫️ **Foggy:** Thick, rolling mist overlays drifting across the layout.

### 📈 3. Zero-Dependency SVG Bezier Curves
* Hand-crafted SVG charts that draw continuous bezier curves mathematically. 
* Avoids bulky third-party chart libraries to keep bundle size lightweight.
* Interactive tabs let users toggle forecasts for **Temperature**, **Precipitation Probability**, and **Wind Speed** dynamically with micro-interactive hover nodes.

### 🕰️ 4. Timezone-Ticking Solar Timeline
* Tracks the target location's timezone offset (`utc_offset_seconds`) to render a **live ticking clock** corresponding to the selected city.
* Maps a solar timeline using spring physics (`useSpring`) to trace the sun's path between **Sunrise** and **Sunset** based on local daytime progress.

### 🧭 5. Navigation & Layouts
* 🏠 **Dashboard (Home):** Aggregated metrics including Air Quality Index (PM2.5 slider), temperature charts, weather cards, and tomorrow's outlook.
* 📅 **7-Day Forecast Calendar:** Dedicated page showcasing detailed weekly outlooks.
* 🗺️ **Location Explorer:** Comparative overview of default global cities (Colombo, London, Paris, New York, Tokyo, Sydney) using router query parameters.
* 🌓 **Universal Dark Mode:** Multi-theme engine supporting Light, Dark, and System modes with a custom animated dropdown.

---

## 🛠️ Tech Stack

* **Frontend Library:** [React 19](https://react.dev/)
* **Build System:** [Vite 6](https://vite.dev/)
* **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
* **Animations:** [Framer Motion v12](https://www.framer.com/motion/)
* **Routing:** [React Router DOM v7](https://reactrouter.com/)
* **Icons:** [Lucide React](https://lucide.dev/)
* **Data Provider:** [Open-Meteo Weather API](https://open-meteo.com/)

---

## 📁 File Structure

```
weather-app/
├── public/                 # Static assets
├── src/
│   ├── assets/             # Weather illustrations & air quality assets
│   ├── common/             # Global Contexts & Scroll-to-Top helpers
│   │   ├── ThemeContext.jsx
│   │   └── ScrollToTopButton.jsx
│   ├── components/         # Shared layouts & reusable UI parts
│   │   ├── Header.jsx
│   │   ├── Sidebar.jsx
│   │   ├── ThemeToggle.jsx
│   │   └── WeatherEffects.jsx
│   ├── layouts/            # Page layouts
│   ├── lib/                # Config/system scripts
│   ├── pages/              # Main routing views
│   │   ├── home/           # Dashboard, Charts, Air Quality metrics
│   │   ├── calendar/       # 7-day forecast cards
│   │   └── location/       # Global cities browser
│   ├── utils/              # Calculation helpers & hooks
│   │   ├── useImageColors.js
│   │   └── weatherUtils.js
│   ├── App.jsx             # Main Router Setup
│   ├── index.css           # Tailwind custom overrides
│   └── main.jsx
├── package.json
└── vite.config.js
```

---

## 🚀 Getting Started

### 📋 Prerequisites
Ensure you have [Node.js](https://nodejs.org/) installed (v18.0.0 or higher recommended).

### ⚙️ Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/PasinduHirumal/weather-app.git
   cd weather-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server locally:
   ```bash
   npm run dev
   ```
   Open your browser and navigate to `http://localhost:5173` (or the port specified in terminal).

4. Build for production:
   ```bash
   npm run build
   ```

---

## 💡 Key Technical Showcase

### The Dynamic Color Extractor (`src/utils/useImageColors.js`)
Here's a snippet of the custom canvas-based hook that extracts and calculates compliant text styling values in real-time:

```javascript
// Draws a 24x24 canvas to read average RGB values from background images
const canvas = document.createElement('canvas');
canvas.width = 24;
canvas.height = 24;
const ctx = canvas.getContext('2d');
ctx.drawImage(img, 0, 0, 24, 24);
const imgData = ctx.getImageData(0, 0, 24, 24).data;

// Calculate BT.709 perceived brightness
const brightness = 0.2126 * r + 0.7152 * g + 0.0722 * b;
const isDark = brightness < 140;

// Returns contrasting primaryText, secondaryText, border, and badge colors...
```
