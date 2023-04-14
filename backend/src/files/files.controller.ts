import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  Req,
  Get,
  Res,
  Param,
  Delete,
} from '@nestjs/common';
import { FilesService } from './files.service';
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
  uploadfile(@UploadedFile() file: Express.Multer.File, @Req() req) {
    const data = {
      name: file.filename,
      owner: req.user._id,
      path: req.user._id,
      type: file.mimetype,
      size: file.size,
    };

    return this.filesService.create(data);
  }

  @UseGuards(AccessTokenGuard)
  @Post('share')
  async shareFile(@Req() req) {
    return await this.filesService.fileShare(
      req.user._id,
      req.body.userId,
      req.body.fileId,
    );
  }

  @UseGuards(AccessTokenGuard)
  @Post('revoke')
  async revoke(@Req() req) {
    return await this.filesService.fileAccessRevoke(
      req.user._id,
      req.body.userId,
      req.body.fileId,
    );
  }

  @UseGuards(AccessTokenGuard)
  @Get('revokeAll/:id')
  revokeAll(@Req() req, @Param('id') fileId: string) {
    return this.filesService.fileAccessRevokeAll(req.user._id, fileId);
  }

  @UseGuards(AccessTokenGuard)
  @Get('mine')
  findOnlyMine(@Req() req) {
    return this.filesService.findByOwner(req.user._id);
  }

  @UseGuards(AccessTokenGuard)
  @Get('shared')
  findShared(@Req() req) {
    return this.filesService.findShared(req.user._id);
  }

  @UseGuards(AccessTokenGuard)
  @Get('sharedWithMe')
  findFilesSharedWithMe(@Req() req) {
    return this.filesService.findFilesSharedWithMe(req.user._id);
  }

  @UseGuards(AccessTokenGuard)
  @Get('sharedTo/:id')
  sharedTo(@Req() req, @Param('id') fileId: string) {
    return this.filesService.fileSharedTo(req.user._id, fileId);
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

  @UseGuards(AccessTokenGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Req() req) {
    return this.filesService.remove(id, req.user._id);
  }
}
