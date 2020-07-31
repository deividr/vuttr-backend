FROM node:14
WORKDIR /src/usr/vuttr-backend
COPY ./package.json .
RUN yarn install --only=prod
COPY ./dist ./dist
EXPOSE 5000
CMD yarn start
