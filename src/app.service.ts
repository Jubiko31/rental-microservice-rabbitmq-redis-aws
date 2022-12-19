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

  async downloadFile(filename: string) {
    let is_downloaded = false;
    let offset = 0;

    const filePath = path.join(`download/${filename}.csv`);
    const filedata = {
      fileurl: filePath,
      status: 'In Progress',
    };

    const writeStream = fs
      .createWriteStream(filePath, { flags: 'w' })
      .on('error', (err) => {
        console.log(err);
      })
      .on('finish', () => {
        logger.debug('Successfully downloaded file.');
      });

    writeStream.write('id,name,licence_plate');

    while (!is_downloaded) {
      const data = await this.rabbitMQService.send('load_cars', offset);

      if (!data.length) {
        is_downloaded = true;
        filedata.status = 'DONE';
        break;
      }

      const CSVString = this.convertToCsv(data);
      if (CSVString) {
        logger.debug('Downloading...');
        writeStream.write(CSVString);
        offset += 200;
      }
    }

    writeStream.end();
    return filedata;
  }

  convertToCsv = function (data) {
    const csvRows = [''];
    const headers = Object.keys(data[0]);

    for (const row of data) {
      const values = headers.map((header) => {
        const val = row[header];
        return val;
      });

      csvRows.push(values.join(','));
    }
    return csvRows.join('\n');
  };

  async download(filename: string, res) {
    try {
      return res.download(`download/${filename}`);
    } catch (err) {
      console.error(err);
    }
  }
}
