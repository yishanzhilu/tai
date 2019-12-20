FROM node:12-alpine as build

COPY . /src
WORKDIR /src

RUN yarn install:lock --registry=https://registry.npm.taobao.org
RUN yarn build
RUN npm prune --production

FROM node:12-alpine

WORKDIR /usr/app

COPY --from=build /src/node_modules /usr/app/node_modules
COPY --from=build /src/package.json /usr/app/package.json
COPY --from=build /src/public /usr/app/public
COPY --from=build /src/next.config.prd.js ./next.config.js
COPY --from=build /src/.next /usr/app/.next


ENV NODE_ENV production

CMD ["npm", "start"]
