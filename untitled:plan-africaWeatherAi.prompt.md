Plan for Africa Weather AI Web App

1. Update the existing app to ensure it runs immediately in a browser:
   - Instantiate `AppManager` after DOM load.
   - Ensure `weatherAPI` and `uiManager` are available globally.
   - Fix any missing UI components or CSS classes for the current layout.

2. Add current location access and African country matching:
   - Use browser geolocation to get coordinates.
   - Reverse geocode location with OpenStreetMap to infer country.
   - Validate that the detected country is in the African country database.

3. Improve weather widget, layouts, and live storytelling:
   - Add a hero weather state with ambient background.
   - Show animated 3D background via Three.js.
   - Build a bento-grid dashboard with multiple status cards.
   - Include dynamic iconography, rating, and visual story panels.

4. Enhance AI suggestions and content generation:
   - Provide event/activity/dining/dangers/advantages advice.
   - Create context-aware suggestions based on temperature, humidity, wind, precipitation.
   - Add food and experience recommendations per region.
   - Include a compact “do / do not” list for local weather.

5. Add diagrams and data visuals:
   - Add an inline forecast graph or bar chart for 7-day conditions.
   - Use CSS-driven cards and micro-data visuals for readability.
   - Implement live summary chips and weather summary bars.

6. Polish the UI with glassmorphism and color theory:
   - Strengthen the glass panel styling and blurred hero sections.
   - Update typography, spacing, and responsive layout.
   - Add developer credit and version details.

7. Test the app in the browser and ensure it is functional for African countries only.

Developer: Fahad Mohamed
Email: fahadmohamedmalibiche@gmail.com