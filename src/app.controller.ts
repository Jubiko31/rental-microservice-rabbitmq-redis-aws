import {
  Controller,
  Get,
  Header,
  Post,
  UploadedFile,
  UseInterceptors,
  CACHE_MANAGER,
  Inject,
  Param,
  Res,
} from '@nestjs/common';
import { Cache } from 'cache-manager';
import { AppService } from './app.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { FileValidationPipe } from './pipes/fileSizePipeValidation';
import { v4 as uuidv4 } from 'uuid';

interface FileData {
  fileurl: string;
  status: string;
}

@Controller('file')
export class AppController {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly appService: AppService,
  ) {}

  @Post('/upload')
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: FileValidationPipe,
      storage: diskStorage({
        destination: './upload',
      }),
    }),
  )
  uploadFle(@UploadedFile() file: Express.Multer.File): any {
    this.appService.uploadFle(file);
  }

  @Get('/download')
  @Header('Content-Type', 'text/csv')
  async downloadFile() {
    const sessionId: string = uuidv4();
    const filename: string = uuidv4();
    const filedata: FileData = await this.appService.downloadFile(filename);
    await this.cacheManager.set(sessionId, filedata);

    const data = await this.cacheManager.get(sessionId);
    return data;
  }

  @Get('/:id')
  async getRedisData(@Param('id') id: string) {
    const fileData = await this.cacheManager.get(id);
    return fileData;
  }

  @Get('download/:fileId')
  async downlod(@Param('fileId') filename: string, @Res() response) {
    return await this.appService.download(filename, response);
  }
}
