FROM node:18-alpine as build

WORKDIR /chat_app

COPY frontend/package*.json ./frontend/
WORKDIR /chat_app/frontend

RUN npm install

COPY frontend ./
RUN npm run build

FROM nginx:alpine
COPY --from=build /chat_app/frontend/dist /usr/share/nginx/html
EXPOSE 80

