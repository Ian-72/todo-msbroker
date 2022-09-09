# todo-msbroker

Message queues implementation with RabbitMQ

## Usage guide
1) Clone this repo and go to directory
  ```
  $ git clone https://github.com/Ian-72/todo-msbroker.git
  $ cd todo-msbroker
  ```

2) Set your rabbitmq service and todo service environtments in docker-compose.yml
  ```
  # Rabbitmq environment and expose ports
    environment:
      - RABBITMQ_DEFAULT_USER=$RELAPACE_THIS_WITH_RABBITMQ_USERNAME
      - RABBITMQ_DEFAULT_PASS=$RELAPACE_THIS_WITH_RABBITMQ_PASSWORD
    ports:
      - '5672:5672'
      - '15672:15672'
  
  # Todo service environment and expose port
    environment:
      - HOST=0.0.0.0
      - PORT=8080
      - RABBITMQ_SERVER=amqp://$RELAPACE_THIS_WITH_RABBITMQ_USERNAME:$RELAPACE_THIS_WITH_RABBITMQ_PASSWORD@rabbitmq-service
    ports:
      - '8080:8080'
  ```

3) Make sure you have install docker and docker compose. Then excute this command to build todo-service image
  ```
  $ docker-compose build  
  ```

4) Time start app and test the app, you can use npm rather than pnpm, but I'm suggest to use pnpm
  ```
  $ docker-compose up
  $ pnpm i -D
  $ pnpm i dotenv
  $ pnpm run fn-test
  ```

5) In the end you can verify incoming data in rabbitmq management and the todo api

## API Endpoint
|Endpoint     |Method   | Parameter          | Description                                   |
|:------------|:--------| :------------------| :---------------------------------------------|
| /todo-items | GET     | `application/json` | Return all todos data                         |