FROM node:14-slim

COPY ./wait-for-it.sh /bin

RUN chmod +x /bin/wait-for-it.sh

RUN npm install pnpm nodemon -g

USER node

RUN mkdir /home/node/todo

WORKDIR /home/node/todo

COPY . .

RUN pnpm install --production

EXPOSE $PORT

CMD ["npm", "run", "start"]
