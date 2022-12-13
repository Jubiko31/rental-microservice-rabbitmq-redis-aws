import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { AppService } from './app.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { FileValidationPipe } from './pipes/fileSizePipeValidation';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('file/upload')
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
}
