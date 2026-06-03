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

            const openMeteoData = await response.json();
            const [openWeatherData, stormglassData] = await Promise.all([
                this.getOpenWeatherData(lat, lng),
                this.getStormGlassData(lat, lng)
            ]);

            const processedData = this.processWeatherData(openMeteoData, countryName, openWeatherData, stormglassData);
            
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

    async getOpenWeatherData(lat, lng) {
        const apiKey = window.CONFIG?.OPENWEATHER_API_KEY;
        if (!apiKey) return null;

        try {
            const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${apiKey}&units=metric`;
            const response = await fetch(url);
            if (!response.ok) return null;
            return await response.json();
        } catch (error) {
            console.warn('OpenWeather request failed:', error);
            return null;
        }
    }

    async getStormGlassData(lat, lng) {
        const apiKey = window.CONFIG?.STORMGLASS_API_KEY;
        if (!apiKey) return null;

        try {
            const now = Math.floor(Date.now() / 1000);
            const start = now;
            const end = now + 24 * 3600;
            const url = `https://api.stormglass.io/v2/weather/point?lat=${lat}&lng=${lng}&params=airTemperature,humidity,windSpeed,precipitation&start=${start}&end=${end}`;
            const response = await fetch(url, {
                headers: {
                    Authorization: apiKey
                }
            });
            if (!response.ok) return null;
            return await response.json();
        } catch (error) {
            console.warn('StormGlass request failed:', error);
            return null;
        }
    }

    getStormglassParam(hour, param) {
        if (!hour || !hour[param]) return null;
        const value = hour[param];
        return value.noaa ?? value.sg ?? value.met ?? value.metno ?? null;
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

    processWeatherData(data, countryName = '', openWeatherData = null, stormglassData = null) {
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
        const openWeatherHumidity = openWeatherData?.main?.humidity;
        const openWeatherWind = openWeatherData?.wind?.speed ? Math.round(openWeatherData.wind.speed * 3.6) : null;
        const stormglassHour = stormglassData?.hours?.[0] || {};
        const stormglassHumidity = this.getStormglassParam(stormglassHour, 'humidity');
        const stormglassWind = this.getStormglassParam(stormglassHour, 'windSpeed');

        const humidity = openWeatherHumidity ?? stormglassHumidity ?? (hourly.relativehumidity_2m && currentIndex >= 0 ? hourly.relativehumidity_2m[currentIndex] : 0);
        const precipitationProbability = openWeatherData?.rain?.['1h'] ?? (hourly.precipitation_probability && currentIndex >= 0 ? hourly.precipitation_probability[currentIndex] : 0);
        const weatherCode = current.weathercode || (hourly.weathercode && hourly.weathercode[currentIndex]) || 0;
        const weather = getWeatherDescription(weatherCode);
        const condition = openWeatherData?.weather?.[0]?.description ? this.capitalizeText(openWeatherData.weather[0].description) : weather.desc;
        const windSpeed = openWeatherWind ?? stormglassWind ?? Math.round(current.windspeed || 0);

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
                    precipitation: Math.round(daily.precipitation_sum?.[index] || 0),
                    windSpeed: Math.round(daily.wind_speed_10m_max?.[index] || 0)
                };
            });
        };

        const sunrise = openWeatherData?.sys?.sunrise ? new Date(openWeatherData.sys.sunrise * 1000).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }) : '';
        const sunset = openWeatherData?.sys?.sunset ? new Date(openWeatherData.sys.sunset * 1000).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }) : '';

        return {
            country: countryName,
            current: {
                temperature: Math.round(current.temperature || 0),
                apparentTemperature: Math.round(current.temperature || 0),
                condition,
                emoji: weather.emoji,
                humidity,
                windSpeed,
                windDirection: current.winddirection || 0,
                precipitation: precipitationProbability,
                precipitationProbability,
                sunrise,
                sunset
            },
            forecast: formatForecast(),
            timezone: data.timezone,
            provider: 'Open-Meteo + OpenWeather + StormGlass'
        };
    }

    capitalizeText(text) {
        if (!text) return '';
        return text.charAt(0).toUpperCase() + text.slice(1);
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
var weatherAPI = window.weatherAPI = new WeatherAPI();
window.WeatherAPI = WeatherAPI;
