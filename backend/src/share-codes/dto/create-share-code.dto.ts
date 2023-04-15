import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId } from 'class-validator';
import mongoose from 'mongoose';

export class CreateShareCodeDto {
  @ApiProperty()
  @IsMongoId()
  file: mongoose.Schema.Types.ObjectId;

  @ApiProperty()
  description: string;

  @ApiProperty()
  expireTime: Date;
}
