import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { CatsModule } from './cats/cats.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    /*MongooseModule.forRootAsync({ //temp wylaczenie zeby zrobic od nowa wedlug docsow
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => ({
        uri: config.get('mongodb.uri'),
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }),
      inject: [ConfigService],
    }),*/
    MongooseModule.forRoot('mongodb://root:pass12345@localhost:27017'), // to zamiany na env value
    CatsModule,
    AuthModule,
    UsersModule,
  ],
})
export class AppModule {}
