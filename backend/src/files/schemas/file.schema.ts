import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { min } from 'class-validator';
import mongoose from 'mongoose';
import { User } from 'src/users/schemas/user.schema';

export type FileDocument = File & Document;

@Schema()
export class File {
  @Prop({ required: true })
  name: string;

  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  })
  owner: User;

  @Prop()
  type: string;

  @Prop({ default: 0 })
  size: number;

  @Prop({ type: Date, default: Date.now })
  createTime: Date;

  @Prop({ required: true })
  path: string;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] })
  authorizedUsers: User[];
}

export const FileSchema = SchemaFactory.createForClass(File);
