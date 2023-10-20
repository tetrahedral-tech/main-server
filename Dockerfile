FROM node:lts
WORKDIR /app
COPY yarn.lock .
RUN yarn
COPY . .
RUN yarn build

RUN ls | grep -xvE "build|node_modules|package.json" | xargs rm -rf
EXPOSE 80
ENV ORIGIN http://localhost
ENV PORT 80
CMD [ "node", "build" ]
