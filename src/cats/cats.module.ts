import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CatSchema } from './schemas/cat.schema';
import { CatsService } from './cats.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: CatsModule.name, schema: CatSchema }]),
  ],
  controllers: [],
  providers: [CatsService],
})
export class CatsModule {}
