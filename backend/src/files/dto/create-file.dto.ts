import { ApiProperty } from '@nestjs/swagger';
import mongoose from 'mongoose';

export class CreateFileDto {
  @ApiProperty()
  name: string;
  @ApiProperty()
  owner: mongoose.Schema.Types.ObjectId;
}
