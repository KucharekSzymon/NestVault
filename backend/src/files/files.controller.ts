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
import { MyNewFileInterceptor } from './common/custom-file-interceptor';

@ApiTags('files')
@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('upload')
  //@UseInterceptors(FileInterceptor('file', multerOptions))
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: function (req, file, cb) {
          console.log(req);
          cb(null, `./upload/${req.params.name}/`);
        },
        // tslint:disable-next-line: variable-name
        /*filename: (_req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          return cb(null, `${randomName}-${file.originalname}`);
        },*/
      }),
    }),
  )
  uploadfile(
    @Body() createFileDto: CreateFileDto,
    @UploadedFiles() files,
    @Req() req,
  ) {
    console.log(req.body);
    return this.filesService.create(createFileDto);
  }
}
