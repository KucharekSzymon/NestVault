import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CatsModule } from './cats/cats.module';
import { Cat, CatSchema } from './cats/schemas/cat.schema';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: Cat.name,
        useFactory: () => {
          const schema = CatSchema;
          schema.pre('save', () => {
            console.log('Hello from pre save at Cat schema');
          });
          return schema;
        },
      },
    ]),
    MongooseModule.forRoot('mongodb://root:pass12345@localhost:27017/'),
    CatsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
