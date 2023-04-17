import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isNumberString } from 'class-validator';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './schemas/user.schema';
import * as argon2 from 'argon2';

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
   * Returns all users without one that ask for list
   * @param userId User id that will be exluded from list
   * @returns List of all users wihout one proviced
   */
  async findAllButMe(userId: string) {
    let query = this.userModel.find();

    if (userId) {
      query = query.where('_id').ne(userId);
    }

    const users = await query.exec();
    return users.map((user) => ({
      _id: user._id,
      name: `${user.name} - ${user.email}`,
    }));
  }

  async findAllAdmin() {
    const users = await this.userModel.find();

    return users.map((user) => ({
      _id: user._id,
      isAdmin: user.isAdmin,
      combo: `${user.name} - ${user.email}`,
      name: user.name,
      email: user.email,
      storedData: user.storedData,
      storageLimit: user.storageLimit,
    }));
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

  async updateData(id: string, updateUserDto: UpdateUserDto, reqId: string) {
    const user = await this.userModel.findById(id);
    if (user == null) throw new NotFoundException('User not found');
    const requestor = await this.userModel.findById(reqId);
    if (requestor._id.toString() == user._id.toString() || requestor.isAdmin) {
      const newUser = user;
      if (updateUserDto.name) newUser.name = updateUserDto.name;
      if (updateUserDto.password)
        newUser.password = await argon2.hash(updateUserDto.password);
      return this.userModel
        .findByIdAndUpdate(id, newUser, { new: true })
        .exec();
    } else
      throw new UnauthorizedException('You dont have permission to do that!');
  }

  /**
   * Remove one user witch id matches provided one
   * @param id User unique id
   * @returns Request to remove user from database
   */
  async remove(id: string, reqId: string): Promise<UserDocument> {
    const requestor = await this.userModel.findById(reqId);
    if (requestor.isAdmin || requestor._id.toString() == id.toString()) {
      const admins = await this.userModel.find({ isAdmin: true });
      if (admins.length === 1 && admins[0]._id.equals(id))
        throw new UnauthorizedException(
          'You cannot delete this user, he is an only administrator',
        );
      return this.userModel.findByIdAndDelete(id).exec();
    } else
      throw new UnauthorizedException('You dont have permission to do that!');
  }

  /**
   * Updates an amount of data user has stored on his account
   * @param userId user idectyficator
   * @param fileSize file size in bytes
   */
  async uploadOfFile(userId, fileSize) {
    const user = await this.userModel.findById(userId);
    user.storedData += fileSize;
    if (user.storageLimit <= user.storedData)
      throw new ForbiddenException(
        'Sorry, you have reached your storage limit. You have used up all the available space in your account. Free up some space by deleting files or asking administrator for more space.',
      );
    return this.userModel
      .findByIdAndUpdate(userId, user)
      .setOptions({ overwrite: true, new: true });
  }

  /**
   * Updates an amount of data user has stored on his account after file deletion
   * @param userId user idectyficator
   * @param fileSize file size in bytes
   */
  async removalOfFile(userId, fileSize) {
    const user = await this.userModel.findById(userId);

    user.storedData -= fileSize;
    if (user.storedData < 0) user.storedData = 0;
    return this.userModel
      .findByIdAndUpdate(userId, user)
      .setOptions({ overwrite: true, new: true });
  }

  /**
   * Admin function to change storage limit of user
   * @param userId user id
   * @param reqId administrator id
   * @param newStorageLimit newly set limit
   * @returns updated user object with new set limits
   */
  async updateStoragelimit(userId, reqId, newStorageLimit: number) {
    const user = await this.userModel.findById(userId);
    const requestor = await this.userModel.findById(reqId);
    if (user == null || requestor == null)
      throw new NotFoundException('User not found');
    if (!isNumberString(newStorageLimit))
      throw new BadRequestException('Provided value is not an number');

    user.storageLimit = newStorageLimit;
    return this.userModel
      .findByIdAndUpdate(userId, user)
      .setOptions({ overwrite: true, new: true });
  }

  /**
   * Function for checking user storage limits / how much user store / space left
   * @param userId User id
   * @returns
   */
  async storage(userId: string) {
    const user = await this.userModel.findById(userId);
    const data = {
      spaceLimit: user.storageLimit,
      spaceUsed: user.storedData,
      spaceLeft: (user.storedData / user.storageLimit) * 100,
    };
    return data;
  }

  /**
   * Admin function for promoting / demoting another user to admin role
   * @param userId User identificator
   * @param isAdmin Sets user isAdmin property
   * @returns Updated user object with new set role
   */
  async changeRole(userId, isAdmin: boolean) {
    const user = await this.userModel.findById(userId);
    if (user == null) throw new NotFoundException('User not found');
    const admins = await this.userModel.find({ isAdmin: true });
    if (!isAdmin && admins.length === 1 && admins[0]._id.equals(userId))
      throw new UnauthorizedException(
        'You cannot demote this user, he is an only administrator',
      );

    user.isAdmin = isAdmin;
    return this.userModel
      .findByIdAndUpdate(userId, user)
      .setOptions({ overwrite: true, new: true });
  }
}
