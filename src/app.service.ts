import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { RabbitMQService } from './rabbit-mq.service';
import * as fs from 'fs';
import * as path from 'path';
import * as csv from 'csv-parser';
import * as fsExtra from 'fs-extra';

const logger = new Logger('FileUploadService');

@Injectable()
export class AppService {
  constructor(private readonly rabbitMQService: RabbitMQService) {}

  uploadFle(file: Express.Multer.File) {
    let tmp = [];
    if (!file) {
      throw new BadRequestException(
        'Invalid file provided. [X] Allowed filetype: .csv',
      );
    }
    logger.verbose('[201] File uploaded successfully. 📁');

    const fileName = file.filename;
    const filePath = path.join(`upload/${fileName}`);
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (chunk) => {
        tmp.push(chunk);
        if (tmp.length == 100) {
          logger.debug('Reached 100. Sending...');
          this.rabbitMQService.send('append_cars', tmp);
          tmp = [];
        }
      })
      .on('end', () => {
        logger.debug('Sending last rows...');
        this.rabbitMQService.send('append_cars', tmp);
        tmp = [];
        logger.log('[X] DONE ✅');
        fsExtra.emptyDirSync('upload');
        logger.warn('[X] File deleted successfully. ❌');
      })
      .on('error', (err) => {
        console.error(err);
      });
  }
}
