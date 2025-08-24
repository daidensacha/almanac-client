// src/utils/weatherIcons.js
export function iconForWmo(code) {
  const map = {
    0: '☀️', // Clear
    1: '🌤️',
    2: '⛅',
    3: '☁️', // Partly / mostly cloudy
    45: '🌫️',
    48: '🌫️', // Fog
    51: '🌦️',
    61: '🌧️',
    63: '🌧️',
    65: '🌧️', // Rain
    71: '🌨️',
    73: '🌨️',
    75: '❄️',
    77: '🌨️',
    80: '🌦️',
    81: '🌧️',
    82: '🌧️', // Showers
    95: '⛈️',
    96: '⛈️',
    99: '⛈️', // Thunder
  };
  return map[code] || '❔';
}
