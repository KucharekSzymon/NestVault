import {
  Controller,
  Req,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { AccessTokenGuard } from 'src/common/guards/accessToken.guard';
import { ApiTags } from '@nestjs/swagger';
import { ShareCodesService } from './share-urls.service';
import { CreateShareCodeDto } from './dto/create-share-code.dto';

@ApiTags('share-codes')
@Controller('share-codes')
export class ShareCodesController {
  constructor(private readonly shareCodesService: ShareCodesService) {}

  @UseGuards(AccessTokenGuard)
  @Post('new')
  create(@Body() createShareCodeDto: CreateShareCodeDto, @Req() req) {
    const data = {
      file: createShareCodeDto.file,
      description: createShareCodeDto.description,
      owner: req.user._id,
      expireTime: createShareCodeDto.expireTime,
    };

    return this.shareCodesService.create(data, req.user._id);
  }

  @UseGuards(AccessTokenGuard)
  @Get('mine')
  findOnlyMine(@Req() req) {
    return this.shareCodesService.findByOwner(req.user._id);
  }

  @UseGuards(AccessTokenGuard)
  @Get(':id')
  activate(@Param('id') id: string, @Req() req) {
    return this.shareCodesService.activate(id, req.user._id);
  }
}
