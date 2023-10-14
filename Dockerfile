FROM node:lts
WORKDIR /app
COPY . .
RUN yarn
RUN yarn build

RUN ls | grep -xvE "build|node_modules|package.json" | xargs rm -rf
EXPOSE 3000
ENV ORIGIN http://localhost:3000
CMD [ "node", "build" ]