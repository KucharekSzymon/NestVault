import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(createUserDto: CreateUserDto): Promise<UserDocument> {
    const createdUser = new this.userModel(createUserDto);
    return createdUser.save();
  }
  /**
   * Returns all users
   * @returns Array of all registered users
   */
  async findAll(): Promise<UserDocument[]> {
    return this.userModel.find().exec();
  }
  /**
   * Finding one specific user in database
   * @param id User unique id
   * @returns One user object that match provided id
   */
  async findById(id: string): Promise<UserDocument> {
    return this.userModel.findById(id);
  }
  /**
   * Finding one specific user in database
   * @param email User unique email address
   * @returns One user object that match provided email
   */
  async findByEmail(email: string): Promise<UserDocument> {
    return this.userModel.findOne({ email }).exec();
  }
  /**
   * Finds a specyfic user and replace his data with provided one
   * @param id User unique id
   * @param updateUserDto New user data
   * @returns User object with new data
   */
  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserDocument> {
    return this.userModel
      .findByIdAndUpdate(id, updateUserDto, { new: true })
      .exec();
  }
  /**
   * Remove one user witch id matches provided one
   * @param id User unique id
   * @returns Request to remove user from database
   */
  async remove(id: string): Promise<UserDocument> {
    return this.userModel.findByIdAndDelete(id).exec();
  }
}
