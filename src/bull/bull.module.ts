import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { BullFileProducerService } from '../producers/file.producer.service';
import { BullFileConsumerService } from 'src/consumers/file.consumer.service';

@Module({
  imports: [
    BullModule.forRoot('bull-jobs', {
      redis: {
        host: 'localhost',
        port: 6379,
      },
    }),
    BullModule.registerQueue({
      configKey: 'bull-jobs',
      name: 'cleanup-operation',
    }),
  ],
  providers: [BullFileProducerService, BullFileConsumerService],
  exports: [BullFileProducerService],
})
export class RedisBullModule {}
