import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { FilesModule } from './files/files.module';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    ConfigModule.forRoot(/*{ cache: true }*/),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get('mongodbUri'),
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    AuthModule,
    FilesModule,
    MulterModule.register({
      dest: './upload',
    }),
  ],
})
export class AppModule {}
