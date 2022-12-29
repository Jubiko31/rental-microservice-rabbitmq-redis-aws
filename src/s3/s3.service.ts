import { Injectable, Logger } from '@nestjs/common';
import * as fs from 'fs';

import {
  S3Client,
  PutObjectCommand,
  PutObjectCommandInput,
  PutObjectCommandOutput,
} from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class S3Service {
  private logger = new Logger(S3Service.name);
  private region: string;
  private s3: S3Client;

  constructor(private configService: ConfigService) {
    this.region = this.configService.get<string>('S3_REGION');
    this.s3 = new S3Client({
      region: this.region,
      credentials: {
        // eslint-disable-next-line prettier/prettier
        secretAccessKey: this.configService.get<string>('AWS_S3_SECRET_ACCESS_KEY'),
        accessKeyId: this.configService.get<string>('AWS_S3_ACCESS_KEY_ID'),
      },
    });
  }

  async uploadFileToS3(file: string, key: string) {
    const fileContent = fs.readFileSync(file);
    const bucket = this.configService.get<string>('S3_BUCKET');
    const input: PutObjectCommandInput = {
      Body: fileContent,
      Bucket: bucket,
      Key: key,
      ContentType: 'text/csv',
      ACL: 'public-read',
    };
    try {
      const response: PutObjectCommandOutput = await this.s3.send(
        new PutObjectCommand(input),
      );
      if (response.$metadata.httpStatusCode === 200) {
        return `https://${bucket}.s3.${this.region}.amazonaws.com/${key}`;
      }
      throw new Error('Image was NOT saved to s3 bucket.');
    } catch (err) {
      this.logger.error('Cannot save file into s3');
      throw err;
    }
  }
}
