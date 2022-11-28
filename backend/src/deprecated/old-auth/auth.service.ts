import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from '../old-users/users.service';
import { JwtService } from '@nestjs/jwt';
import { HashService } from '../old-users/hash.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private hashService: HashService,
    private jwtService: JwtService,
  ) {}
  /**
   * Checking if provided user data is valid with data saved in database
   * @param username Username provided
   * @param pass User password
   * @returns User Obejct or null if credintials dont match
   */
  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.getUserByUsername(username);
    if (user && (await this.hashService.comparePassword(pass, user.password))) {
      return user;
    } else {
      throw new BadRequestException({
        message: 'You have entered a wrong username or password',
      });
    }
    return null;
  }
  /**
   * Login function with JWT Service
   * @param user Json data with user credientials
   * @returns Access token to autenticate user
   */
  async login(user: any) {
    const payload = { username: user.username, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
