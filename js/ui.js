/* ============================================
   UI Manager - Handles DOM Updates
   ============================================ */

class UIManager {
    constructor() {
        this.elements = this.initializeElements();
        this.bindEvents();
    }

    initializeElements() {
        return {
            countrySearch: document.getElementById('countrySearch'),
            useLocationBtn: document.getElementById('useLocationBtn'),
            weatherContent: document.getElementById('weatherContent'),
            currentWeather: document.getElementById('currentWeather'),
            aiSuggestions: document.getElementById('aiSuggestions'),
            activities: document.getElementById('activities'),
            cuisine: document.getElementById('cuisine'),
            dangers: document.getElementById('dangers'),
            advantages: document.getElementById('advantages'),
            forecast: document.getElementById('forecast')
        };
    }

    bindEvents() {
        if (this.elements.countrySearch) {
            this.elements.countrySearch.addEventListener('input', (e) => {
                this.onCountrySearch(e);
            });
            this.elements.countrySearch.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') this.handleSearchSubmit(e);
            });
        }

        if (this.elements.useLocationBtn) {
            this.elements.useLocationBtn.addEventListener('click', () => {
                this.onUseLocationClick();
            });
        }
    }

    displayWeatherWidget(weather, country) {
        if (!this.elements.weatherContent) return;

        const ratingStars = this.getStarRating(weather.rating || 5);
        
        const html = `
            <div class="weather-widget-content">
                <h2 class="weather-location">${country}</h2>
                <p class="weather-summary">${this.getWeatherNarrative(weather)}</p>
                <div class="weather-current">
                    <div class="weather-main">
                        <span class="weather-emoji">${weather.current.emoji}</span>
                        <div class="weather-details">
                            <span class="weather-temp">${weather.current.temperature}°C</span>
                            <span class="weather-condition">${weather.current.condition}</span>
                        </div>
                    </div>
                    <div class="weather-stats">
                        <div class="stat">
                            <span class="stat-label">Feels Like</span>
                            <span class="stat-value">${weather.current.apparentTemperature}°C</span>
                        </div>
                        <div class="stat">
                            <span class="stat-label">Humidity</span>
                            <span class="stat-value">${weather.current.humidity}%</span>
                        </div>
                        <div class="stat">
                            <span class="stat-label">Wind Speed</span>
                            <span class="stat-value">${weather.current.windSpeed} km/h</span>
                        </div>
                        <div class="stat">
                            <span class="stat-label">Weather Rating</span>
                            <span class="stat-stars">${ratingStars}</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
        this.elements.weatherContent.innerHTML = html;
    }

    displayCurrentWeather(weather) {
        if (!this.elements.currentWeather) return;

        const html = `
            <div class="weather-info">
                <p><strong>Temperature:</strong> ${weather.current.temperature}°C</p>
                <p><strong>Condition:</strong> ${weather.current.condition} ${weather.current.emoji}</p>
                <p><strong>Humidity:</strong> ${weather.current.humidity}%</p>
                <p><strong>Wind:</strong> ${weather.current.windSpeed} km/h</p>
                <p><strong>Precipitation Chance:</strong> ${weather.current.precipitation}%</p>
            </div>
        `;
        this.elements.currentWeather.innerHTML = html;
    }

    displayAISuggestions(suggestions) {
        if (!this.elements.aiSuggestions) return;

        const immediateSuggestions = suggestions.immediate
            .slice(0, 3)
            .map(s => `<li>${s}</li>`)
            .join('');

        const doSuggestions = suggestions.dos
            .slice(0, 3)
            .map(s => `<li>${s}</li>`)
            .join('');

        const dontSuggestions = suggestions.donts
            .slice(0, 3)
            .map(s => `<li>${s}</li>`)
            .join('');

        const eventChips = suggestions.events
            .slice(0, 3)
            .map(event => `<div class="activity-chip">${event}</div>`)
            .join('');

        const html = `
            <div class="suggestions-summary">${suggestions.summary || 'Smart weather insights for your day.'}</div>
            <ul class="suggestions-list">
                ${immediateSuggestions || '<li>Collect weather data...</li>'}
            </ul>
            <div class="suggestions-block">
                <div>
                    <strong>Do</strong>
                    <ul>${doSuggestions || '<li>Stay ready for changing weather</li>'}</ul>
                </div>
                <div>
                    <strong>Don't</strong>
                    <ul>${dontSuggestions || '<li>Avoid unnecessary risk</li>'}</ul>
                </div>
            </div>
            <div class="suggestions-event-chips">
                ${eventChips}
            </div>
            <div class="rating">
                <strong>Today's Rating:</strong> ${this.getStarRating(suggestions.overallRating)}
            </div>
        `;
        this.elements.aiSuggestions.innerHTML = html;
    }

    displayActivities(suggestions) {
        if (!this.elements.activities) return;

        const activitiesHTML = suggestions.activities
            .slice(0, 4)
            .map(activity => `<div class="activity-chip">${activity}</div>`)
            .join('');

        this.elements.activities.innerHTML = activitiesHTML || '<p>No activities available</p>';
    }

    displayCuisine(suggestions) {
        if (!this.elements.cuisine) return;

        const cuisineHTML = suggestions.dining
            .slice(0, 3)
            .map(dish => `<div class="cuisine-item">${dish}</div>`)
            .join('');

        this.elements.cuisine.innerHTML = cuisineHTML || '<p>Explore local cuisine</p>';
    }

    displayWarnings(suggestions) {
        if (!this.elements.dangers) return;

        const warningsHTML = suggestions.warnings
            .map(warning => `<div class="warning-item">${warning}</div>`)
            .join('');

        this.elements.dangers.innerHTML = warningsHTML || '<p>No weather warnings</p>';
    }

    displayAdvantages(suggestions) {
        if (!this.elements.advantages) return;

        const advantagesHTML = suggestions.advantages
            .map(adv => `<div class="advantage-item">${adv}</div>`)
            .join('');

        this.elements.advantages.innerHTML = advantagesHTML || '<p>Great day ahead!</p>';
    }

    displayForecast(weather) {
        if (!this.elements.forecast) return;

        if (!weather.forecast || weather.forecast.length === 0) {
            this.elements.forecast.innerHTML = '<p>Forecast data not available</p>';
            return;
        }

        const forecastHTML = weather.forecast
            .map(day => `
                <div class="forecast-day">
                    <div class="forecast-day-name">${day.dayName}</div>
                    <div class="forecast-graph">
                        <div class="forecast-bar max" style="height: ${Math.max(18, Math.min(100, day.temp_max * 2))}%;"></div>
                        <div class="forecast-bar min" style="height: ${Math.max(12, Math.min(100, day.temp_min * 2))}%;"></div>
                    </div>
                    <div class="forecast-temps">${day.temp_max}° / ${day.temp_min}°</div>
                    <div class="forecast-condition-text">${day.emoji} ${day.condition}</div>
                </div>
            `)
            .join('');

        this.elements.forecast.innerHTML = forecastHTML;
    }

    getWeatherNarrative(weather) {
        if (!weather || !weather.current) return 'Weather insights for today are loading.';

        const temp = weather.current.temperature;
        const condition = weather.current.condition.toLowerCase();
        const humidity = weather.current.humidity;
        const wind = weather.current.windSpeed;
        const modifiers = [];

        if (temp >= 28) modifiers.push('warm and luminous');
        else if (temp >= 20) modifiers.push('pleasant and easygoing');
        else if (temp >= 10) modifiers.push('cool and fresh');
        else modifiers.push('brisk and crisp');

        if (condition.includes('rain') || condition.includes('storm')) modifiers.push('umbrella-ready');
        if (humidity > 70) modifiers.push('humid');
        if (wind > 20) modifiers.push('windy');

        return `A ${modifiers.join(', ')} day with ${condition}, ${humidity}% humidity and ${wind} km/h wind.`;
    }
        if (results.length === 0) {
            return this.showNotification('No African countries found', 'info');
        }

        // Optionally show search results in a dropdown or similar
        console.log('Search results:', results);
    }

    showLoadingState() {
        if (!this.elements.weatherContent) return;
        
        this.elements.weatherContent.innerHTML = `
            <div class="loading-spinner">
                <div class="spinner"></div>
                <p>Fetching weather data...</p>
            </div>
        `;
    }

    showErrorState(message = 'Failed to load weather data') {
        if (!this.elements.weatherContent) return;
        
        this.elements.weatherContent.innerHTML = `
            <div class="error-message">
                <p>⚠️ ${message}</p>
                <p>Please try again or select another country.</p>
            </div>
        `;
    }

    showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 1000;
            padding: 12px 20px;
            border-radius: 8px;
            backdrop-filter: blur(10px);
            animation: slideIn 0.3s ease-out;
        `;

        if (type === 'success') {
            notification.style.background = 'rgba(45, 212, 191, 0.2)';
            notification.style.borderLeft = '4px solid #2DD4BF';
            notification.style.color = '#2DD4BF';
        } else if (type === 'error') {
            notification.style.background = 'rgba(255, 71, 87, 0.2)';
            notification.style.borderLeft = '4px solid #FF4757';
            notification.style.color = '#FF4757';
        } else {
            notification.style.background = 'rgba(255, 165, 2, 0.2)';
            notification.style.borderLeft = '4px solid #FFA502';
            notification.style.color = '#FFA502';
        }

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-out';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    getStarRating(rating) {
        const fullStars = Math.floor(rating);
        const halfStar = rating % 1 >= 0.5 ? 1 : 0;
        const emptyStars = 5 - fullStars - halfStar;

        return '⭐'.repeat(fullStars) + (halfStar ? '✨' : '') + '☆'.repeat(emptyStars);
    }

    // Callback handlers
    onCountrySearch(event) {
        const query = event.target.value;
        if (query.length > 0) {
            const results = searchCountries(query);
            this.displaySearchResults(results);
            // Here you could show a dropdown with results
        }
    }

    handleSearchSubmit(event) {
        const query = this.elements.countrySearch.value;
        if (query.length > 0) {
            const results = searchCountries(query);
            if (results.length > 0) {
                window.appManager.loadWeather(results[0].key, results[0].name);
            } else {
                this.showNotification('Country not found in African database', 'error');
            }
        }
    }

    onUseLocationClick() {
        this.elements.useLocationBtn.disabled = true;
        this.elements.useLocationBtn.textContent = '📍 Locating...';
        
        weatherAPI.getCountryByGeolocation()
            .then(coords => {
                window.appManager.loadWeatherByCoordinates(coords.lat, coords.lng);
            })
            .catch(error => {
                console.error('Geolocation error:', error);
                this.showNotification('Could not access your location', 'error');
            })
            .finally(() => {
                this.elements.useLocationBtn.disabled = false;
                this.elements.useLocationBtn.textContent = '📍 Use Location';
            });
    }
}

// Create UI manager instance
const uiManager = new UIManager();
