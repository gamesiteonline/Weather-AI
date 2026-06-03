/* ============================================
   AI Suggestions Engine
   Weather-based recommendations using rules engine
   ============================================ */

class AISuggestions {
    constructor() {
        this.weatherRules = this.initializeRules();
    }

    initializeRules() {
        return {
            temperature: {
                hot: { min: 28, suggestions: ['Drink plenty of water', 'Use sunscreen (SPF 30+)', 'Wear light clothing', 'Stay hydrated', 'Seek shade regularly'] },
                warm: { min: 20, max: 28, suggestions: ['Perfect outdoor weather', 'Great for outdoor activities', 'Light jacket recommended', 'Ideal for exploring', 'Plan outdoor adventures'] },
                cool: { min: 10, max: 20, suggestions: ['Bring a light jacket', 'Good for hiking', 'Comfortable walking weather', 'Perfect for sightseeing', 'Layer your clothing'] },
                cold: { max: 10, suggestions: ['Wear warm clothing', 'Stay indoors if possible', 'Hot beverages recommended', 'Bundle up well', 'Avoid prolonged exposure'] }
            },
            humidity: {
                high: { min: 70, suggestions: ['High humidity detected', 'Stay cool and hydrated', 'Wear moisture-wicking clothes', 'Take frequent breaks', 'Use umbrella (rain possible)'] },
                moderate: { min: 40, max: 70, suggestions: ['Comfortable humidity levels', 'Good conditions for activity', 'Minimal moisture discomfort', 'Ideal for outdoor plans', 'Enjoy the weather'] },
                low: { max: 40, suggestions: ['Dry conditions', 'Apply lip balm and lotion', 'Increase water intake', 'Use moisturizer', 'Protect from sun exposure'] }
            },
            windSpeed: {
                calm: { max: 5, suggestions: ['Calm winds', 'Perfect for all activities', 'Great visibility', 'Ideal for photos', 'Safe conditions'] },
                light: { min: 5, max: 15, suggestions: ['Light breeze', 'Good for kite flying', 'Enjoyable conditions', 'Air circulation good', 'Comfortable outdoor time'] },
                moderate: { min: 15, max: 30, suggestions: ['Moderate winds', 'Hold onto light items', 'Watch for loose objects', 'Secure belongings', 'Be cautious outdoors'] },
                strong: { min: 30, suggestions: ['Strong winds detected', 'Stay indoors if possible', 'Secure all loose items', 'Avoid tall structures', 'Exercise caution'] }
            },
            precipitation: {
                dry: { max: 0, suggestions: ['No rain expected', 'Great day for outdoor activities', 'Perfect for photography', 'Enjoy the sunshine', 'Ideal travel conditions'] },
                light: { min: 0, max: 5, suggestions: ['Light rain possible', 'Bring an umbrella', 'Plan indoor activities too', 'Roads may be slippery', 'Be cautious while driving'] },
                moderate: { min: 5, max: 20, suggestions: ['Moderate rain expected', 'Definitely bring umbrella', 'Indoor activities recommended', 'Traffic may be heavy', 'Stay safe on roads'] },
                heavy: { min: 20, suggestions: ['Heavy rain/storm expected', 'Avoid outdoor activities', 'Stay indoors', 'Severe weather warning', 'Monitor weather updates'] }
            }
        };
    }

    generateSuggestions(weather, country) {
        const suggestions = {
            immediate: [],
            activities: [],
            dining: [],
            warnings: [],
            advantages: [],
            dos: [],
            donts: [],
            events: [],
            overallRating: 0,
            summary: ''
        };

        if (!weather || !weather.current) {
            return suggestions;
        }

        const temp = weather.current.temperature;
        const humidity = weather.current.humidity;
        const wind = weather.current.windSpeed;
        const precip = weather.current.precipitation;

        // Temperature suggestions
        const tempSuggestions = this.getTemperatureSuggestions(temp);
        suggestions.immediate.push(...tempSuggestions);

        // Humidity suggestions
        const humiditySuggestions = this.getHumiditySuggestions(humidity);
        suggestions.immediate.push(...humiditySuggestions);

        // Wind suggestions
        const windSuggestions = this.getWindSuggestions(wind);
        suggestions.immediate.push(...windSuggestions);

        // Precipitation suggestions
        const precipSuggestions = this.getPrecipitationSuggestions(precip, weather.current.condition);
        suggestions.warnings.push(...precipSuggestions.warnings);
        suggestions.advantages.push(...precipSuggestions.advantages);

        // Activities based on conditions
        suggestions.activities = this.suggestActivities(weather, country);

        // Dining suggestions based on weather and country
        suggestions.dining = this.suggestDining(weather, country);

        suggestions.dos = this.generateDoList(weather);
        suggestions.donts = this.generateDontList(weather);
        suggestions.events = this.suggestEvents(weather, country);
        suggestions.summary = this.createWeatherSummary(weather, country);

        // Calculate overall weather rating (0-10)
        suggestions.overallRating = this.calculateWeatherRating(temp, humidity, wind, precip);

        return suggestions;
    }

