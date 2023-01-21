import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
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
  @Prop({ required: true })
  path: string;
  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] })
  readPerm: Event[];
  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] })
  writePerm: Event[];
}

export const FileSchema = SchemaFactory.createForClass(File);
