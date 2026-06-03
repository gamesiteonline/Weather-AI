// AFRICA WEATHER AI - Main Application Script
// Developer: Fahad Mohamed from Tanzania

// ============ CONFIGURATION & CONSTANTS ============

const WEATHER_API_KEY = 'demo'; // Replace with actual API key from openweathermap.org
const WEATHER_API_BASE = 'https://api.openweathermap.org/data/2.5';

const AFRICAN_COUNTRIES = {
    'KE': 'Kenya', 'ET': 'Ethiopia', 'UG': 'Uganda', 'TZ': 'Tanzania', 'ZA': 'South Africa',
    'NG': 'Nigeria', 'GH': 'Ghana', 'SN': 'Senegal', 'MA': 'Morocco', 'TN': 'Tunisia',
    'EG': 'Egypt', 'SD': 'Sudan', 'CD': 'Democratic Republic of Congo', 'AO': 'Angola',
    'MZ': 'Mozambique', 'ZM': 'Zambia', 'ZW': 'Zimbabwe', 'BW': 'Botswana', 'NA': 'Namibia',
    'MW': 'Malawi', 'RW': 'Rwanda', 'BJ': 'Benin', 'BF': 'Burkina Faso', 'CI': 'Ivory Coast',
    'CM': 'Cameroon', 'GA': 'Gabon', 'CF': 'Central African Republic', 'CG': 'Republic of Congo',
    'GN': 'Guinea', 'ML': 'Mali', 'NE': 'Niger', 'SC': 'Seychelles', 'MU': 'Mauritius',
    'SL': 'Sierra Leone', 'LR': 'Liberia', 'LY': 'Libya', 'DJ': 'Djibouti', 'ER': 'Eritrea',
    'SO': 'Somalia', 'MG': 'Madagascar', 'CV': 'Cape Verde', 'ST': 'São Tomé and Príncipe'
};

// ============ THREE.JS SCENE SETUP ============

let scene, camera, renderer;
let particles = [];

function initThreeJS() {
    const container = document.getElementById('canvasContainer');
    
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);
    
    camera.position.z = 5;
    
    createParticleSystem();
    animate();
    
    window.addEventListener('resize', onWindowResize);
}

