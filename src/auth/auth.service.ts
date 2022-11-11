import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { HashService } from 'src/users/hash.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private hashService: HashService,
    private jwtService: JwtService,
  ) {}
  /**
   * Checking if provided user data is valid with data saved in database
   * @param email User email provided
   * @param pass User password
   * @returns User Obejct or null if credintials dont match
   */
  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.getUserByUsername(email);
    if (user && (await this.hashService.comparePassword(pass, user.password))) {
      return user;
    }
    return null;
  }
  /**
   * Login function with JWT Service
   * @param user Json data with user credientials
   * @returns Access token to autenticate user
   */
  async login(user: any) {
    const payload = { username: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
