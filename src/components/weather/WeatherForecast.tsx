import { WeatherData, WEATHER_CODES } from "@/types/weather";
import { Card } from "@/components/ui/card";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface WeatherForecastProps {
    weather: WeatherData;
}

export const WeatherForecast = ({ weather }: WeatherForecastProps) => {
    const { daily } = weather;

    const dayLabel = (dateString: string, index: number) => {
        const date = new Date(dateString);
        if (index === 0) return "Aujourd'hui";
        if (index === 1) return "Demain";
        const name = format(date, "EEE", { locale: fr }).replace(".", "");
        return name.charAt(0).toUpperCase() + name.slice(1);
    };

    return (
        <Card className="glass-card p-6">
            <h3 className="text-xl font-semibold mb-4">Prévisions</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-7 gap-3">
                {daily.map((d, i) => {
                    const info = WEATHER_CODES[d.weatherCode] || { description: "Inconnu", icon: "❓" };
                    return (
                        <div key={d.date} className="rounded-lg border p-3 hover:bg-secondary/50 transition-smooth">
                            <div className="text-sm text-muted-foreground">{dayLabel(d.date, i)}</div>
                            <div className="mt-2 text-3xl weather-icon">{info.icon}</div>
                            <div className="mt-2 text-xs text-muted-foreground">{info.description}</div>
                            <div className="mt-3 flex items-baseline justify-between">
                                <div className="text-lg font-semibold">{d.temperatureMax}°</div>
                                <div className="text-sm text-muted-foreground">{d.temperatureMin}°</div>
                            </div>
                            <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                                <span>{d.precipitation.toFixed(1)}mm</span>
                                <span>{d.windSpeed} km/h</span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </Card>
    );
};