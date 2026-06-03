/* ============================================
   Weather API Integration
   Open-Meteo API (Free, No Auth Required)
   ============================================ */

class WeatherAPI {
    constructor() {
        // Using Open-Meteo API - free weather data for African countries
        this.baseURL = 'https://api.open-meteo.com/v1/forecast';
        this.geocodingURL = 'https://geocoding-api.open-meteo.com/v1/search';
        this.cache = new Map();
        this.cacheExpiry = 15 * 60 * 1000; // 15 minutes
    }

    async getWeatherByCoordinates(lat, lng, countryName = '') {
        const cacheKey = `${lat},${lng}`;
        
        // Check cache
        if (this.cache.has(cacheKey)) {
            const cached = this.cache.get(cacheKey);
            if (Date.now() - cached.timestamp < this.cacheExpiry) {
                return cached.data;
            }
        }

        try {
            const params = new URLSearchParams({
                latitude: lat,
                longitude: lng,
                current_weather: 'true',
                hourly: 'relativehumidity_2m,precipitation_probability,weathercode',
                daily: 'weathercode,temperature_2m_max,temperature_2m_min,precipitation_sum,wind_speed_10m_max',
                timezone: 'auto',
                forecast_days: 7
            });

            const response = await fetch(`${this.baseURL}?${params}`);
            if (!response.ok) throw new Error('Weather API request failed');
            
            const data = await response.json();
            const processedData = this.processWeatherData(data, countryName);
            
            // Cache the result
            this.cache.set(cacheKey, {
                data: processedData,
                timestamp: Date.now()
            });

            return processedData;
        } catch (error) {
            console.error('Error fetching weather:', error);
            return this.getDefaultWeather();
        }
    }

    async getCountryByGeolocation() {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                reject(new Error('Geolocation not supported'));
                return;
            }

            navigator.geolocation.getCurrentPosition(
                (position) => {
                    resolve({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    });
                },
                (error) => {
                    console.error('Geolocation error:', error);
                    reject(error);
                }
            );
        });
    }

    async searchCountryByCoordinates(lat, lng) {
        try {
            const params = new URLSearchParams({
                lat: lat,
                lon: lng,
                format: 'json',
                addressdetails: 1,
                zoom: 5
            });

            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?${params}`
            );
            const data = await response.json();
            
            // Try to match with African countries
            const address = data.address || {};
            const country = address.country_code ? address.country_code.toUpperCase() : '';
            
            return {
                country: address.country || 'Unknown',
                countryCode: country,
                city: address.city || address.town || 'Unknown'
            };
        } catch (error) {
            console.error('Error searching country:', error);
            return null;
        }
    }

    processWeatherData(data, countryName = '') {
        const current = data.current_weather || {};
        const daily = data.daily || {};
        const hourly = data.hourly || {};

        const getWeatherDescription = (code) => {
            const weatherCodes = {
                0: { desc: 'Clear', emoji: '☀️' },
                1: { desc: 'Partly Cloudy', emoji: '⛅' },
                2: { desc: 'Overcast', emoji: '☁️' },
                3: { desc: 'Cloudy', emoji: '☁️' },
                45: { desc: 'Foggy', emoji: '🌫️' },
                48: { desc: 'Foggy', emoji: '🌫️' },
                51: { desc: 'Light Drizzle', emoji: '🌧️' },
                53: { desc: 'Drizzle', emoji: '🌧️' },
                61: { desc: 'Light Rain', emoji: '🌧️' },
                63: { desc: 'Moderate Rain', emoji: '🌧️' },
                65: { desc: 'Heavy Rain', emoji: '⛈️' },
                71: { desc: 'Light Snow', emoji: '❄️' },
                73: { desc: 'Snow', emoji: '❄️' },
                75: { desc: 'Heavy Snow', emoji: '❄️' },
                77: { desc: 'Snow Grains', emoji: '❄️' },
                80: { desc: 'Light Rain Showers', emoji: '🌧️' },
                81: { desc: 'Rain Showers', emoji: '⛈️' },
                82: { desc: 'Heavy Rain Showers', emoji: '⛈️' },
                85: { desc: 'Snow Showers', emoji: '❄️' },
                86: { desc: 'Heavy Snow Showers', emoji: '❄️' },
                95: { desc: 'Thunderstorm', emoji: '⚡' },
                96: { desc: 'Hail Storm', emoji: '⛈️' },
                99: { desc: 'Severe Thunderstorm', emoji: '⚡' }
            };
            return weatherCodes[code] || { desc: 'Unknown', emoji: '🌡️' };
        };

        const currentTime = current.time || (hourly.time && hourly.time[0]) || '';
        const currentIndex = hourly.time ? hourly.time.indexOf(currentTime) : 0;
        const humidity = hourly.relativehumidity_2m && currentIndex >= 0 ? hourly.relativehumidity_2m[currentIndex] : 0;
        const precipitationProbability = hourly.precipitation_probability && currentIndex >= 0 ? hourly.precipitation_probability[currentIndex] : 0;
        const weatherCode = current.weathercode || (hourly.weathercode && hourly.weathercode[currentIndex]) || 0;
        const weather = getWeatherDescription(weatherCode);

        const formatForecast = () => {
            if (!Array.isArray(daily.time)) return [];
            return daily.time.map((date, index) => {
                const weatherDay = getWeatherDescription(daily.weathercode?.[index] || 0);
                return {
                    date: new Date(date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
                    dayName: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
                    temp_max: Math.round(daily.temperature_2m_max[index] || 0),
                    temp_min: Math.round(daily.temperature_2m_min[index] || 0),
                    condition: weatherDay.desc,
                    emoji: weatherDay.emoji,
                    precipitation: daily.precipitation_sum?.[index] || 0,
                    windSpeed: Math.round(daily.wind_speed_10m_max?.[index] || 0)
                };
            });
        };

        return {
            country: countryName,
            current: {
                temperature: Math.round(current.temperature || 0),
                apparentTemperature: Math.round(current.temperature || 0),
                condition: weather.desc,
                emoji: weather.emoji,
                humidity,
                windSpeed: Math.round(current.windspeed || 0),
                windDirection: current.winddirection || 0,
                precipitation: precipitationProbability,
                precipitationProbability
            },
            forecast: formatForecast(),
            timezone: data.timezone
        };
    }

    getDefaultWeather() {
        return {
            country: 'Select a Country',
            current: {
                temperature: '--',
                apparentTemperature: '--',
                condition: 'Loading...',
                emoji: '⏳',
                humidity: 0,
                windSpeed: 0,
                windDirection: 0,
                precipitation: 0
            },
            forecast: []
        };
    }
}

// Export weather API
const weatherAPI = new WeatherAPI();
