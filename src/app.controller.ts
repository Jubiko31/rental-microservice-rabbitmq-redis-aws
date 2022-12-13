import {
  Controller,
  Get,
  Header,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { AppService } from './app.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { FileValidationPipe } from './pipes/fileSizePipeValidation';

@Controller('file')
export class AppController {
  constructor(private readonly appService: AppService) {}

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
  async downloadFile(): Promise<any> {
    return this.appService.downloadFile();
  }
}
