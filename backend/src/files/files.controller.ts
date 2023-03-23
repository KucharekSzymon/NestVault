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
    @UploadedFile() file: Express.Multer.File,
    @Req() req,
  ) {
    console.log(file);
    createFileDto.name = file.originalname;
    createFileDto.owner = req.user._id;
    createFileDto.path = req.user._id;

    return this.filesService.create(createFileDto);
  }

  @UseGuards(AccessTokenGuard)
  @Post('share')
  async shareFile(@Req() req) {
    console.log(req.body);
    return await this.filesService.fileShare(
      req.user._id,
      req.body.userId,
      req.body.fileId,
    );
  }

  @UseGuards(AccessTokenGuard)
  @Get('onlyMine')
  findOnlyMine(@Req() req) {
    return this.filesService.findByOwner(req.user._id);
  }

  @UseGuards(AccessTokenGuard)
  @Get('preview/:id')
  async stream(
    @Res() response: Response,
    @Req() req,
    @Param('id') fileId: string,
  ) {
    const file = await this.filesService.imageStream(fileId, req.user._id);
    file.pipe(response);
  }

  @UseGuards(AccessTokenGuard)
  @Get('download/:id')
  async buffer(
    @Res() response: Response,
    @Req() req,
    @Param('id') fileId: string,
  ) {
    const file = await this.filesService.imageBuffer(fileId, req.user._id);
    response.send(file);
  }
}
