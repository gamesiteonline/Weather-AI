/* ============================================
   Africa Weather AI - Main Application
   ============================================ */

class AppManager {
    constructor() {
        this.currentCountry = null;
        this.currentWeather = null;
        this.suggestions = null;
        this.map = null;
        this.marker = null;
        this.autocomplete = null;
        this.leafletMap = null;
        this.leafletMarker = null;
        this.mapProvider = null;
        this.mapContainer = null;
        this.init();
    }

    async init() {
        console.log('🌍 Africa Weather AI - Initializing...');
        
        // Add CSS animations
        this.addAnimationStyles();
        
        // Add event listeners
        this.setupEventListeners();
        
        // Initialize map provider (Google Maps if available, otherwise Leaflet)
        await this.initMapProvider();
        
        // Try to load a random country on startup
        this.loadRandomCountry();
    }

    setupEventListeners() {
        // Handle country clicks if we add a country list later
        document.addEventListener('countrySelected', (event) => {
            this.loadWeather(event.detail.key, event.detail.name);
        });
    }

    async initGoogleMap() {
        const apiKey = window.CONFIG?.GOOGLE_MAPS_API_KEY;
        const mapContainer = document.getElementById('map');
        if (!apiKey || !mapContainer) return false;

        this.mapContainer = mapContainer;
        window.gm_authFailure = () => {
            throw new Error('Google Maps authentication failed');
        };

        try {
            await this.loadGoogleMapsScript(apiKey);

            if (!window.google?.maps) {
                throw new Error('Google Maps library is not available after script load');
            }

            const africaCenter = { lat: 4.2, lng: 21.0 };
            this.map = new google.maps.Map(mapContainer, {
                center: africaCenter,
                zoom: 4,
                disableDefaultUI: true,
                styles: [
                    { elementType: 'geometry', stylers: [{ color: '#0f1419' }] },
                    { elementType: 'labels.text.stroke', stylers: [{ color: '#242f3e' }] },
                    { elementType: 'labels.text.fill', stylers: [{ color: '#b0b0b0' }] },
                    { featureType: 'administrative.country', elementType: 'geometry', stylers: [{ color: '#1d2c4d' }] },
                    { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#0f172a' }] }
                ]
            });

            this.marker = new google.maps.Marker({ map: this.map });
            this.mapProvider = 'google';

            const checkMapHealth = (attempts = 0) => {
                if (mapContainer.querySelector('.gm-err-title') || mapContainer.innerText.includes('Oops! Something went wrong')) {
                    this.initLeafletMap()
                        .catch((leafletError) => {
                            console.error('Leaflet fallback failed:', leafletError);
                            this.showMapFallback('Google Maps unavailable and the free map fallback failed.');
                        });
                    return;
                }
                if (attempts < 8) {
                    setTimeout(() => checkMapHealth(attempts + 1), 300);
                }
            };
            checkMapHealth();

            if (window.google && google.maps && google.maps.places && window.uiManager?.elements.countrySearch) {
                this.autocomplete = new google.maps.places.Autocomplete(window.uiManager.elements.countrySearch, {
                    fields: ['geometry', 'name', 'address_components'],
                    types: ['(regions)']
                });
                this.autocomplete.addListener('place_changed', () => {
                    this.handlePlaceAutocomplete();
                });
            }

            return true;
        } catch (error) {
            console.warn('Google Maps initialization failed:', error);
            return false;
        }
    }

    loadGoogleMapsScript(apiKey) {
        return new Promise((resolve, reject) => {
            if (window.google && window.google.maps) {
                resolve();
                return;
            }

            window.initGoogleMaps = () => {
                resolve();
                delete window.initGoogleMaps;
            };

            window.gm_authFailure = () => {
                reject(new Error('Google Maps authentication failed'));
            };

            const script = document.createElement('script');
            script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=initGoogleMaps`;
            script.async = true;
            script.defer = true;
            script.onerror = () => reject(new Error('Failed to load Google Maps script'));
            document.head.appendChild(script);
        });
    }

    async initLeafletMap() {
        const mapContainer = document.getElementById('map');
        if (!mapContainer || !window.L) {
            throw new Error('Leaflet not available');
        }

        this.mapContainer = mapContainer;
        mapContainer.innerHTML = '';

        this.leafletMap = window.L.map(mapContainer).setView([4.2, 21.0], 4);
        window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(this.leafletMap);

        this.leafletMarker = window.L.marker([4.2, 21.0]).addTo(this.leafletMap);
        this.mapProvider = 'leaflet';
    }

    showMapFallback(message) {
        if (!this.mapContainer) return;
        this.mapContainer.innerHTML = `
            <div class="map-fallback">
                <strong>Map Unavailable</strong>
                <p>${message}</p>
            </div>
        `;
        this.mapContainer.classList.add('map-fallback-visible');
    }

    async initMapProvider() {
        const success = await this.initGoogleMap();
        if (success) return;

        try {
            await this.initLeafletMap();
        } catch (leafletError) {
            console.error('Leaflet fallback failed:', leafletError);
            this.showMapFallback('No map provider is available right now.');
        }
    }

    handlePlaceAutocomplete() {
        const place = this.autocomplete?.getPlace?.();
        if (!place || !place.geometry) return;

        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        const label = place.name || 'Selected Location';

        this.updateMapMarker(lat, lng, label);
        this.loadWeatherByCoordinates(lat, lng);
    }

    updateMapMarker(lat, lng, label = '') {
        if (this.mapProvider === 'google' && this.map && this.marker) {
            this.marker.setPosition({ lat, lng });
            this.marker.setTitle(label);
            this.map.panTo({ lat, lng });
            this.map.setZoom(7);
            return;
        }

        if (this.mapProvider === 'leaflet' && this.leafletMap && this.leafletMarker) {
            this.leafletMarker.setLatLng([lat, lng]);
            this.leafletMarker.bindPopup(label || 'Location').openPopup();
            this.leafletMap.setView([lat, lng], 7);
            return;
        }
    }

    reorderCountryListByCurrent(currentKey) {
        const countries = getCountriesList();
        if (!currentKey) return countries;
        const normalizedKey = currentKey.toLowerCase();
        const first = countries.find(c => c.key.toLowerCase() === normalizedKey);
        if (!first) return countries;
        return [first, ...countries.filter(c => c.key.toLowerCase() !== normalizedKey)];
    }

    loadRandomCountry() {
        const country = getRandomCountry();
        this.loadWeather(country.key, country.name);
    }

    async loadWeather(countryKey, countryName) {
        try {
            window.uiManager.showLoadingState();
            
            const countryData = getCountryByKey(countryKey);
            if (!countryData) {
                throw new Error('Country not found');
            }

            this.currentCountry = { key: countryKey, ...countryData };
            
            // Fetch weather data
            const weather = await window.weatherAPI.getWeatherByCoordinates(
                countryData.coordinates.lat,
                countryData.coordinates.lng,
                countryName
            );

            this.currentWeather = weather;
            
            // Generate AI suggestions
            this.suggestions = window.aiSuggestions.generateSuggestions(weather, countryKey);
            
            // Update UI
            this.updateUI();
            
            // Update search input
            if (window.uiManager.elements.countrySearch) {
                window.uiManager.elements.countrySearch.value = countryName;
            }

            window.uiManager.displayCountryList(this.reorderCountryListByCurrent(countryKey));
            this.updateMapMarker(countryData.coordinates.lat, countryData.coordinates.lng, countryName);
            window.uiManager.showNotification(`Loaded weather for ${countryName}`, 'success');
            
        } catch (error) {
            console.error('Error loading weather:', error);
            if (window.uiManager) {
                window.uiManager.showErrorState('Failed to load weather for this country');
                window.uiManager.showNotification('Error loading weather', 'error');
            }
        }
    }

    async loadWeatherByCoordinates(lat, lng) {
        try {
            window.uiManager.showLoadingState();
            
            // Get country info from coordinates
            const locationInfo = await window.weatherAPI.searchCountryByCoordinates(lat, lng);
            
            // Fetch weather data
            const weather = await window.weatherAPI.getWeatherByCoordinates(
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
                this.suggestions = window.aiSuggestions.generateSuggestions(weather, countryKey);
            } else {
                this.suggestions = window.aiSuggestions.generateSuggestions(weather, null);
            }
            
            // Update UI
            this.updateUI();
            
            const displayName = locationInfo?.city || locationInfo?.country || 'Current Location';
            if (window.uiManager.elements.countrySearch) {
                window.uiManager.elements.countrySearch.value = displayName;
            }

            window.uiManager.displayCountryList(this.reorderCountryListByCurrent(countryKey));
            this.updateMapMarker(lat, lng, displayName);
            window.uiManager.showNotification(`Loaded weather for ${displayName}`, 'success');
            
        } catch (error) {
            console.error('Error loading weather by coordinates:', error);
            if (window.uiManager) {
                window.uiManager.showErrorState('Failed to load weather for your location');
                window.uiManager.showNotification('Error: Could not determine country', 'error');
            }
        }
    }

    updateUI() {
        if (!this.currentWeather || !this.suggestions) return;

        // Add weather rating to weather object
        this.currentWeather.rating = this.suggestions.overallRating;

        // Update all UI sections
        window.uiManager.displayWeatherWidget(this.currentWeather, this.currentCountry?.name || 'Unknown');
        window.uiManager.displayCurrentWeather(this.currentWeather);
        window.uiManager.displayAISuggestions(this.suggestions);
        window.uiManager.displayActivities(this.suggestions);
        window.uiManager.displayCuisine(this.suggestions);
        window.uiManager.displayWarnings(this.suggestions);
        window.uiManager.displayAdvantages(this.suggestions);
        window.uiManager.displayForecast(this.currentWeather);
        window.uiManager.renderShareButtons(this.currentWeather, this.currentCountry?.name || 'Current Location');
        // Update Three.js visual effects based on current weather
        try {
            if (window.backgroundScene && typeof window.backgroundScene.updateWeatherEffects === 'function') {
                window.backgroundScene.updateWeatherEffects(this.currentWeather);
            }
        } catch (e) {
            console.warn('Background update failed:', e);
        }
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

// Ensure global instances exist for browser script loading order.
function initializeAppWhenReady() {
    if (typeof window.WeatherAPI === 'undefined' || typeof window.AISuggestions === 'undefined' || typeof window.UIManager === 'undefined') {
        setTimeout(initializeAppWhenReady, 50);
        return;
    }

    if (!window.weatherAPI) {
        window.weatherAPI = new WeatherAPI();
    }

    if (!window.aiSuggestions) {
        window.aiSuggestions = new AISuggestions();
    }

    if (!window.uiManager) {
        window.uiManager = new UIManager();
    }

    window.appManager = new AppManager();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeAppWhenReady);
} else {
    initializeAppWhenReady();
}
