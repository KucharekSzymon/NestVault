import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { HashService } from './hash.service';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private hashService: HashService,
  ) {}
  /**
   * Find user by his username
   * @param username Name of searched user
   * @return {UserDocument} Found user
   */
  async getUserByUsername(username: string) {
    return this.userModel.findOne({ username }).exec();
  }
  /**
   * Registering user in database
   * @param createUserDto User credentials
   * @returns Saving user to databse
   */
  async registerUser(createUserDto: CreateUserDto) {
    /**
     * Vaidates Dto
     */
    const createUser = new this.userModel(createUserDto);
    /**
     * User const for checking if he exists
     */
    const user = await this.getUserByUsername(createUser.username);
    if (user) {
      throw new BadRequestException({
        message: 'Email already taken',
      });
    }

    createUser.password = await this.hashService.hashPassword(
      createUser.password,
    );

    return createUser.save();
  }
}
