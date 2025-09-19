# Étape 1 : Build des assets Vite
FROM node:20-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

RUN npm run build

FROM caddy:2.8-alpine

COPY --from=build /app/dist /srv

COPY Caddyfile.container /etc/caddy/Caddyfile

EXPOSE 80
