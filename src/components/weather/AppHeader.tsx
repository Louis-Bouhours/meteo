import { SearchBar } from "./SearchBar.tsx";

interface AppHeaderProps {
    onLocationSelect: (loc: never) => void;
    onCurrentLocation: () => void;
    isLoading?: boolean;
}

export function AppHeader({ onLocationSelect, onCurrentLocation, isLoading }: AppHeaderProps) {
    return (
        <header className="mb-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <div>
                    <h1 className="text-4xl md:text-5xl font-semibold tracking-tight">Météo</h1>
                </div>
                <div className="w-full md:w-[480px]">
                    <SearchBar
                        onLocationSelect={onLocationSelect}
                        onCurrentLocation={onCurrentLocation}
                        isLoading={isLoading}
                    />
                </div>
            </div>
        </header>
    );
}