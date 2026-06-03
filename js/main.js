/* ============================================
   Africa Weather AI - Main Application
   ============================================ */

class AppManager {
    constructor() {
        this.currentCountry = null;
        this.currentWeather = null;
        this.suggestions = null;
        this.init();
    }

    async init() {
        console.log('🌍 Africa Weather AI - Initializing...');
        
        // Add CSS animations
        this.addAnimationStyles();
        
        // Try to load a random country on startup
        this.loadRandomCountry();
        
        // Add event listeners
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Handle country clicks if we add a country list later
        document.addEventListener('countrySelected', (event) => {
            this.loadWeather(event.detail.key, event.detail.name);
        });
    }

    loadRandomCountry() {
        const country = getRandomCountry();
        this.loadWeather(country.key, country.name);
    }

    async loadWeather(countryKey, countryName) {
        try {
            uiManager.showLoadingState();
            
            const countryData = getCountryByKey(countryKey);
            if (!countryData) {
                throw new Error('Country not found');
            }

            this.currentCountry = { key: countryKey, ...countryData };
            
            // Fetch weather data
            const weather = await weatherAPI.getWeatherByCoordinates(
                countryData.coordinates.lat,
                countryData.coordinates.lng,
                countryName
            );

            this.currentWeather = weather;
            
            // Generate AI suggestions
            this.suggestions = aiSuggestions.generateSuggestions(weather, countryKey);
            
            // Update UI
            this.updateUI();
            
            // Update search input
            if (uiManager.elements.countrySearch) {
                uiManager.elements.countrySearch.value = countryName;
            }

            uiManager.showNotification(`Loaded weather for ${countryName}`, 'success');
            
        } catch (error) {
            console.error('Error loading weather:', error);
            uiManager.showErrorState('Failed to load weather for this country');
            uiManager.showNotification('Error loading weather', 'error');
        }
    }

    async loadWeatherByCoordinates(lat, lng) {
        try {
            uiManager.showLoadingState();
            
            // Get country info from coordinates
            const locationInfo = await weatherAPI.searchCountryByCoordinates(lat, lng);
            
            // Fetch weather data
            const weather = await weatherAPI.getWeatherByCoordinates(
                lat,
                lng,
                locationInfo?.country || 'Your Location'
            );

            this.currentWeather = weather;
            
            // Try to match with our African countries
            let countryKey = null;
            if (locationInfo) {
                const countryList = getCountriesList();
                const matched = countryList.find(c => 
                    c.code === locationInfo.countryCode ||
                    c.name.toLowerCase() === locationInfo.country.toLowerCase()
                );
                if (matched) {
                    countryKey = matched.key;
                    this.currentCountry = matched;
                }
            }

            if (countryKey) {
                this.suggestions = aiSuggestions.generateSuggestions(weather, countryKey);
            } else {
                this.suggestions = aiSuggestions.generateSuggestions(weather, null);
            }
            
            // Update UI
            this.updateUI();
            
            const displayName = locationInfo?.city || locationInfo?.country || 'Current Location';
            if (uiManager.elements.countrySearch) {
                uiManager.elements.countrySearch.value = displayName;
            }

            uiManager.showNotification(`Loaded weather for ${displayName}`, 'success');
            
        } catch (error) {
            console.error('Error loading weather by coordinates:', error);
            uiManager.showErrorState('Failed to load weather for your location');
            uiManager.showNotification('Error: Could not determine country', 'error');
        }
    }

    updateUI() {
        if (!this.currentWeather || !this.suggestions) return;

        // Add weather rating to weather object
        this.currentWeather.rating = this.suggestions.overallRating;

        // Update all UI sections
        uiManager.displayWeatherWidget(this.currentWeather, this.currentCountry?.name || 'Unknown');
        uiManager.displayCurrentWeather(this.currentWeather);
        uiManager.displayAISuggestions(this.suggestions);
        uiManager.displayActivities(this.suggestions);
        uiManager.displayCuisine(this.suggestions);
        uiManager.displayWarnings(this.suggestions);
        uiManager.displayAdvantages(this.suggestions);
        uiManager.displayForecast(this.currentWeather);
    }

    addAnimationStyles() {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }

