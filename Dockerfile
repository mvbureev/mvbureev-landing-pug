FROM node:16

ENV NODE_ENV=production
WORKDIR /app
COPY src/ ./
COPY package.json .
COPY yarn.lock .

RUN yarn global add pm2
RUN rm -rf node_modules && yarn install --frozen-lockfile

EXPOSE 3000
ENV PORT 3000

CMD ["pm2", "start", "--no-daemon", "./app.js"]
