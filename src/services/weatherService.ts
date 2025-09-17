import { WeatherData, GeocodeResult } from "../types/weather";

const OPEN_METEO_BASE_URL = "https://api.open-meteo.com/v1";
const GEOCODING_BASE_URL = "https://geocoding-api.open-meteo.com/v1";

export class WeatherService {
  static async searchLocations(query: string): Promise<GeocodeResult[]> {
    if (!query.trim()) return [];
    
    try {
      const response = await fetch(
        `${GEOCODING_BASE_URL}/search?name=${encodeURIComponent(query)}&count=5&language=en&format=json`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data.results || [];
    } catch (error) {
      console.error("Error searching locations:", error);
      return [];
    }
  }

    static async getWeatherData(latitude: number, longitude: number, locationName?: string): Promise<WeatherData> {
        try {
            const params = new URLSearchParams({
                latitude: latitude.toString(),
                longitude: longitude.toString(),
                current: "temperature_2m,relative_humidity_2m,wind_speed_10m,wind_direction_10m,weather_code,is_day",
                // 👇 LA LIGNE CORRIGÉE 👇
                daily: "temperature_2m_max,temperature_2m_min,weathercode,wind_speed_10m_max,precipitation_sum",
                timezone: "auto",
                forecast_days: "7"
            });

            const response = await fetch(`${OPEN_METEO_BASE_URL}/forecast?${params}`);

            if (!response.ok) {
                // Tu verras toujours l'erreur 400 ici si quelque chose ne va pas
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            // 👇 J'AI MIS À JOUR LE MAPPING POUR UTILISER "weathercode" 👇
            return {
                current: {
                    temperature: Math.round(data.current.temperature_2m),
                    humidity: data.current.relative_humidity_2m,
                    windSpeed: Math.round(data.current.wind_speed_10m),
                    windDirection: data.current.wind_direction_10m,
                    weatherCode: data.current.weather_code,
                    isDay: data.current.is_day === 1,
                },
                daily: data.daily.time.map((date: string, index: number) => ({
                    date,
                    temperatureMax: Math.round(data.daily.temperature_2m_max[index]),
                    temperatureMin: Math.round(data.daily.temperature_2m_min[index]),
                    weatherCode: data.daily.weathercode[index], // Corrigé ici aussi
                    // humidity n'est plus disponible pour les jours, donc on le retire
                    windSpeed: Math.round(data.daily.wind_speed_10m_max[index]),
                    precipitation: data.daily.precipitation_sum[index],
                })),
                location: {
                    name: locationName || "Current Location",
                    country: "",
                    latitude,
                    longitude,
                },
            };
        } catch (error) {
            console.error("Error fetching weather data:", error);
            throw new Error("Failed to fetch weather data");
        }
    }

  static async getCurrentLocationWeather(): Promise<WeatherData> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation is not supported by this browser"));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            const weatherData = await this.getWeatherData(latitude, longitude);
            resolve(weatherData);
          } catch (error) {
            reject(error);
          }
        },
        (error) => {
          reject(new Error("Unable to retrieve your location"));
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000, // 5 minutes
        }
      );
    });
  }
}