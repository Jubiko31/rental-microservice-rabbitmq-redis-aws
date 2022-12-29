# Microservice with NestJS, RabbitMQ, + AWS S3

## `Stack: NestJS, RabbitMQ, Redis, Bull, AWS S3`
![nestjs](https://user-images.githubusercontent.com/53910160/207401771-ce4def86-565f-42ef-b018-310855a374aa.png) &nbsp;
![rabbitmq](https://user-images.githubusercontent.com/53910160/207403205-1c1f9e33-ede5-4e0b-95b8-fe19d5f69861.png) &nbsp;
![redis](https://user-images.githubusercontent.com/53910160/207403277-111bc5e2-3dd8-4e01-b04c-a4df3594b580.png) &nbsp;
![bull](https://user-images.githubusercontent.com/53910160/209970205-d4e56c8d-ae48-435f-a562-99b6c86da46a.png) &nbsp;
![s3](https://user-images.githubusercontent.com/53910160/209970744-30ed2eda-61cc-495c-8c4e-d6d9d988d41c.png)


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
