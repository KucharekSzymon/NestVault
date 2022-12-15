import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type FileDocument = File & Document;

@Schema()
export class File {
  @Prop({ required: true })
  name: string;
  @Prop({ required: true })
  owner: string;
}

export const FileSchema = SchemaFactory.createForClass(File);
