import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CatsModule } from './cats/cats.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://root:pass12345@localhost:27017'),
    CatsModule,
    UsersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
