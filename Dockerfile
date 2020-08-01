FROM node:14
WORKDIR /usr/src/vuttr-backend
COPY ./package.json .
RUN yarn install --prod
