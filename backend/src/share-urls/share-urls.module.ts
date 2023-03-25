import { Module } from '@nestjs/common';
import { ShareUrlsService } from './share-urls.service';
import { ShareUrlsController } from './share-urls.controller';

@Module({
  providers: [ShareUrlsService],
  controllers: [ShareUrlsController]
})
export class ShareUrlsModule {}
