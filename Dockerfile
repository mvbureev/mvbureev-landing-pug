# Production image, copy all the files and run next
FROM node:16-alpine
RUN apk add --no-cache libc6-compat
WORKDIR /app

RUN addgroup -g 1001 -S nodejs
RUN adduser -S pug -u 1001

RUN npm install --global pm2

COPY package*.json yarn.lock ./
RUN yarn --production --ignore-scripts --prefer-offline

COPY public ./public
COPY --chown=pug:nodejs build ./build
COPY package.json ./package.json

EXPOSE 3000
USER pug
ENV PORT 3000
CMD [ "pm2-runtime", "npm", "--", "start" ]
