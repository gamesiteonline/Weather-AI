/* ============================================
   African Countries Database
   ============================================ */

const AFRICAN_COUNTRIES = {
    'egypt': {
        name: 'Egypt',
        code: 'EG',
        coordinates: { lat: 26.8206, lng: 30.8025 },
        capital: 'Cairo',
        region: 'North Africa',
        cuisine: ['Koshary', 'Falafel', 'Fato\'ash', 'Koshari'],
        activities: ['Nile Cruise', 'Giza Pyramids', 'Desert Safari', 'Bazaar Shopping'],
        warnings: ['High heat in summer', 'Sandstorms possible', 'UV protection needed'],
        advantages: ['Abundant sunshine', 'Clear skies', 'Great visibility'],
    },
    'south africa': {
        name: 'South Africa',
        code: 'ZA',
        coordinates: { lat: -30.5595, lng: 22.9375 },
        capital: 'Pretoria',
        region: 'Southern Africa',
        cuisine: ['Braai', 'Bobotie', 'Bunny Chow', 'Sosaties'],
        activities: ['Safari', 'Table Mountain', 'Wine Tasting', 'Beach Activities'],
        warnings: ['Winter dryness', 'High wind risk', 'Summer storms'],
        advantages: ['Mild climate', 'Great for outdoor activities', 'Varied landscapes'],
    },
    'nigeria': {
        name: 'Nigeria',
        code: 'NG',
        coordinates: { lat: 9.0820, lng: 8.6753 },
        capital: 'Abuja',
        region: 'West Africa',
        cuisine: ['Jollof Rice', 'Suya', 'Pepper Soup', 'Moi Moi'],
        activities: ['Market Tours', 'Music Festivals', 'Boat Rides', 'Cultural Events'],
        warnings: ['High humidity', 'Heavy rainfalls', 'Heat-related risks'],
        advantages: ['Rich culture', 'Vibrant nightlife', 'Excellent food'],
    },
    'kenya': {
        name: 'Kenya',
        code: 'KE',
        coordinates: { lat: -1.2864, lng: 36.8172 },
        capital: 'Nairobi',
        region: 'East Africa',
        cuisine: ['Ugali', 'Sukuma Wiki', 'Mandazi', 'Chapati'],
        activities: ['Safari', 'Mount Kenya Climbing', 'Beach Relaxation', 'Wildlife Viewing'],
        warnings: ['Malaria risk', 'Wildlife dangers', 'Altitude sickness possible'],
        advantages: ['Amazing wildlife', 'Perfect weather', 'Adventure opportunities'],
    },
    'morocco': {
        name: 'Morocco',
        code: 'MA',
        coordinates: { lat: 31.7917, lng: -7.0926 },
        capital: 'Rabat',
        region: 'North Africa',
        cuisine: ['Tagine', 'Couscous', 'Harira', 'Pastilla'],
        activities: ['Medina Walks', 'Desert Tours', 'Atlas Hiking', 'Beach Activities'],
        warnings: ['Desert heat', 'Mountain cold', 'Dust storms possible'],
        advantages: ['Diverse landscapes', 'Rich culture', 'Perfect seasons'],
    },
    'ghana': {
        name: 'Ghana',
        code: 'GH',
        coordinates: { lat: 7.3697, lng: -5.5825 },
        capital: 'Accra',
        region: 'West Africa',
        cuisine: ['Fufu', 'Waakye', 'Jollof Rice', 'Groundnut Soup'],
        activities: ['Beach Time', 'Market Tours', 'Music Venues', 'Fort Visits'],
        warnings: ['High humidity', 'Tropical storms', 'Heat stress'],
        advantages: ['Warm hospitality', 'Beautiful beaches', 'Vibrant culture'],
    },
    'tanzania': {
        name: 'Tanzania',
        code: 'TZ',
        coordinates: { lat: -6.3690, lng: 34.8888 },
        capital: 'Dar es Salaam',
        region: 'East Africa',
        cuisine: ['Ugali', 'Octopus Curry', 'Mandazi', 'Nyama Choma'],
        activities: ['Mount Kilimanjaro', 'Serengeti Safari', 'Zanzibar Islands', 'Beach Time'],
        warnings: ['Rainy season challenges', 'Altitude sickness', 'Malaria risk'],
        advantages: ['Stunning landscapes', 'Wildlife abundance', 'Cultural experiences'],
    },
    'ethiopia': {
        name: 'Ethiopia',
        code: 'ET',
        coordinates: { lat: 9.1450, lng: 40.4897 },
        capital: 'Addis Ababa',
        region: 'East Africa',
        cuisine: ['Injera', 'Doro Wot', 'Kitfo', 'Tibs'],
        activities: ['Hiking', 'Ancient Sites', 'Coffee Ceremonies', 'Market Tours'],
        warnings: ['Altitude effects', 'Rainy season', 'Altitude sickness'],
        advantages: ['Unique culture', 'Ancient history', 'Mountain beauty'],
    },
    'ivory coast': {
        name: 'Ivory Coast',
        code: 'CI',
        coordinates: { lat: 7.5400, lng: -5.5471 },
        capital: 'Yamoussoukro',
        region: 'West Africa',
        cuisine: ['Attiéké', 'Fufu', 'Aloco', 'Kedjenou'],
        activities: ['Beach Resorts', 'Forest Tours', 'Market Shopping', 'Music Events'],
        warnings: ['High humidity', 'Heavy rains', 'Traffic hazards'],
        advantages: ['Beautiful beaches', 'Rich culture', 'Friendly locals'],
    },
    'cameroon': {
        name: 'Cameroon',
        code: 'CM',
        coordinates: { lat: 3.8480, lng: 11.5021 },
        capital: 'Yaoundé',
        region: 'Central Africa',
        cuisine: ['Fufu', 'Ndolé', 'Achu', 'Sanga'],
        activities: ['Mountain Climbing', 'Beach Time', 'Market Tours', 'Lake Activities'],
        warnings: ['High humidity', 'Mountain hazards', 'Tropical storms'],
        advantages: ['Diverse landscapes', 'Warm climate', 'Rich biodiversity'],
    },
    'uganda': {
        name: 'Uganda',
        code: 'UG',
        coordinates: { lat: 1.3733, lng: 32.2903 },
        capital: 'Kampala',
        region: 'East Africa',
        cuisine: ['Matoke', 'Luwombo', 'Chapati', 'Beans and Rice'],
        activities: ['Mountain Gorilla Trekking', 'Rafting', 'Safari', 'Water Sports'],
        warnings: ['Malaria risk', 'River dangers', 'Animal wildlife'],
        advantages: ['Gorilla trekking', 'Stunning nature', 'Adventure activities'],
    },
    'zambia': {
        name: 'Zambia',
        code: 'ZM',
        coordinates: { lat: -13.1339, lng: 27.8493 },
        capital: 'Lusaka',
        region: 'Southern Africa',
        cuisine: ['Nshima', 'Relish', 'Pumpkin Leaves', 'Kapenta'],
        activities: ['Victoria Falls', 'Safari', 'Zip-lining', 'Canoeing'],
        warnings: ['Malaria risk', 'Heat waves', 'Rainy season'],
        advantages: ['Amazing waterfalls', 'Wildlife viewing', 'Adventure sports'],
    },
    'zimbabwe': {
        name: 'Zimbabwe',
        code: 'ZW',
        coordinates: { lat: -19.0154, lng: 29.1549 },
        capital: 'Harare',
        region: 'Southern Africa',
        cuisine: ['Sadza', 'Relish', 'Nyama Choma', 'Mopane Worms'],
        activities: ['Victoria Falls', 'Safari', 'Stone Town', 'Hiking'],
        warnings: ['Malaria risk', 'Heat stress', 'Rainy season'],
        advantages: ['Natural wonders', 'Safari opportunities', 'Cultural sites'],
    },
    'namibia': {
        name: 'Namibia',
        code: 'NA',
        coordinates: { lat: -22.9375, lng: 18.6947 },
        capital: 'Windhoek',
        region: 'Southern Africa',
        cuisine: ['Potjiekos', 'Biltong', 'Pap', 'Kudu Meat'],
        activities: ['Desert Tours', 'Skeleton Coast', 'Hiking', 'Stargazing'],
        warnings: ['Extreme heat', 'Dust storms', 'Water scarcity'],
        advantages: ['Stunning deserts', 'Clear nights', 'Unique landscapes'],
    },
    'botswana': {
        name: 'Botswana',
        code: 'BW',
        coordinates: { lat: -22.3285, lng: 24.6849 },
        capital: 'Gaborone',
        region: 'Southern Africa',
        cuisine: ['Seswaa', 'Pap', 'Phane', 'Boiled Maize'],
        activities: ['Safari', 'Okavango Delta', 'Camping', 'Wildlife Viewing'],
        warnings: ['Heat', 'Malaria risk', 'Wildlife dangers'],
        advantages: ['Amazing wildlife', 'Delta beauty', 'Clear skies'],
    },
    'rwanda': {
        name: 'Rwanda',
        code: 'RW',
        coordinates: { lat: -1.9536, lng: 29.8739 },
        capital: 'Kigali',
        region: 'East Africa',
        cuisine: ['Ugali', 'Beans', 'Plantains', 'Cassava'],
        activities: ['Gorilla Trekking', 'Hiking', 'Lake Activities', 'Cultural Tours'],
        warnings: ['Altitude sickness', 'Rainy season', 'Narrow mountain roads'],
        advantages: ['Mountain beauty', 'Gorillas', 'Clean environment'],
    },
    'senegal': {
        name: 'Senegal',
        code: 'SN',
        coordinates: { lat: 14.4974, lng: -14.4524 },
        capital: 'Dakar',
        region: 'West Africa',
        cuisine: ['Thieboudienne', 'Yassa', 'Mafé', 'Pastels'],
        activities: ['Beach Relaxation', 'Island Tours', 'Music Festivals', 'Watersports'],
        warnings: ['Strong winds', 'Ocean conditions', 'Heat'],
        advantages: ['Beautiful beaches', 'Great culture', 'Friendly people'],
    },
    'congo': {
        name: 'Congo',
        code: 'CG',
        coordinates: { lat: -4.0383, lng: 21.7587 },
        capital: 'Brazzaville',
        region: 'Central Africa',
        cuisine: ['Cassava Leaves', 'Grilled Fish', 'Palm Nut Soup', 'Plantains'],
        activities: ['Jungle Tours', 'River Cruises', 'Wildlife', 'Market Visits'],
        warnings: ['High humidity', 'Rainy season', 'Dense jungle hazards'],
        advantages: ['Rich rainforests', 'Wildlife', 'River activities'],
    },
    'mali': {
        name: 'Mali',
        code: 'ML',
        coordinates: { lat: 17.5707, lng: -3.9962 },
        capital: 'Bamako',
        region: 'West Africa',
        cuisine: ['Fufu', 'Jollof Rice', 'Thieboudienne', 'Peanut Sauce'],
        activities: ['Desert Tours', 'River Cruises', 'Music Festivals', 'Historical Sites'],
        warnings: ['Extreme heat', 'Dust storms', 'Security concerns'],
        advantages: ['Rich culture', 'Historical sites', 'Desert beauty'],
    },
    'guinea': {
        name: 'Guinea',
        code: 'GN',
        coordinates: { lat: 9.9456, lng: -9.6966 },
        capital: 'Conakry',
        region: 'West Africa',
        cuisine: ['Fufu', 'Rice Balls', 'Fish Stew', 'Plantains'],
        activities: ['Beach Time', 'Island Tours', 'Market Tours', 'Music Events'],
        warnings: ['High humidity', 'Heavy rains', 'Heat stress'],
        advantages: ['Beautiful islands', 'Beaches', 'Friendly locals'],
    },
    'benin': {
        name: 'Benin',
        code: 'BJ',
        coordinates: { lat: 9.3077, lng: 2.3158 },
        capital: 'Porto-Novo',
        region: 'West Africa',
        cuisine: ['Fufu', 'Gari', 'Fish Stew', 'Okra Soup'],
        activities: ['Beach Relaxation', 'Market Tours', 'Voodoo Tours', 'Water Sports'],
        warnings: ['High humidity', 'Strong sun', 'Tropical storms'],
        advantages: ['Beautiful beaches', 'Rich culture', 'Unique festivals'],
    },
    'togo': {
        name: 'Togo',
        code: 'TG',
        coordinates: { lat: 6.1256, lng: 1.2320 },
        capital: 'Lomé',
        region: 'West Africa',
        cuisine: ['Fufu', 'Sauce Arachide', 'Pâte', 'Cassava Leaves'],
        activities: ['Beach Time', 'Market Tours', 'Lake Activities', 'Waterfall Visits'],
        warnings: ['High humidity', 'Heavy rains', 'Heat'],
        advantages: ['Friendly locals', 'Good beaches', 'Great food'],
    },
};

// Helper functions
function getCountriesList() {
    return Object.keys(AFRICAN_COUNTRIES).map(key => ({
        key,
        ...AFRICAN_COUNTRIES[key]
    }));
}

function searchCountries(query) {
    const lowercaseQuery = query.toLowerCase();
    return getCountriesList().filter(country => 
        country.name.toLowerCase().includes(lowercaseQuery) ||
        country.capital.toLowerCase().includes(lowercaseQuery) ||
        country.code.toLowerCase().includes(lowercaseQuery)
    );
}

function getCountryByKey(key) {
    return AFRICAN_COUNTRIES[key.toLowerCase()];
}

function getRandomCountry() {
    const countries = getCountriesList();
    return countries[Math.floor(Math.random() * countries.length)];
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        AFRICAN_COUNTRIES,
        getCountriesList,
        searchCountries,
        getCountryByKey,
        getRandomCountry
    };
}