function createParticleSystem() {
    const geometry = new THREE.BufferGeometry();
    const count = 100;
    const posArray = new Float32Array(count * 3);
    
    for (let i = 0; i < count * 3; i += 3) {
        posArray[i] = (Math.random() - 0.5) * 10;
        posArray[i + 1] = (Math.random() - 0.5) * 10;
        posArray[i + 2] = (Math.random() - 0.5) * 10;
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    
    const material = new THREE.PointsMaterial({
        size: 0.05,
        color: 0xffffff,
        transparent: true,
        opacity: 0.5
    });
    
    const points = new THREE.Points(geometry, material);
    scene.add(points);
}

function animate() {
    requestAnimationFrame(animate);
    
    if (scene.children[0]) {
        scene.children[0].rotation.x += 0.0001;
        scene.children[0].rotation.y += 0.0001;
    }
    
    renderer.render(scene, camera);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// ============ WEATHER API FUNCTIONS ============

async function fetchWeatherData(lat, lon, country) {
    try {
        // For demo: using mock data
        return getMockWeatherData(country);
    } catch (error) {
        console.error('Error fetching weather:', error);
        throw error;
    }
}

function getMockWeatherData(country) {
    const weatherData = {
        'Kenya': {
            temp: 24, feels_like: 22, humidity: 65, wind_speed: 8,
            description: 'Partly Cloudy', pressure: 1013, visibility: 10,
            uv_index: 8, air_quality: 2, sunrise: '06:15', sunset: '18:30'
        },
        'Tanzania': {
            temp: 26, feels_like: 25, humidity: 70, wind_speed: 6,
            description: 'Sunny', pressure: 1015, visibility: 12,
            uv_index: 9, air_quality: 1, sunrise: '06:30', sunset: '18:45'
        },
        'Nigeria': {
            temp: 28, feels_like: 30, humidity: 80, wind_speed: 12,
            description: 'Humid with Thunderstorms', pressure: 1010, visibility: 5,
            uv_index: 10, air_quality: 3, sunrise: '05:45', sunset: '18:15'
        },
        'South Africa': {
            temp: 22, feels_like: 20, humidity: 55, wind_speed: 15,
            description: 'Windy and Clear', pressure: 1018, visibility: 15,
            uv_index: 7, air_quality: 1, sunrise: '05:30', sunset: '19:00'
        },
        'Egypt': {
            temp: 35, feels_like: 38, humidity: 30, wind_speed: 20,
            description: 'Hot and Dry', pressure: 1005, visibility: 8,
            uv_index: 11, air_quality: 4, sunrise: '05:15', sunset: '19:30'
        }
    };
    
    return weatherData[country] || weatherData['Tanzania'];
}

// ============ AI SUGGESTIONS ENGINE ============

function generateAISuggestions(weatherData, country) {
    const temp = weatherData.temp;
    const humidity = weatherData.humidity;
    const windSpeed = weatherData.wind_speed;
    const description = weatherData.description.toLowerCase();
    
    const suggestions = {
        events: [],
        activities: [],
        food: [],
        dangers: [],
        advantages: [],
        todo: [],
        avoid: [],
        predictions: []
    };
    
    // Temperature-based suggestions
    if (temp > 28) {
        suggestions.events.push('Water festivals and beach events');
        suggestions.events.push('Outdoor concerts in shaded venues');
        suggestions.activities.push('Swimming and water sports');
        suggestions.activities.push('Sunrise hikes (early morning)');
        suggestions.food.push('Fresh tropical fruits and smoothies');
        suggestions.food.push('Ice cream and cold beverages');
        suggestions.dangers.push('Heat stroke and dehydration');
        suggestions.dangers.push('Sunburn without proper protection');
        suggestions.todo.push('Drink plenty of water regularly');
        suggestions.todo.push('Wear high SPF sunscreen (50+)');
        suggestions.todo.push('Wear light, breathable clothing');
        suggestions.avoid.push('Intense outdoor activities midday');
        suggestions.avoid.push('Dark clothing in bright sun');
        suggestions.predictions.push('Expect increased AC usage');
        suggestions.predictions.push('May experience afternoon heat fatigue');
    } else if (temp < 15) {
        suggestions.events.push('Indoor cultural festivals');
        suggestions.events.push('Coffee and tea ceremonies');
        suggestions.activities.push('Mountain hiking');
        suggestions.activities.push('Photography walks');
        suggestions.food.push('Hot soups and stews');
        suggestions.food.push('Grilled and warming dishes');
        suggestions.dangers.push('Cold-related illnesses');
        suggestions.dangers.push('Slippery surfaces from frost');
        suggestions.todo.push('Wear warm layers and jackets');
        suggestions.todo.push('Stay hydrated despite cold');
        suggestions.avoid.push('Early morning outdoor exercise');
        suggestions.avoid.push('Thin clothing in wind');
        suggestions.predictions.push('Expect higher heating costs');
        suggestions.predictions.push('May experience morning congestion');
    } else {
        suggestions.events.push('Outdoor festivals and fairs');
        suggestions.events.push('Community gatherings');
        suggestions.activities.push('Trekking and nature walks');
        suggestions.activities.push('Outdoor games and sports');
        suggestions.food.push('Balanced meals with fresh produce');
        suggestions.food.push('Local grains and vegetables');
    }
    
    // Humidity-based suggestions
    if (humidity > 75) {
        suggestions.dangers.push('Increased mosquito breeding');
        suggestions.dangers.push('Mold and fungal growth');
        suggestions.todo.push('Check screens and windows for insects');
        suggestions.predictions.push('May feel more uncomfortable temperature');
    }
    
    // Wind-based suggestions
    if (windSpeed > 15) {
        suggestions.dangers.push('Dust storms and poor air quality');
        suggestions.activities.push('Kite flying and windsports');
        suggestions.todo.push('Secure loose outdoor items');
        suggestions.avoid.push('Activities near water bodies');
    }
    
    // Weather description-based
    if (description.includes('rain') || description.includes('storm')) {
        suggestions.events.push('Indoor cultural performances');
        suggestions.activities.push('Museum visits and indoor activities');
        suggestions.food.push('Hot comfort meals');
        suggestions.dangers.push('Flooding in low-lying areas');
        suggestions.todo.push('Check drainage around property');
        suggestions.avoid.push('Driving in heavy rain');
        suggestions.predictions.push('Expect reduced visibility');
    }
    
    // Add advantages
    suggestions.advantages.push('Rich biodiversity opportunities');
    suggestions.advantages.push('Agricultural productivity season');
    suggestions.advantages.push('Tourism and travel season potential');
    
    return suggestions;
}

// ============ UI RENDERING FUNCTIONS ============

function renderWeatherCard(data, country) {
    document.getElementById('loadingSpinner').style.display = 'none';
    document.getElementById('heroCard').style.display = 'flex';
    document.getElementById('bentoGrid').style.display = 'grid';
    document.getElementById('forecastSection').style.display = 'block';
    
    document.getElementById('cityName').textContent = country;
    document.getElementById('countryName').textContent = 'African Weather Station';
    document.getElementById('temperature').textContent = Math.round(data.temp);
    document.getElementById('feelsLike').textContent = Math.round(data.feels_like);
    document.getElementById('weatherDescription').textContent = data.description;
    
    // Update details
    document.getElementById('humidity').textContent = `${data.humidity}%`;
    document.getElementById('windSpeed').textContent = `${data.wind_speed} km/h`;
    document.getElementById('pressure').textContent = `${data.pressure} mb`;
    document.getElementById('visibility').textContent = `${data.visibility} km`;
    
    // UV Index
    const uvIndex = data.uv_index;
    document.getElementById('uvIndex').textContent = uvIndex;
    const uvLabels = ['Low', 'Low', 'Moderate', 'High', 'Very High', 'Extreme'];
    document.getElementById('uvLabel').textContent = uvLabels[Math.min(uvIndex, 5)];
    
    // Air Quality
    const aqIndex = data.air_quality;
    document.getElementById('aqIndex').textContent = aqIndex;
    const aqLabels = ['Excellent', 'Good', 'Moderate', 'Poor', 'Very Poor'];
    document.getElementById('aqStatus').textContent = aqLabels[Math.min(aqIndex, 4)];
    
    // Sun times
    document.getElementById('sunrise').textContent = data.sunrise;
    document.getElementById('sunset').textContent = data.sunset;
    
    // Weather icon
    updateWeatherIcon(data.description);
    
    // Render chart
    renderWeatherChart();
}

function updateWeatherIcon(description) {
    const iconMap = {
        'sunny': 'fas fa-sun',
        'clear': 'fas fa-sun',
        'cloudy': 'fas fa-cloud',
        'partly': 'fas fa-cloud-sun',
        'rain': 'fas fa-cloud-rain',
        'storm': 'fas fa-bolt',
        'thunder': 'fas fa-cloud-bolt',
        'snow': 'fas fa-snowflake',
        'fog': 'fas fa-smog',
        'wind': 'fas fa-wind',
        'haze': 'fas fa-smog'
    };
    
    let icon = 'fas fa-cloud-sun';
    const desc = description.toLowerCase();
    
    for (const [key, value] of Object.entries(iconMap)) {
        if (desc.includes(key)) {
            icon = value;
            break;
        }
    }
    
    document.getElementById('weatherIconLarge').innerHTML = `<i class="${icon}"></i>`;
}

function renderAISuggestions(suggestions) {
    // Events
    document.getElementById('eventsList').innerHTML = suggestions.events
        .map(e => `<li>${e}</li>`).join('');
    
    // Activities
    document.getElementById('activitiesList').innerHTML = suggestions.activities
        .map(a => `<li>${a}</li>`).join('');
    
    // Food
    document.getElementById('foodList').innerHTML = suggestions.food
        .map(f => `<li>${f}</li>`).join('');
    
    // Dangers
    document.getElementById('dangersList').innerHTML = suggestions.dangers
        .map(d => `<li>${d}</li>`).join('');
    
    // Do/Avoid
    document.getElementById('doList').innerHTML = suggestions.todo
        .map(t => `<li>${t}</li>`).join('');
    
    document.getElementById('avoidList').innerHTML = suggestions.avoid
        .map(a => `<li>${a}</li>`).join('');
    
    // Predictions
    document.getElementById('predictionsList').innerHTML = suggestions.predictions
        .map(p => `<li>${p}</li>`).join('');
    
    // Advantages
    document.getElementById('advantagesList').innerHTML = suggestions.advantages
        .map(a => `<li>${a}</li>`).join('');
    
    // Setup tab functionality
    setupAITabs();
}

function setupAITabs() {
    const tabs = document.querySelectorAll('.ai-tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            document.querySelectorAll('.ai-content').forEach(content => {
                content.style.display = 'none';
            });
            
            const tabName = tab.dataset.tab;
            document.getElementById(`ai${tabName.charAt(0).toUpperCase() + tabName.slice(1)}`).style.display = 'block';
        });
    });
}

