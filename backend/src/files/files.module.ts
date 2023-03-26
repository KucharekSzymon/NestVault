import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { File, FileSchema } from './schemas/file.schema';
import { User, UserSchema } from 'src/users/schemas/user.schema';
import { UsersService } from 'src/users/users.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: File.name, schema: FileSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [FilesController],
  providers: [FilesService, UsersService],
})
export class FilesModule {}
