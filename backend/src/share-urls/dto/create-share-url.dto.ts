import { ApiProperty } from '@nestjs/swagger';
import mongoose from 'mongoose';

export class CreateShareLinkDto {
  @ApiProperty()
  description: string;

  @ApiProperty()
  owner: mongoose.Schema.Types.ObjectId;

  @ApiProperty()
  createTime: Date;

  @ApiProperty()
  expireTime: Date;

  @ApiProperty()
  authorizedUsers?: mongoose.Schema.Types.ObjectId[];
}