    getTemperatureSuggestions(temp) {
        const suggestions = [];
        if (temp > 28) {
            suggestions.push('🌡️ Hot and warm: Drink 3+ liters of water', '☀️ Apply SPF 40+ sunscreen', '👕 Wear loose, light-colored clothing');
        } else if (temp > 20) {
            suggestions.push('😊 Comfortable temperature', '👟 Perfect for outdoor activities', '🎒 Ideal for exploring');
        } else if (temp > 10) {
            suggestions.push('🧥 Bring a light jacket', '🥾 Good hiking conditions', '📸 Great visibility');
        } else {
            suggestions.push('🥶 Very cold - bundle up!', '☕ Stay warm indoors', '🏠 Minimal outdoor time');
        }
        return suggestions;
    }

    getHumiditySuggestions(humidity) {
        const suggestions = [];
        if (humidity > 70) {
            suggestions.push('💧 High humidity: Expect discomfort', '👕 Wear moisture-wicking clothes', '⏸️ Take frequent breaks');
        } else if (humidity > 40) {
            suggestions.push('✨ Comfortable humidity levels', '😄 Perfect for outdoor time', '🌬️ Good air circulation');
        } else {
            suggestions.push('🏜️ Very dry conditions', '💧 Increase water intake', '🧴 Use moisturizer regularly');
        }
        return suggestions;
    }

    getWindSuggestions(windSpeed) {
        const suggestions = [];
        if (windSpeed > 30) {
            suggestions.push('⚠️ Strong winds: Stay indoors', '🔒 Secure all loose items', '⚡ Avoid tall structures');
        } else if (windSpeed > 15) {
            suggestions.push('🌬️ Moderate winds detected', '🧣 Hold onto belongings', '⚠️ Be cautious outdoors');
        } else if (windSpeed > 5) {
            suggestions.push('🪁 Light breeze', '😊 Enjoy the fresh air', '🎯 Great for kite flying');
        } else {
            suggestions.push('🌅 Calm conditions', '📸 Perfect for photos', '🚴 Great visibility');
        }
        return suggestions;
    }

    getPrecipitationSuggestions(precip, condition) {
        const result = { warnings: [], advantages: [] };
        
        if (precip > 20 || condition.includes('Thunder') || condition.includes('Storm')) {
            result.warnings.push('⛈️ Heavy rain/storm warning', '🏠 Stay indoors', '🚗 Avoid driving');
        } else if (precip > 5 || condition.includes('Rain')) {
            result.warnings.push('🌧️ Rain expected', '☔ Bring umbrella', '🌳 Slippery surfaces');
        } else {
            result.advantages.push('☀️ Clear skies ahead', '🌈 No rain expected', '🎉 Perfect day');
        }
        
        return result;
    }

    suggestActivities(weather, country) {
        const activities = [];
        const temp = weather.current.temperature;
        const condition = weather.current.condition;
        const windSpeed = weather.current.windSpeed;
        const precip = weather.current.precipitation;

        const countryActivities = AFRICAN_COUNTRIES[country?.toLowerCase()] || { activities: [] };

        // Recommend based on conditions
        if (temp > 25 && precip < 5 && windSpeed < 20) {
            activities.push('🏖️ Beach Day', '🚴 Cycling Adventure', '⛺ Outdoor Picnic');
        }
        if (temp > 20 && precip < 5) {
            activities.push('🥾 Hiking', '📸 Photography', '🎭 Cultural Tours');
        }
        if (precip > 5) {
            activities.push('🏛️ Museum Visit', '🍽️ Dining Experience', '🎬 Movie Time');
        }
        if (temp < 20) {
            activities.push('☕ Café Hopping', '🛍️ Shopping', '🎨 Art Galleries');
        }

        // Add country-specific activities
        if (countryActivities.activities && countryActivities.activities.length > 0) {
            activities.push(...countryActivities.activities.slice(0, 3));
        }

        return activities.slice(0, 6);
    }

