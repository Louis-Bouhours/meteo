import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { VitePWA } from "vite-plugin-pwa";
import path from "path";

export default defineConfig({
    server: {
        host: "::",
        port: 8086,
    },
    plugins: [
        react(),
        VitePWA({
            registerType: "autoUpdate",
            includeAssets: ["favicon.ico", "robots.txt"],
            manifest: {
                name: "Météo+",
                short_name: "Météo",
                description: "Prévisions météo élégantes avec un aperçu sur 7 jours.",
                start_url: "/",
                scope: "/",
                display: "standalone",
                background_color: "#0ea5e9",
                theme_color: "#0ea5e9",
                icons: [
                    {
                        src: "src/img/logoLB.webp",
                        sizes: "192x192",
                        type: "image/webp"
                    },
                    {
                        src: "src/img/logoLB.webp",
                        sizes: "512x512",
                        type: "image/webp"
                    },
                    {
                        src: "src/img/logoLB.webp",
                        sizes: "180x180",
                        type: "image/webp",
                        purpose: "any maskable"
                    }
                ]
            },
            workbox: {
                runtimeCaching: [
                    {
                        urlPattern: /^https:\/\/api\.openweathermap\.org\/data\//,
                        handler: "NetworkFirst",
                        options: {
                            cacheName: "meteo-api-cache",
                            expiration: {
                                maxEntries: 20,
                                maxAgeSeconds: 10 * 60 // 10 minutes
                            }
                        }
                    },
                    {
                        urlPattern: ({ request }) =>
                            ["document", "script", "style", "image", "font"].includes(
                                request.destination
                            ),
                        handler: "CacheFirst",
                        options: {
                            cacheName: "meteo-static-cache",
                            expiration: {
                                maxEntries: 50,
                                maxAgeSeconds: 24 * 60 * 60 // 1 jour
                            }
                        }
                    }
                ]
            }
        })
    ],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
    test: {
        globals: true,
        environment: "jsdom",
        setupFiles: "./src/test/setupTests.ts",
        environmentOptions: {
            jsdom: {
                url: "http://localhost/",
                pretendToBeVisual: true,
            },
        },
        css: false,
        coverage: {
            provider: "v8",
            reporter: ["text", "html", "lcov"],
            reportsDirectory: "./coverage",
        },
    },
});
