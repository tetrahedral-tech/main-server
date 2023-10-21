FROM node:lts-alpine
WORKDIR /app
COPY package.json .
COPY yarn.lock .
RUN yarn

COPY . .
RUN yarn build
RUN ls -a | grep -xvwE "\.\.?|build|node_modules|package.json|.env" | xargs rm -rf

EXPOSE 80
ENV ORIGIN http://localhost
ENV PORT 80
CMD [ "node", "build" ]
