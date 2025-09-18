import { render, screen } from "@testing-library/react";
import { WeatherApp } from "../weather/WeatherApp";

describe("WeatherApp", () => {
    it("affiche l'état de chargement initial", () => {
        render(<WeatherApp />);
        expect(
            screen.getByText(/Chargement des données météo/i)
        ).toBeInTheDocument();
    });
});