            @keyframes slideOut {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(100%);
                    opacity: 0;
                }
            }

            .error-message {
                text-align: center;
                padding: 2rem;
                color: var(--danger, #FF4757);
            }

            .error-message p {
                margin: 0.5rem 0;
            }

            .notification-success {
                color: var(--success, #2DD4BF);
            }

            .notification-error {
                color: var(--danger, #FF4757);
            }

            .notification-info {
                color: var(--warning, #FFA502);
            }

            .weather-widget-content {
                width: 100%;
            }

            .weather-location {
                font-size: 2rem;
                margin-bottom: 1rem;
                background: linear-gradient(135deg, #FF6B35, #1AB5A3);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
            }

            .weather-current {
                display: flex;
                gap: 2rem;
                flex-wrap: wrap;
                align-items: center;
            }

            .weather-main {
                display: flex;
                align-items: center;
                gap: 1.5rem;
                flex: 1;
                min-width: 200px;
            }

            .weather-emoji {
                font-size: 4rem;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .weather-details {
                display: flex;
                flex-direction: column;
            }

            .weather-temp {
                font-size: 3rem;
                font-weight: 700;
                color: #FF6B35;
            }

            .weather-condition {
                font-size: 1.2rem;
                color: #B0B0B0;
                margin-top: 0.5rem;
            }

            .weather-stats {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
                gap: 1rem;
                flex: 1;
                min-width: 200px;
            }

            .stat {
                display: flex;
                flex-direction: column;
                align-items: center;
                padding: 1rem;
                background: rgba(255, 255, 255, 0.05);
                border-radius: 0.75rem;
                border: 1px solid rgba(255, 255, 255, 0.1);
            }

            .stat-label {
                font-size: 0.8rem;
                color: #B0B0B0;
                margin-bottom: 0.5rem;
            }

            .stat-value {
                font-size: 1.3rem;
                font-weight: 600;
                color: #1AB5A3;
            }

            .stat-stars {
                font-size: 1rem;
                letter-spacing: 0.2rem;
            }

            .suggestions-list {
                list-style: none;
                padding: 0;
            }

            .suggestions-list li {
                padding: 0.5rem 0;
                color: #B0B0B0;
            }

            .suggestions-list li::before {
                content: '✓ ';
                color: #1AB5A3;
                font-weight: bold;
                margin-right: 0.5rem;
            }

            .rating {
                margin-top: 1rem;
                padding-top: 1rem;
                border-top: 1px solid rgba(255, 255, 255, 0.1);
                color: #B0B0B0;
            }

            .activity-chip,
            .cuisine-item,
            .warning-item,
            .advantage-item {
                display: inline-block;
                padding: 0.5rem 1rem;
                margin: 0.3rem;
                background: rgba(26, 181, 163, 0.1);
                border: 1px solid rgba(26, 181, 163, 0.3);
                border-radius: 2rem;
                color: #1AB5A3;
                font-size: 0.9rem;
                transition: all 0.3s ease;
            }

            .activity-chip:hover,
            .cuisine-item:hover,
            .warning-item:hover,
            .advantage-item:hover {
                background: rgba(26, 181, 163, 0.2);
                border-color: rgba(26, 181, 163, 0.5);
                transform: translateY(-2px);
            }

            .warning-item {
                background: rgba(255, 71, 87, 0.1);
                border-color: rgba(255, 71, 87, 0.3);
                color: #FF4757;
            }

            .warning-item:hover {
                background: rgba(255, 71, 87, 0.2);
                border-color: rgba(255, 71, 87, 0.5);
            }

            .advantage-item {
                background: rgba(45, 212, 191, 0.1);
                border-color: rgba(45, 212, 191, 0.3);
                color: #2DD4BF;
            }

            .advantage-item:hover {
                background: rgba(45, 212, 191, 0.2);
                border-color: rgba(45, 212, 191, 0.5);
            }

            .weather-info p {
                margin: 0.8rem 0;
                padding: 0.5rem 0;
                border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            }

            .forecast-temp-min {
                font-size: 0.85rem;
                color: #B0B0B0;
                margin-top: 0.2rem;
            }

            .forecast-condition-text {
                font-size: 0.8rem;
                color: #B0B0B0;
                margin-top: 0.3rem;
            }

            @media (max-width: 768px) {
                .weather-current {
                    flex-direction: column;
                    gap: 1rem;
                }

                .weather-main {
                    width: 100%;
                }

                .weather-stats {
                    width: 100%;
                    grid-template-columns: repeat(2, 1fr);
                }

                .weather-emoji {
                    font-size: 3rem;
                }

                .weather-temp {
                    font-size: 2rem;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.appManager = new AppManager();
    });
} else {
    window.appManager = new AppManager();
}
