import {
  Controller,
  Req,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { AccessTokenGuard } from 'src/common/guards/accessToken.guard';
import { ApiTags } from '@nestjs/swagger';
import { ShareUrlsService } from './share-urls.service';
import { CreateShareUrlDto } from './dto/create-share-url.dto';
import { UpdateShareUrlDto } from './dto/update-share-url.dto';

@ApiTags('share-urls')
@Controller('share-urls')
export class ShareUrlsController {
  constructor(private readonly shareUrlsService: ShareUrlsService) {}

  @UseGuards(AccessTokenGuard)
  @Post('new')
  create(@Body() createShareUrlDto: CreateShareUrlDto, @Req() req) {
    createShareUrlDto.owner = req.user._id;

    return this.shareUrlsService.create(createShareUrlDto, req.user._id);
  }

  @UseGuards(AccessTokenGuard)
  @Get('mine')
  findOnlyMine(@Req() req) {
    return this.shareUrlsService.findByOwner(req.user._id);
  }

  @UseGuards(AccessTokenGuard)
  @Get(':id')
  findById(@Param('id') id: string) {
    // return this.usersService.findById(id);
  }
}
