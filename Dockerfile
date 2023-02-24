# syntax=docker/dockerfile:1
FROM node:18.14.0 as base

WORKDIR /server

COPY package.json package.json
COPY package-lock.json package-lock.json

FROM base as prod
RUN npm ci --production
COPY . .
CMD [ "node", "app.js" ]