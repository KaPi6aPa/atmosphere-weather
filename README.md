<div align="center">
  <h1>🌤️ Atmosphere Weather</h1>
  <p><strong>A modern, responsive weather application built with React and TypeScript</strong></p>
  <br/>
</div>

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technologies](#technologies)
- [Installation](#installation)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [API Reference](#api-reference)
- [Contributing](#contributing)
- [License](#license)

---

## 🌍 Overview

**Atmosphere Weather** is a modern web application that provides real-time weather information and forecasts for any location worldwide. Built with React, TypeScript, and Vite, it delivers a fast, reliable, and user-friendly experience for checking current weather conditions and upcoming forecasts.

---

## ✨ Features

- 🔍 **Smart Search**: Search for weather data by city name
- 🌡️ **Current Weather**: Real-time temperature, humidity, wind speed, and conditions
- 📅 **Weather Forecast**: 5-day detailed weather forecast
- 📱 **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- ⚡ **Fast Performance**: Built with Vite for instant load times
- 🎨 **Modern UI**: Clean and intuitive user interface with Lucide icons
- 🌍 **Global Support**: Access weather data for any location worldwide

---

## 🛠️ Technologies

| Technology | Version | Purpose |
|-----------|---------|---------|
| React | ^19.2.4 | UI framework |
| TypeScript | ~5.8.2 | Type safety |
| Vite | ^6.2.0 | Build tool & dev server |
| Axios | ^1.13.4 | HTTP client |
| Lucide React | ^0.563.0 | Icon library |
| date-fns | ^4.1.0 | Date formatting |

---

## 📦 Installation

### Prerequisites
- **Node.js** (v16 or higher)
- **npm** or **yarn** package manager

### Setup Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/atmosphere-weather.git
   cd atmosphere-weather
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # Create .env.local file in the root directory
   VITE_WEATHER_API_KEY=your_api_key_here
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:5173`

---

## 🚀 Usage

### Development

```bash
# Start development server with hot reload
npm run dev
```

### Production Build

```bash
# Build for production
npm run build

# Preview production build locally
npm run preview
```

### Basic Usage

1. Open the application in your browser
2. Enter a city name in the search bar
3. View current weather conditions and forecasts
4. Click on different days to explore detailed forecasts

---

## 📁 Project Structure

```
atmosphere-weather/
├── components/
│   ├── CurrentWeather.tsx      # Current conditions display
│   ├── ForecastList.tsx         # Forecast list component
│   ├── SearchBar.tsx            # Search input component
│   └── WeatherGrid.tsx          # Weather data grid layout
├── services/
│   └── weatherService.ts        # API integration & data fetching
├── App.tsx                      # Main application component
├── types.ts                     # TypeScript type definitions
├── index.tsx                    # React entry point
├── index.html                   # HTML template
├── package.json                 # Dependencies & scripts
├── tsconfig.json               # TypeScript configuration
├── vite.config.ts              # Vite configuration
└── README.md                   # This file
```

---

## 🔌 API Reference

### WeatherService

The `weatherService.ts` module handles all API communication:

#### `getWeatherData(query: string)`
Fetches current weather and forecast data for a given location.

**Parameters:**
- `query` (string): City name or location

**Returns:**
```typescript
Promise<{
  weather: WeatherData,
  forecast: ForecastData
}>
```

**Example:**
```typescript
const { weather, forecast } = await getWeatherData('New York');
```

---

## 📝 Contributing

Contributions are welcome! Here's how you can help:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Guidelines
- Follow the existing code style
- Add comments for complex logic
- Update documentation as needed
- Test your changes before submitting

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 👨‍💻 Author

Created with ❤️ for weather enthusiasts and developers.

---

<div align="center">

**⭐ If you find this project helpful, please consider giving it a star!**

</div>