function renderWeatherChart() {
    const ctx = document.getElementById('weatherChart');
    if (ctx.chart) {
        ctx.chart.destroy();
    }
    
    ctx.chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['12am', '3am', '6am', '9am', '12pm', '3pm', '6pm', '9pm'],
            datasets: [{
                label: 'Temperature (°C)',
                data: [18, 16, 17, 20, 25, 28, 26, 22],
                borderColor: '#667eea',
                backgroundColor: 'rgba(102, 126, 234, 0.1)',
                tension: 0.4,
                fill: true,
                pointRadius: 4,
                pointBackgroundColor: '#f093fb'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    labels: { color: 'rgba(255, 255, 255, 0.7)' }
                }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    grid: { color: 'rgba(255, 255, 255, 0.1)' },
                    ticks: { color: 'rgba(255, 255, 255, 0.7)' }
                },
                x: {
                    grid: { color: 'rgba(255, 255, 255, 0.1)' },
                    ticks: { color: 'rgba(255, 255, 255, 0.7)' }
                }
            }
        }
    });
}

function renderForecast(weatherData) {
    const forecastGrid = document.getElementById('forecastGrid');
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
    const temps = [24, 26, 23, 25, 27];
    const conditions = ['Partly Cloudy', 'Sunny', 'Rainy', 'Cloudy', 'Sunny'];
    const icons = ['fas fa-cloud-sun', 'fas fa-sun', 'fas fa-cloud-rain', 'fas fa-cloud', 'fas fa-sun'];
    
    forecastGrid.innerHTML = days.map((day, i) => `
        <div class="forecast-card">
            <div class="forecast-date">${day}</div>
            <div class="forecast-icon"><i class="${icons[i]}"></i></div>
            <div class="forecast-temp">${temps[i]}°C</div>
            <div class="forecast-desc">${conditions[i]}</div>
        </div>
    `).join('');
}

