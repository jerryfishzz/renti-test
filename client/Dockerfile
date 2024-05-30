FROM node:20-alpine

WORKDIR /usr/src/renti

COPY package*.json ./
RUN npm install

COPY . .

# CMD ["npm", "run", "dev"]