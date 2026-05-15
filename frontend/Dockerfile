FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
# Setting public URL for the client to hit the backend
ENV NEXT_PUBLIC_API_URL=http://103.89.45.174:4000/api

RUN npm run build

EXPOSE 3000
CMD ["npm", "run", "start"]
