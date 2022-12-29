import { Module } from '@nestjs/common';
import { S3Service } from './s3.service';
import { ConfigService } from '@nestjs/config';

@Module({
  providers: [S3Service, ConfigService],
  exports: [S3Service],
})
export class S3Module {}
