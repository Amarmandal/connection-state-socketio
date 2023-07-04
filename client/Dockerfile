FROM node:18-alpine
WORKDIR /app
COPY package*.json .
RUN npm ci
COPY . .
RUN npm run build

# you could totally use nginx:alpine here too
FROM nginx:latest
COPY --from=0 /app/dist /usr/share/nginx/html