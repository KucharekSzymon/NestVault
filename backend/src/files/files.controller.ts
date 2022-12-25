import {
  Controller,
  Post,
  Body,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  Req,
} from '@nestjs/common';
import { FilesService } from './files.service';
import { CreateFileDto } from './dto/create-file.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import { multerOptions } from './common/multer-options';
import { AccessTokenGuard } from 'src/common/guards/accessToken.guard';

@ApiTags('files')
@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @UseGuards(AccessTokenGuard)
  @Post('upload')
  @UseInterceptors(FileInterceptor('file', multerOptions))
  uploadfile(
    @Body() createFileDto: CreateFileDto,
    @UploadedFile() file,
    @Req() req,
  ) {
    createFileDto.name = file.originalname;
    createFileDto.ownerId = req.user['sub'];
    return this.filesService.create(createFileDto);
  }
}