// ============ LOCATION & INITIALIZATION ============

function getLocationFromCountry(country) {
    const countryCoords = {
        'Kenya': { lat: -1.2921, lon: 36.8219 },
        'Tanzania': { lat: -6.3690, lon: 34.8888 },
        'Nigeria': { lat: 9.0765, lon: 7.3986 },
        'South Africa': { lat: -33.9249, lon: 18.4241 },
        'Egypt': { lat: 30.0444, lon: 31.2357 },
        'Uganda': { lat: 0.3476, lon: 32.5825 },
        'Ethiopia': { lat: 9.1450, lon: 40.4897 },
        'Ghana': { lat: 5.6037, lon: -0.1870 },
        'Morocco': { lat: 33.9716, lon: -6.8498 },
        'Angola': { lat: -11.2027, lon: 17.8739 }
    };
    
    return countryCoords[country] || { lat: -6.3690, lon: 34.8888 }; // Default to Tanzania
}

async function initializeWeatherApp() {
    document.getElementById('loadingSpinner').style.display = 'flex';
    
    try {
        // Try to get user's current location
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(async (position) => {
                const { latitude, longitude } = position.coords;
                
                // Find nearest African country
                let nearestCountry = 'Tanzania';
                // For demo, just use random African country
                const countryList = Object.values(AFRICAN_COUNTRIES);
                nearestCountry = countryList[Math.floor(Math.random() * countryList.length)];
                
                await loadWeatherForCountry(nearestCountry);
            }, (error) => {
                console.log('Location access denied, using default country');
                loadWeatherForCountry('Tanzania');
            });
        } else {
            loadWeatherForCountry('Tanzania');
        }
    } catch (error) {
        showError('Unable to load weather data. Please try again.');
    }
}

async function loadWeatherForCountry(country) {
    try {
        if (!AFRICAN_COUNTRIES[Object.keys(AFRICAN_COUNTRIES).find(key => AFRICAN_COUNTRIES[key] === country)] && 
            !Object.values(AFRICAN_COUNTRIES).includes(country)) {
            // Ensure country is African
            const firstAfricanCountry = Object.values(AFRICAN_COUNTRIES)[0];
            country = firstAfricanCountry;
        }
        
        const coords = getLocationFromCountry(country);
        const weatherData = await fetchWeatherData(coords.lat, coords.lon, country);
        const suggestions = generateAISuggestions(weatherData, country);
        
        renderWeatherCard(weatherData, country);
        renderAISuggestions(suggestions);
        renderForecast(weatherData);
    } catch (error) {
        showError('Error loading weather for this location');
    }
}

function showError(message) {
    document.getElementById('loadingSpinner').style.display = 'none';
    document.getElementById('errorMessage').style.display = 'flex';
    document.getElementById('errorText').textContent = message;
}

// ============ THEME TOGGLE ============

function setupThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    
    if (isDarkMode) {
        document.body.classList.add('dark-mode');
    }
    
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        const isDark = document.body.classList.contains('dark-mode');
        localStorage.setItem('darkMode', isDark);
        themeToggle.innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    });
}

// ============ LOCATION BUTTON ============

function setupLocationButton() {
    const locationBtn = document.getElementById('locationBtn');
    locationBtn.addEventListener('click', async () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(async (position) => {
                const { latitude, longitude } = position.coords;
                // For demo, load random African country
                const countryList = Object.values(AFRICAN_COUNTRIES);
                const country = countryList[Math.floor(Math.random() * countryList.length)];
                await loadWeatherForCountry(country);
            });
        } else {
            alert('Geolocation is not supported by your browser');
        }
    });
}

// ============ INITIALIZATION ============

document.addEventListener('DOMContentLoaded', () => {
    initThreeJS();
    setupThemeToggle();
    setupLocationButton();
    initializeWeatherApp();
});
