import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  /**
   * Unique user id
   */
  _id: mongoose.Schema.Types.ObjectId;
  /**
   * User first and last name
   */
  @Prop({ required: true })
  name: string;
  /**
   * User unique signing mail
   */
  @Prop({ required: true, unique: true })
  email: string;
  /**
   * User (mostly) hashed password
   */
  @Prop({ required: true })
  password: string;
  /**
   *
   */
  @Prop({ default: false })
  isAdmin: boolean;
  /**
   * User hashed autentication token
   */
  @Prop()
  refreshToken: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
