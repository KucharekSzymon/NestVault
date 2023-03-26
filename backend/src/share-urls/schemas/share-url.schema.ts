import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { User } from 'src/users/schemas/user.schema';

@Schema()
export class ShareUrl {
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

  @Prop({ type: Date, /*expires: 3600,*/ default: Date.now }) // maybe expires in 1 hour
  expireTime: Date;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] })
  authorizedUsers: User[];
}
export const ShareUrlSchema = SchemaFactory.createForClass(ShareUrl);
