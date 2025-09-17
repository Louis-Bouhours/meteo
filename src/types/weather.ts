export interface WeatherData {
    current: {
        temperature: number;
        humidity: number;
        windSpeed: number;
        windDirection: number;
        weatherCode: number;
        isDay: boolean;
    };
    daily: {
        date: string;
        temperatureMax: number;
        temperatureMin: number;
        weatherCode: number;
        humidity: number;
        windSpeed: number;
        precipitation: number;
    }[];
    location: {
        name: string;
        country: string;
        latitude: number;
        longitude: number;
    };
}

export interface GeocodeResult {
    name: string;
    country: string;
    latitude: number;
    longitude: number;
    admin1?: string;
}

export const WEATHER_CODES: Record<number, { description: string; icon: string }> = {
    0: { description: "Ciel dégagé", icon: "☀️" },
    1: { description: "Généralement dégagé", icon: "🌤️" },
    2: { description: "Partiellement nuageux", icon: "⛅" },
    3: { description: "Ciel couvert", icon: "☁️" },
    45: { description: "Brouillard", icon: "🌫️" },
    48: { description: "Brouillard givrant", icon: "🌫️" },
    51: { description: "Bruine légère", icon: "🌦️" },
    53: { description: "Bruine modérée", icon: "🌦️" },
    55: { description: "Bruine dense", icon: "🌧️" },
    56: { description: "Légère bruine verglaçante", icon: "🌨️" },
    57: { description: "Bruine verglaçante dense", icon: "🌨️" },
    61: { description: "Pluie faible", icon: "🌧️" },
    63: { description: "Pluie modérée", icon: "🌧️" },
    65: { description: "Pluie forte", icon: "⛈️" },
    66: { description: "Pluie verglaçante légère", icon: "🌨️" },
    67: { description: "Pluie verglaçante forte", icon: "🌨️" },
    71: { description: "Légère chute de neige", icon: "❄️" },
    73: { description: "Chute de neige modérée", icon: "❄️" },
    75: { description: "Forte chute de neige", icon: "❄️" },
    77: { description: "Neige en grains", icon: "❄️" },
    80: { description: "Averses de pluie légères", icon: "🌦️" },
    81: { description: "Averses de pluie modérées", icon: "🌧️" },
    82: { description: "Averses de pluie violentes", icon: "⛈️" },
    85: { description: "Légères averses de neige", icon: "❄️" },
    86: { description: "Fortes averses de neige", icon: "❄️" },
    95: { description: "Orage", icon: "⛈️" },
    96: { description: "Orage avec grêle légère", icon: "⛈️" },
    99: { description: "Orage avec forte grêle", icon: "⛈️" },
};