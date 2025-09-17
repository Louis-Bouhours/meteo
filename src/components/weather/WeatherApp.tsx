import { useState, useEffect } from "react";
import { WeatherData, GeocodeResult } from "@/types/weather";
import { WeatherService } from "@/services/weatherService";
import { AppHeader } from "./AppHeader";
import { CurrentWeather } from "./CurrentWeather";
import { TemperatureTrend } from "./TemperatureTrend";
import { WeatherForecast } from "./WeatherForecast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const WeatherApp = () => {
    const [weather, setWeather] = useState<WeatherData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { toast } = useToast();

    const bgByCode = (code?: number) => {
        if (!code || !weather) return "bg-clear";
        if (weather.current.isDay === false) return "bg-night";
        if ([0, 1].includes(code)) return "bg-clear";
        if ([2, 3, 45, 48].includes(code)) return "bg-cloudy";
        if (code >= 51 && code <= 67) return "bg-rainy";
        if (code >= 71 && code <= 86) return "bg-cloudy";
        if (code >= 95) return "bg-rainy";
        return "bg-clear";
    };

    const load = async (lat: number, lon: number, name?: string) => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await WeatherService.getWeatherData(lat, lon, name);
            setWeather(data);
            toast({ title: "Météo mise à jour", description: `Affichage pour ${data.location.name}` });
        } catch (err) {
            const msg = err instanceof Error ? err.message : "Impossible de charger les données météo";
            setError(msg);
            toast({ title: "Erreur", description: msg, variant: "destructive" });
        } finally {
            setIsLoading(false);
        }
    };

    const handleLocationSelect = (loc: GeocodeResult) => load(loc.latitude, loc.longitude, loc.name);

    const handleCurrentLocation = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await WeatherService.getCurrentLocationWeather();
            setWeather(data);
            toast({ title: "Position trouvée", description: "Affichage de la météo pour votre position actuelle." });
        } catch (err) {
            const msg = err instanceof Error ? err.message : "Impossible de récupérer votre position";
            setError(msg);
            toast({ title: "Erreur de géolocalisation", description: msg, variant: "destructive" });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        load(48.8566, 2.3522, "Paris");
    }, []);

    const renderContent = () => {
        if (isLoading && !weather) {
            return (
                <div className="flex flex-col items-center justify-center py-16">
                    <Loader2 className="h-10 w-10 animate-spin text-muted-foreground mb-3" />
                    <p className="text-muted-foreground">Chargement des données météo…</p>
                </div>
            );
        }
        if (error) {
            return (
                <Alert className="mb-6 glass-card border-destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription className="text-destructive-foreground">{error}</AlertDescription>
                </Alert>
            );
        }
        if (weather) {
            return (
                <div className="space-y-6">
                    <CurrentWeather weather={weather} />
                    <TemperatureTrend weather={weather} />
                    <WeatherForecast weather={weather} />
                </div>
            );
        }
        return (
            <div className="text-center py-16">
                <p className="text-muted-foreground">Recherchez une ville pour commencer</p>
            </div>
        );
    };

    return (
        <div className={`min-h-screen transition-all duration-1000 ${bgByCode(weather?.current.weatherCode)}`}>
            <div className="container mx-auto px-4 py-8 max-w-6xl">
                <AppHeader
                    onLocationSelect={handleLocationSelect}
                    onCurrentLocation={handleCurrentLocation}
                    isLoading={isLoading}
                />
                <main className="animate-fade-in">{renderContent()}</main>
            </div>
        </div>
    );
};