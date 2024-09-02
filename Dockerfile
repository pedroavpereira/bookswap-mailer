FROM node:20

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . ./

ENV PORT 4000

ENV NODE_ENV production

EXPOSE 4000

CMD ["node","index.js"]
