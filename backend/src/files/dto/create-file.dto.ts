import { ApiProperty } from '@nestjs/swagger';
import { ArrayUnique, IsNotEmpty } from 'class-validator';
import mongoose from 'mongoose';

export class CreateFileDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  owner: mongoose.Schema.Types.ObjectId;

  @ApiProperty()
  path: string;

  @ApiProperty()
  @ArrayUnique()
  authorizedUsers?: mongoose.Schema.Types.ObjectId[];
}