    suggestDining(weather, country) {
        const suggestions = [];
        const temp = weather.current.temperature;
        const countryData = AFRICAN_COUNTRIES[country?.toLowerCase()] || { cuisine: [] };

        // Temperature-based dining
        if (temp > 28) {
            suggestions.push('🍹 Cold beverages', '🍦 Ice cream treats', '🥤 Fresh juices');
        } else if (temp < 15) {
            suggestions.push('☕ Hot tea or coffee', '🍲 Warm stews', '🥣 Hearty meals');
        } else {
            suggestions.push('🍜 Local specialties', '🥗 Fresh salads', '🍴 Traditional dishes');
        }

        // Add country-specific cuisine
        if (countryData.cuisine && countryData.cuisine.length > 0) {
            suggestions.push(...countryData.cuisine.slice(0, 2).map(dish => `🍽️ ${dish}`));
        }

        return suggestions;
    }

    generateDoList(weather) {
        const dos = [];
        const temp = weather.current.temperature;
        const precip = weather.current.precipitation;
        const condition = weather.current.condition.toLowerCase();

        if (temp >= 25 && precip < 50) {
            dos.push('🌞 Enjoy outdoor sightseeing', '🚶 Explore local markets');
        }
        if (precip < 30 && !condition.includes('storm')) {
            dos.push('📸 Capture photos of the landscape', '🌅 Plan a sunrise or sunset walk');
        }
        if (condition.includes('rain') || condition.includes('storm')) {
            dos.push('🏛️ Visit an indoor cultural site', '☕ Try a local café or brewery');
        }

        return dos.slice(0, 4);
    }

    generateDontList(weather) {
        const donts = [];
        const temp = weather.current.temperature;
        const precip = weather.current.precipitation;
        const condition = weather.current.condition.toLowerCase();

        if (precip > 60 || condition.includes('storm')) {
            donts.push('☔ Don’t go hiking in heavy rain', '🚫 Avoid rivers and exposed paths');
        }
        if (temp >= 33) {
            donts.push('🥵 Don’t stay in direct sun too long', '💧 Avoid skipping hydration breaks');
        }
        if (weather.current.windSpeed > 25) {
            donts.push('🪁 Don’t leave belongings unsecured outdoors', '🏞️ Avoid cliffside viewpoints in strong wind');
        }

        return donts.slice(0, 4);
    }

    suggestEvents(weather, country) {
        const events = [];
        const condition = weather.current.condition.toLowerCase();
        const temp = weather.current.temperature;

        if (condition.includes('rain') || condition.includes('storm')) {
            events.push('Indoor cooking class', 'Museum exploration', 'Local gallery visit');
        } else {
            events.push('Sunset outdoor market', 'Safari walk', 'Beach or park stroll');
        }

        if (temp >= 28) {
            events.push('Evening festival or street food crawl');
        }

        const countryData = AFRICAN_COUNTRIES[country?.toLowerCase()];
        if (countryData?.activities) {
            events.push(countryData.activities[0]);
        }

        return events.slice(0, 4);
    }

    createWeatherSummary(weather, country) {
        const location = (country && AFRICAN_COUNTRIES[country.toLowerCase()]?.name) || weather.country || 'your location';
        const temp = weather.current.temperature;
        const humidity = weather.current.humidity;
        const rating = weather.rating || this.calculateWeatherRating(temp, humidity, weather.current.windSpeed, weather.current.precipitation);
        const mood = rating >= 8 ? 'very favorable' : rating >= 5 ? 'balanced and manageable' : 'challenging';

        return `In ${location}, expect ${weather.current.condition.toLowerCase()} skies with ${temp}°C, ${humidity}% humidity, and ${weather.current.windSpeed} km/h wind. This day feels ${mood}.`;
    }

    calculateWeatherRating(temp, humidity, wind, precip) {
        let rating = 10;

        // Deduct points based on conditions
        if (temp > 35 || temp < 0) rating -= 3;
        else if (temp > 28 || temp < 10) rating -= 2;
        else if (temp > 25 || temp < 15) rating -= 1;

        if (humidity > 80) rating -= 2;
        else if (humidity > 70) rating -= 1;

        if (wind > 25) rating -= 3;
        else if (wind > 15) rating -= 1;

        if (precip > 60) rating -= 4;
        else if (precip > 30) rating -= 2;
        else if (precip > 10) rating -= 1;

        return Math.max(1, rating);
    }
}

// Export AI Suggestions
const aiSuggestions = new AISuggestions();
