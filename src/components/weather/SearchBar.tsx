import { useState, useEffect, useRef, useCallback } from "react";
import { Search, MapPin, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { GeocodeResult } from "@/types/weather";
import { WeatherService } from "@/services/weatherService";

interface SearchBarProps {
    onLocationSelect: (location: GeocodeResult) => void;
    onCurrentLocation: () => void;
    isLoading?: boolean;
}

export const SearchBar = ({ onLocationSelect, onCurrentLocation, isLoading }: SearchBarProps) => {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<GeocodeResult[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const [activeIndex, setActiveIndex] = useState<number>(-1);
    const searchRef = useRef<HTMLDivElement>(null);
    const listRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const onClickOutside = (e: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
                setShowResults(false);
                setActiveIndex(-1);
            }
        };
        document.addEventListener("mousedown", onClickOutside);
        return () => document.removeEventListener("mousedown", onClickOutside);
    }, []);

    useEffect(() => {
        const run = async () => {
            if (query.trim().length < 2) {
                setResults([]);
                setShowResults(false);
                return;
            }
            setIsSearching(true);
            try {
                const r = await WeatherService.searchLocations(query);
                setResults(r);
                setShowResults(true);
                setActiveIndex(r.length ? 0 : -1);
            } catch (err) {
                console.error("Search error:", err);
                setResults([]);
            } finally {
                setIsSearching(false);
            }
        };
        const t = setTimeout(run, 250);
        return () => clearTimeout(t);
    }, [query]);

    const handleLocationSelect = useCallback((loc: GeocodeResult) => {
        onLocationSelect(loc);
        setQuery(loc.name);
        setShowResults(false);
        setActiveIndex(-1);
    }, [onLocationSelect]);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (!showResults || (!results.length && !isSearching)) return;
        if (e.key === "ArrowDown") {
            e.preventDefault();
            setActiveIndex((p) => Math.min(p + 1, results.length - 1));
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setActiveIndex((p) => Math.max(p - 1, 0));
        } else if (e.key === "Enter") {
            if (activeIndex >= 0 && results[activeIndex]) handleLocationSelect(results[activeIndex]);
            else if (results.length === 1) handleLocationSelect(results[0]);
        } else if (e.key === "Escape") {
            setShowResults(false);
            setActiveIndex(-1);
        }
    };

    useEffect(() => {
        if (!listRef.current) return;
        const el = listRef.current.querySelector<HTMLButtonElement>(`[data-index="${activeIndex}"]`);
        el?.scrollIntoView({ block: "nearest" });
    }, [activeIndex]);

    return (
        <div ref={searchRef} className="relative w-full">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                    type="text"
                    placeholder="Rechercher une ville…"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="glass-input pl-10 pr-12 h-11 text-base transition-smooth focus-visible:ring-2 focus-visible:ring-accent"
                    onFocus={() => setShowResults(results.length > 0)}
                    role="combobox"
                    aria-expanded={showResults}
                    aria-controls="search-results"
                    aria-autocomplete="list"
                    aria-activedescendant={activeIndex >= 0 ? `result-${activeIndex}` : undefined}
                />
                <Button
                    onClick={onCurrentLocation}
                    disabled={isLoading}
                    size="sm"
                    variant="ghost"
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-9 w-9 p-0 rounded-md border"
                    aria-label="Utiliser ma position"
                    title="Utiliser ma position"
                >
                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <MapPin className="h-4 w-4" />}
                </Button>
            </div>

            {showResults && (results.length > 0 || isSearching) && (
                <div
                    id="search-results"
                    ref={listRef}
                    role="listbox"
                    className="absolute top-full left-0 right-0 mt-2 glass-card rounded-lg shadow-soft z-50 max-h-64 overflow-y-auto border"
                >
                    {isSearching ? (
                        <div className="p-4 text-center text-muted-foreground text-sm">
                            <Loader2 className="h-4 w-4 animate-spin mx-auto mb-2" />
                            Recherche en cours…
                        </div>
                    ) : (
                        results.map((location, index) => {
                            const active = index === activeIndex;
                            return (
                                <button
                                    key={`${location.name}-${index}`}
                                    id={`result-${index}`}
                                    data-index={index}
                                    role="option"
                                    aria-selected={active}
                                    onMouseEnter={() => setActiveIndex(index)}
                                    onClick={() => handleLocationSelect(location)}
                                    className={`w-full text-left p-3 transition-colors first:rounded-t-lg last:rounded-b-lg ${
                                        active ? "bg-secondary/70" : "hover:bg-secondary/50"
                                    }`}
                                >
                                    <div className="font-medium">{location.name}</div>
                                    <div className="text-sm text-muted-foreground">
                                        {location.admin1 && `${location.admin1}, `}{location.country}
                                    </div>
                                </button>
                            );
                        })
                    )}
                </div>
            )}
        </div>
    );
};