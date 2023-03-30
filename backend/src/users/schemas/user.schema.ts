import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, Model } from 'mongoose';

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

  /**
   * Maximum amount of data that user can have stored in app
   * 20GB * 1024 (MB/GB) * 1024 (KB/MB) * 1024 (B/KB) * 8 (bits/B) = 17179869184 bytes
   */
  @Prop({ default: 20 * 1024 * 1024 * 1024 * 8 })
  storageLimit: number;

  /**
   * Amount of data user has stored in app
   */
  @Prop({ default: 0 })
  storedData: number;
}

export const UserSchema = SchemaFactory.createForClass(User);

/**
 * Sets first created user as an admin
 */
UserSchema.pre('save', async function (next) {
  const model = this.constructor as Model<UserDocument>;
  const count = await model.countDocuments();
  if (count === 0) {
    this.isAdmin = true;
  }
  next();
});
