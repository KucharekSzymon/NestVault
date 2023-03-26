import { Module } from '@nestjs/common';
import { ShareUrlsService } from './share-urls.service';
import { ShareUrlsController } from './share-urls.controller';
import { UsersService } from 'src/users/users.service';
import { ShareUrl, ShareUrlSchema } from './schemas/share-url.schema';
import { User, UserSchema } from 'src/users/schemas/user.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ShareUrl.name, schema: ShareUrlSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [ShareUrlsController],
  providers: [ShareUrlsService, UsersService],
})
export class ShareUrlsModule {}
