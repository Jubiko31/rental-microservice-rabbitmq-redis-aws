# Microservice with NestJS, RabbitMQ, Redis

## `Stack: NestJS, RabbitMQ, Redis`
![nestjs](https://user-images.githubusercontent.com/53910160/207401771-ce4def86-565f-42ef-b018-310855a374aa.png) &nbsp;
![rabbitmq](https://user-images.githubusercontent.com/53910160/207403205-1c1f9e33-ede5-4e0b-95b8-fe19d5f69861.png) &nbsp;
![redis](https://user-images.githubusercontent.com/53910160/207403277-111bc5e2-3dd8-4e01-b04c-a4df3594b580.png)


Microservice for main rental app: https://github.com/Jubiko31/rental-system-nestjs-docker.
Streaming to add local csv file as cars data to database, download and upload car data as csv file to Amazon S3. Redis for cache management, Bull for repeatable jobs, to clear local download's directory.

## Installation

```bash
$ npm install
```

## Run 
```bash
$ npm run start
$ npm run start:dev
```
 And on main up run:
 ```bash
$ npm run listen
```
