import { Module } from '@nestjs/common';
import { ShareUrlsService } from './share-urls.service';
import { ShareUrlsController } from './share-urls.controller';
import { UsersService } from 'src/users/users.service';
import { ShareUrl, ShareUrlSchema } from './schemas/share-url.schema';
import { User, UserSchema } from 'src/users/schemas/user.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { File, FileSchema } from 'src/files/schemas/file.schema';
import { FilesService } from 'src/files/files.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ShareUrl.name, schema: ShareUrlSchema },
      { name: User.name, schema: UserSchema },
      { name: File.name, schema: FileSchema },
    ]),
  ],
  controllers: [ShareUrlsController],
  providers: [ShareUrlsService, UsersService, FilesService],
})
export class ShareUrlsModule {}
