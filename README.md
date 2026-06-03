# Africa Weather AI 🌍☀️

#live at `https://weather-ai-africa.netlify.app/`
A modern, real-time weather web application designed specifically for African countries, featuring AI-powered suggestions, beautiful glass morphism design, and immersive 3D backgrounds.

## ✨ Features

### 🌦️ Real-Time Weather
- Current weather conditions for 20+ African countries
- 7-day weather forecast
- Detailed meteorological data (temperature, humidity, wind speed, precipitation)
- Weather rating system (1-10 stars)

### 🤖 AI-Powered Suggestions
- Smart recommendations based on current weather conditions
- Activity suggestions tailored to weather and location
- Local cuisine recommendations
- Weather-based warnings and safety tips
- Daily advantages and opportunities

### 🎨 Modern Design
- **Glass Morphism**: Sleek, transparent UI elements with backdrop blur
- **Three.js 3D Background**: Animated geometric shapes and particles
- **Responsive Design**: Perfect on mobile, tablet, and desktop
- **African-Inspired Color Palette**: Warm oranges, deep blues, and teal accents
- **Smooth Animations**: Fade-ins, slides, and interactive elements

### 📍 Geolocation Support
- Detect user's current location
- Auto-load weather for nearest African country
- Manual country search and selection

### 🗺️ Comprehensive Country Database
Includes weather data for:
- Egypt, South Africa, Nigeria, Kenya, Morocco, Ghana, Tanzania, Ethiopia, Ivory Coast, Cameroon, Uganda, Zambia, Zimbabwe, Namibia, Botswana, Rwanda, Senegal, Congo, Mali, Guinea, Benin, Togo, and more!

## 🚀 Quick Start

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Internet connection for weather API access

### Installation

1. **Clone or download the project**
```bash
git clone <repository-url>
cd africa-weather-ai
```

2. **Open in browser**
```bash
# Simply open index.html in your browser
# Or use a local server for best experience
python -m http.server 8000
# Then visit: http://localhost:8000
```

3. **No installation needed!**
All dependencies are loaded from CDNs:
- Three.js for 3D graphics
- Open-Meteo API for weather data (free, no authentication required)

## 📁 Project Structure

```
africa-weather-ai/
├── index.html              # Main HTML file
├── styles.css              # Global styles with glass morphism
└── js/
    ├── main.js             # Main application manager
    ├── ui.js               # UI components and DOM updates
    ├── weather-api.js      # Weather API integration (Open-Meteo)
    ├── ai-suggestions.js   # AI suggestion engine
    ├── background.js       # Three.js 3D scene
    └── african-countries.js # Country database & helper functions
```

## 🎯 How to Use

1. **Select a Country**
   - Type in the search bar to find an African country
   - Press Enter to load weather
   - Or click "Use Location" to auto-detect

2. **View Weather Data**
   - Real-time conditions at the top
   - Current weather details (temperature, humidity, wind)
   - 7-day forecast at the bottom

3. **Get AI Suggestions**
   - Smart recommendations based on weather
   - Activities suited for today
   - Local cuisine recommendations
   - Weather warnings and safety tips
   - Daily advantages

4. **Weather Rating**
   - 5-star rating system
   - Based on temperature, humidity, wind, and precipitation
   - Helps you plan your day

## 🛠️ Technologies Used

### Frontend
- **HTML5**: Semantic markup
- **CSS3**: Modern styling with:
  - CSS Grid and Flexbox
  - Glass morphism effects
  - Animations and transitions
  - Responsive design (mobile-first)
- **JavaScript (ES6+)**: Modern JavaScript with:
  - Object-oriented programming
  - Async/await
  - DOM manipulation

### Libraries & APIs
- **Three.js**: 3D graphics and animations
- **Open-Meteo API**: Free weather data (no authentication required)
- **Nominatim (OpenStreetMap)**: Geolocation services
- **Native Geolocation API**: Browser location access

## 🎨 Design Features

### Glass Morphism
- Frosted glass effect using `backdrop-filter: blur()`
- Semi-transparent backgrounds with borders
- Creates elegant, modern appearance
- Works on all modern browsers

### Color Theory
- **Primary (Orange)**: #FF6B35 - Warmth and energy
- **Secondary (Blue)**: #004E89 - Trust and stability  
- **Accent (Teal)**: #1AB5A3 - Growth and freshness
- **Dark Background**: #0F1419 - Contrast and readability

### 3D Background
- Animated geometric shapes (icosahedron, octahedron, cube)
- Floating particles system
- Responsive to window resizing
- Non-intrusive (pointer-events: none)

## 📱 Responsive Breakpoints

- **Desktop**: 1024px and above
- **Tablet**: 768px - 1023px
- **Mobile**: Below 768px
- **Small Mobile**: Below 480px

All UI elements adapt gracefully to screen size.

## 🔗 API Integration

### Weather API
- **Provider**: Open-Meteo (https://open-meteo.com)
- **Authentication**: None required
- **Updates**: Real-time data
- **Features**: Current weather, hourly, daily, 7-day forecast

### Geolocation
- **Browser Geolocation API**: For user's current coordinates
- **Nominatim (OSM)**: For reverse geocoding

## 💡 Features in Development

- [ ] Weather alerts and notifications
- [ ] Multiple language support
- [ ] Favorite countries list
- [ ] Weather history and statistics
- [ ] Photo sharing with weather context
- [ ] Integration with calendar for event planning
- [ ] Air quality index (AQI)
- [ ] UV index and sun exposure data

## 🤝 Contributing

Contributions are welcome! Areas to improve:
- Add more African countries
- Enhance AI suggestions
- Improve mobile UX
- Add new weather data sources
- Optimize performance

## 📄 License

This project is open source and available under the MIT License.

## 👨‍💻 Developer Credit

**Developed by**: Fahad Mohamed  
**Location**: Tanzania 🇹🇿  
**Version**: 1.0

## 🙏 Acknowledgments

- Open-Meteo for free weather data
- OpenStreetMap/Nominatim for geolocation
- Three.js community for 3D graphics
- MDN Web Docs for web standards

## 📞 Support

For issues, questions, or suggestions:
- Check the GitHub issues
- Review the code comments
- Test in different browsers
- Clear browser cache if experiencing issues

## 🌟 Show Your Support

If you find this project helpful, please:
- ⭐ Star the repository
- 📢 Share with others
- 🤝 Contribute improvements
- 💬 Provide feedback

---

**Made with ❤️ for Africa** 🌍
