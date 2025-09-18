import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// Fichier de configuration Vite + Vitest
export default defineConfig({
    server: {
        host: "::",
        port: 8086,
    },
    plugins: [react()],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
    test: {
        // Active les globals (describe, it, expect) sans import explicite
        globals: true,

        // Environnement DOM simulé
        environment: "jsdom",

        // Fichier d'initialisation (jest-dom, mocks éventuels…)
        setupFiles: "./src/test/setupTests.ts",

        // Options supplémentaires pour jsdom
        environmentOptions: {
            jsdom: {
                url: "http://localhost/",
                pretendToBeVisual: true
            }
        },

        // On ignore le CSS (plus rapide, sauf si tu testes des styles inlines)
        css: false,

        // Couverture
        coverage: {
            provider: "v8",
            reporter: ["text", "html", "lcov"],
            reportsDirectory: "./coverage"
        }
    }
});