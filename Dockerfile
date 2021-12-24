FROM node:latest

MAINTAINER  ValeriyaReutova  <ValeriyaReutova@gmail.ru>


WORKDIR /opt/app

RUN npm install

CMD ["npm","start"]