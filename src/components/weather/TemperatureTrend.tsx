import { ResponsiveContainer, AreaChart, Area, XAxis, Tooltip } from "recharts";
import { WeatherData } from "@/types/weather";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface TemperatureTrendProps {
    weather: WeatherData;
}

export function TemperatureTrend({ weather }: TemperatureTrendProps) {
    const data = weather.daily.map((d, i) => {
        const date = new Date(d.date);
        const short =
            i === 0 ? "Auj." :
                i === 1 ? "Dem." :
                    format(date, "EEE", { locale: fr }).replace(".", "");
        return { name: short, max: d.temperatureMax, min: d.temperatureMin };
    });

    return (
        <div className="glass-card p-4">
            <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium text-muted-foreground">Tendance 7 jours</h4>
            </div>
            <div className="h-28">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 8, bottom: 0, left: 0, right: 0 }}>
                        <defs>
                            <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="hsl(var(--accent))" stopOpacity={0.5}/>
                                <stop offset="100%" stopColor="hsl(var(--accent))" stopOpacity={0.05}/>
                            </linearGradient>
                        </defs>
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                        <Tooltip
                            contentStyle={{
                                background: "hsl(var(--card))",
                                border: "1px solid hsl(var(--border))",
                                borderRadius: 10,
                                color: "hsl(var(--foreground))",
                                padding: "8px 10px"
                            }}
                            formatter={(value: never, name: never) => [`${value}°`, name === "max" ? "Max" : "Min"]}
                            labelFormatter={(label) => `Jour: ${label}`}
                        />
                        <Area type="monotone" dataKey="max" stroke="hsl(var(--accent))" strokeWidth={2} fill="url(#tempGradient)" dot={false} activeDot={{ r: 4, fill: "hsl(var(--accent))" }} />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}