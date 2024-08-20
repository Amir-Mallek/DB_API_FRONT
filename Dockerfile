FROM node:20.16 AS builder

WORKDIR /app

COPY package*.json ./

RUN npm install

RUN npm install -g @angular/cli

COPY . .

RUN ng build --configuration=production

#FROM nginx:latest
#
#COPY --from=builder app/dist/db-admin/browser /usr/share/nginx/html
#
#EXPOSE 80

FROM caddy:latest

EXPOSE 80

COPY Caddyfile /etc/caddy/Caddyfile

COPY --from=builder app/dist/db-admin/browser /usr/share/caddy
