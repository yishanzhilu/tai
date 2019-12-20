FROM node:12-alpine as build

WORKDIR /src
COPY ./package.cache.json /src/package.json
COPY ./yarn.lock /src/yarn.lock

RUN yarn install --frozen-lockfile --non-interactive

COPY . /src

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
