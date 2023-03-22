import {
  Controller,
  Post,
  Body,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  Req,
  Get,
  StreamableFile,
  Res,
  Param,
} from '@nestjs/common';
import { FilesService } from './files.service';
import { CreateFileDto } from './dto/create-file.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import { multerOptions } from './common/multer-options';
import { AccessTokenGuard } from 'src/common/guards/accessToken.guard';
import { Response } from 'express';

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
    createFileDto.owner = req.user._id;
    createFileDto.path = req.user._id;

    return this.filesService.create(createFileDto);
  }

  @UseGuards(AccessTokenGuard)
  @Get()
  findAll() {
    return this.filesService.findAll();
  }
  @UseGuards(AccessTokenGuard)
  @Get('onlyMine')
  findOnlyMine(@Req() req) {
    return this.filesService.findByOwner(req.user._id);
  }

  @Get('buffer')
  buffer(@Res() response: Response) {
    const file = this.filesService.imageBuffer();
    response.send(file);
  }
  @UseGuards(AccessTokenGuard)
  @Get('stream/:id')
  async stream(
    @Res() response: Response,
    @Req() req,
    @Param('id') fileId: string,
  ) {
    const file = await this.filesService.imageStream(req.user._id, fileId);
    file.pipe(response);
  }

  @Get('streamable')
  streamable(@Res({ passthrough: true }) response: Response) {
    const file = this.filesService.fileStream();
    // or
    // const file = this.downloadService.fileBuffer();
    return new StreamableFile(file); // 👈 supports Buffer and Stream
  }
}
