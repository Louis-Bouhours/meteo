import { WeatherData, WEATHER_CODES } from "@/types/weather";
import { Card } from "@/components/ui/card";
import { Wind, Droplets, Eye, Thermometer } from "lucide-react";

interface CurrentWeatherProps {
    weather: WeatherData;
}

export const CurrentWeather = ({ weather }: CurrentWeatherProps) => {
    const { current, location } = weather;
    const info = WEATHER_CODES[current.weatherCode] || { description: "Inconnu", icon: "❓" };

    const dir = (deg: number) => {
        const d = ["N","NNE","NE","ENE","E","ESE","SE","SSE","S","SSO","SO","OSO","O","ONO","NO","NNO"];
        return d[Math.round(deg / 22.5) % 16];
    };

    return (
        <Card className="glass-card p-6 md:p-8 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Hero */}
                <div className="md:col-span-2 flex items-center gap-5">
                    <div className="text-6xl md:text-7xl weather-icon">{info.icon}</div>
                    <div className="flex-1">
                        <h2 className="text-2xl md:text-3xl font-semibold">{location.name}</h2>
                        <p className="text-muted-foreground">{location.country}</p>
                        <p className="text-muted-foreground">{info.description}</p>
                    </div>
                    <div className="text-right">
                        <div className="text-6xl md:text-7xl font-light leading-none">{current.temperature}°</div>
                        <div className="mt-2 inline-flex items-center gap-2 rounded-full border px-2 py-1 text-xs text-muted-foreground">
                            <Thermometer className="h-3.5 w-3.5 text-accent" />
                            Ressenti {current.temperature}°
                        </div>
                    </div>
                </div>

                {/* Quick stats */}
                <div className="grid grid-cols-3 gap-3">
                    <div className="rounded-lg border p-3">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Wind className="h-4 w-4 text-accent" /> Vent
                        </div>
                        <div className="mt-1 text-base font-medium">{current.windSpeed} km/h</div>
                        <div className="text-xs text-muted-foreground">{dir(current.windDirection)}</div>
                    </div>
                    <div className="rounded-lg border p-3">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Droplets className="h-4 w-4 text-accent" /> Humidité
                        </div>
                        <div className="mt-1 text-base font-medium">{current.humidity}%</div>
                    </div>
                    <div className="rounded-lg border p-3">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Eye className="h-4 w-4 text-accent" /> Période
                        </div>
                        <div className="mt-1 text-base font-medium">{current.isDay ? "Jour" : "Nuit"}</div>
                    </div>
                </div>
            </div>
        </Card>
    );
};