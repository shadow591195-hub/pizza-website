# Crust To Crave — Pizza Express Chauvin

An interactive, high-performance artisanal pizza web experience featuring a 193-frame cinema baking scroll animation, responsive glassmorphism navigation, dynamic crust sizing, and direct call-to-order workflow.

---

## 🍕 Features

- **193-Frame High-Definition Canvas Scrubbing**: Smooth sub-pixel alpha motion interpolation across a 340vh track for Retina and high-refresh-rate displays.
- **Scroll Hero with Timed Fade-Out**: "CRUST TO CRAVE" heading and "Freshly Baked. Loaded with Love." subheading fade away seamlessly at 30% scroll progress.
- **Real-Time Baking Percentage Timeline**: Floating indicator tracks scroll progress from 0% to 100% bake completion.
- **Fixed Transparent Glassmorphic Navigation**: Sticky top header with links scrolling directly to specific menu categories (Specialty Pizzas, Po-Boys, Turnovers, Sides) and Chauvin location details.
- **Interactive Size & Price Selection**: Live crust selection (Small, Medium, Large) on pizzas with instant reactive price updates.
- **Phone-in Order Flow**: Streamlined call-to-pay interface with direct kitchen dialing (`(985) 594-3112`).
- **Zero Initial Cart Count**: Starts clean with 0 items on arrival and updates reactively as items are added.

---

## 🚀 Quick Start (Local Development)

### Prerequisites
- Node.js (v14 or newer recommended)

### Run Locally
1. Clone this repository:
   ```bash
   git clone https://github.com/shadow591195-hub/pizza-website.git
   cd pizza-website
   ```

2. Start the local server:
   ```bash
   npm start
   # or run directly:
   node server.js
   ```

3. Open your browser:
   Visit [http://localhost:3000](http://localhost:3000)

---

## 🌐 Deploying to Vercel

This repository is optimized for **zero-configuration deployment on Vercel**:

### Method 1: Via Vercel Dashboard (Recommended)
1. Go to [Vercel](https://vercel.com) and log in.
2. Click **"Add New..."** > **"Project"**.
3. Import the `pizza-website` repository from your GitHub account (`shadow591195-hub/pizza-website`).
4. Framework Preset: Select **"Other"** (static site).
5. Leave the Root Directory as `./` and click **"Deploy"**.
6. Done! Your site is live on Vercel's global Edge CDN with optimized caching for all 193 baking frames.

### Method 2: Via Vercel CLI
```bash
npm i -g vercel
vercel
```

---

## 📁 Project Structure

```
├── frames/              # 193 pre-rendered cinema baking animation frames
├── index.html           # Semantic HTML5 markup with Tailwind CSS styling
├── style.css            # Custom glassmorphic styling, keyframes & responsive overrides
├── script.js            # Canvas rendering engine, scroll tracking & cart logic
├── server.js            # Lightweight Node.js static HTTP server
├── vercel.json          # Vercel deployment & Edge CDN caching headers
├── package.json         # NPM scripts and project metadata
└── README.md            # Documentation and deployment instructions
```

---

## 📄 License
ISC License. Crafted for Pizza Express Chauvin, LA.
