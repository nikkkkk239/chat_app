FROM node:18-alpine

WORKDIR /chat_app

COPY backend/package*.json ./backend/
RUN npm install --only=production

COPY . .

EXPOSE 5001

CMD [ "node" , "index.js" ]