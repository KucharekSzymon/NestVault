import { ApiProperty } from '@nestjs/swagger';
import mongoose from 'mongoose';

export class CreateFileDto {
  @ApiProperty()
  name: string;
  @ApiProperty()
  owner: mongoose.Schema.Types.ObjectId;
  @ApiProperty()
  path: string;
  @ApiProperty()
  authorizedUsers?: mongoose.Schema.Types.ObjectId[];
}
