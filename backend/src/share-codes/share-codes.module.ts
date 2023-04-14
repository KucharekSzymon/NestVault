import { Module } from '@nestjs/common';
import { ShareCodesService } from './share-urls.service';
import { ShareCodesController } from './share-codes.controller';
import { UsersService } from 'src/users/users.service';
import { ShareCode, ShareCodeSchema } from './schemas/share-code.schema';
import { User, UserSchema } from 'src/users/schemas/user.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { File, FileSchema } from 'src/files/schemas/file.schema';
import { FilesService } from 'src/files/files.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ShareCode.name, schema: ShareCodeSchema },
      { name: User.name, schema: UserSchema },
      { name: File.name, schema: FileSchema },
    ]),
  ],
  controllers: [ShareCodesController],
  providers: [ShareCodesService, UsersService, FilesService],
})
export class ShareCodesModule {}
