import {
  Controller,
  Post,
  UploadedFile,
  Body,
  UseInterceptors,
  UploadedFiles,
  Req,
} from '@nestjs/common';
import { FilesService } from './files.service';
import { CreateFileDto } from './dto/create-file.dto';
import {
  FileFieldsInterceptor,
  FileInterceptor,
} from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { ApiTags } from '@nestjs/swagger';
import { multerOptions } from './common/multer-options';

@ApiTags('files')
@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('upload')
  //@Post('/profile/:id/picture')
  @UseInterceptors(FileInterceptor('file', multerOptions))
  uploadfile(
    @Body() createFileDto: CreateFileDto,
    @UploadedFiles() files,
    @Req() req,
  ) {
    console.log(req.body);
    return this.filesService.create(createFileDto);
  }
}
