import {
  Controller,
  Post,
  UploadedFile,
  Body,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { FilesService } from './files.service';
import { CreateFileDto } from './dto/create-file.dto';
import {
  FileFieldsInterceptor,
  FileInterceptor,
} from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { Helper } from './name-helper';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('upload')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        {
          name: 'file',
          maxCount: 2,
        },
      ],
      {
        storage: diskStorage({
          destination: Helper.destinationPath,
          filename: Helper.customFileName,
        }),
      },
    ),
  )
  uploadfile(@UploadedFiles() files): string {
    return 'success';
  }
}
