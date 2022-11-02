import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CatSchema } from './schemas/cat.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: CatsModule.name, schema: CatSchema }]),
  ],
  controllers: [],
  providers: [],
})
export class CatsModule {}
