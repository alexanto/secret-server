FROM node:lts-alpine
RUN adduser -s /bin/sh -D newuser
USER newuser
WORKDIR /home/newuser
COPY package-lock.json .
COPY package.json .
RUN npm i
COPY . .
ARG PORT
EXPOSE ${PORT}
CMD ["npm", "start"]