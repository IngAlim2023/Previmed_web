FROM node:22-slim AS builder

WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm ci

# Copiar el código fuente
COPY . .

# Crear archivo .env.production
RUN printf 'VITE_URL_BACK=http://72.61.8.11:3333/\nVITE_WEBHOOKURL=https://andresprevimed.app.n8n.cloud/webhook/59b19c61-25c1-4355-976d-54d14e89912e/chat\n' > .env.production

# Construir la aplicación
RUN npm run build

FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
