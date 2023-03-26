import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { type } from 'os';
import { User } from 'src/users/schemas/user.schema';
import { File } from 'src/files/schemas/file.schema';

export type ShareUrlDocument = ShareUrl & Document;

@Schema()
export class ShareUrl {
  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'File',
  })
  file: File;

  @Prop()
  description: string;

  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  })
  owner: User;

  @Prop({ type: Date, default: Date.now })
  createTime: Date;

  @Prop({
    type: Date,
    /*expires: 3600,*/ default: Date.now() + 12 * 60 * 60 * 1000, //Date now + 12h
  }) // maybe expires in 1 hour
  expireTime: Date;
}
export const ShareUrlSchema = SchemaFactory.createForClass(ShareUrl);
