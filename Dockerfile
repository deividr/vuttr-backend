FROM node:14
WORKDIR /usr/src/vuttr-backend
COPY ./package.json .
RUN npm install --only=prod
COPY ./dist ./dist
EXPOSE 5000
CMD npm start
