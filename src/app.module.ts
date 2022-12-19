import { Module, CacheModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RabbitMQModule } from './rabbit-mq.module';
import * as redisStore from 'cache-manager-redis-store';

@Module({
  imports: [
    RabbitMQModule,
    CacheModule.register({
      isGlobal: true,
      store: redisStore,
      ttl: 0,
      host: 'localhost',
      port: 6379,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
