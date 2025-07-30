# Stage 1: Build Angular
FROM node:22-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .
RUN npm run build --prod

# Stage 2: Nginx per Angular static
FROM nginx:stable-alpine AS nginx-builder

COPY nginx/default.conf /etc/nginx/conf.d/default.conf


RUN rm -rf /usr/share/nginx/html/*
COPY --from=build /app/dist/ /usr/share/nginx/html

COPY nginx/docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

EXPOSE 80

ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]

# Stage 3: WebSocket backend
FROM node:22 AS service-builder

WORKDIR /app

ENV NODE_ENV=production

COPY service/package.json service/package-lock.json* ./service/

WORKDIR /app/service
RUN npm install

COPY service ./service

CMD ["npm run start"]
