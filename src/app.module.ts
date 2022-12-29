import { Module, CacheModule, OnModuleInit, Logger } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RabbitMQModule } from './rabbit-mq.module';
import { S3Module } from './s3/s3.module';
import { S3Service } from './s3/s3.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { RedisBullModule } from './bull/bull.module';
import { BullFileProducerService } from './producers/file.producer.service';
import * as redisStore from 'cache-manager-redis-store';

@Module({
  imports: [
    S3Module,
    RabbitMQModule,
    RedisBullModule,
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
    CacheModule.register({
      isGlobal: true,
      store: redisStore,
      ttl: 0,
      host: 'localhost',
      port: 6379,
    }),
  ],
  controllers: [AppController],
  providers: [AppService, ConfigService, S3Service],
})
export class AppModule implements OnModuleInit {
  private readonly logger = new Logger(AppModule.name);

  constructor(
    private readonly bullFileProducerService: BullFileProducerService,
  ) {}

  async onModuleInit() {
    this.logger.debug('ConsumerApplication started listening on port 3001');
    await this.bullFileProducerService.cleanUpDir();
    this.logger.debug('Download Files cleanup service launched successfully.');
  }
}
