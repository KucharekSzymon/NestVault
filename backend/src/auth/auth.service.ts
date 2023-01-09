import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import * as argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}
  /**
   * Registering new user to database with hashed password and hashed signed tokens
   * @param createUserDto User object
   * @returns Tokens if user creditentials match or message if not
   */
  async signUp(createUserDto: CreateUserDto): Promise<any> {
    // Check if user exists
    const userExists = await this.usersService.findByEmail(createUserDto.email);
    if (userExists) {
      throw new BadRequestException('User already exists');
    }

    // Hash password
    const hash = await this.hashData(createUserDto.password);
    const newUser = await this.usersService.create({
      ...createUserDto,
      password: hash,
    });
    const tokens = await this.getTokens(newUser._id, newUser.email);
    await this.updateRefreshToken(newUser._id, tokens.refreshToken);
    return tokens;
  }
  /**
   * Logging as user that returns valid user data bundled with JWT tokens
   * @param data Object containing user creditentials
   * @returns User JWT tokens if data match with saved in database
   */
  async signIn(data: AuthDto) {
    // Check if user exists
    const user = await this.usersService.findByEmail(data.email);
    if (!user) throw new BadRequestException('User does not exist');
    const passwordMatches = await argon2.verify(user.password, data.password);
    if (!passwordMatches)
      throw new BadRequestException('Password is incorrect');
    const tokens = await this.getTokens(user._id, user.email);
    await this.updateRefreshToken(user._id, tokens.refreshToken);
    const bundle = {
      name: user.name,
      email: user.email,
      admin: user.isAdmin,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };

    return bundle;
  }
  /**
   * Logout as user thats remove refresh token
   * @param userId User unique id
   */
  async logout(userId: string) {
    this.usersService.update(userId, { refreshToken: null });
    return 'User logged out';
  }
  /**
   * Refreshing user tokens after checking provided token
   * @param userId User unique id
   * @param refreshToken JWT token signed while registering / signing in / refreshing
   * @returns Refreshed tokens
   */
  async refreshTokens(userId: string, refreshToken: string) {
    const user = await this.usersService.findById(userId);
    if (!user || !user.refreshToken)
      throw new ForbiddenException('Access Denied');
    const refreshTokenMatches = await argon2.verify(
      user.refreshToken,
      refreshToken,
    );
    if (!refreshTokenMatches) throw new ForbiddenException('Access Denied');
    const tokens = await this.getTokens(user.id, user.email);
    await this.updateRefreshToken(user.id, tokens.refreshToken);
    return tokens;
  }
  /**
   * Hashing data with argon algorythm
   * @param data Plain data
   * @returns Hashed data
   */
  hashData(data: string) {
    return argon2.hash(data);
  }
  /**
   * Replacing Old user token with new refreshed one
   * @param userId User unique id
   * @param refreshToken User old token
   */
  async updateRefreshToken(userId: string, refreshToken: string) {
    const hashedRefreshToken = await this.hashData(refreshToken);
    await this.usersService.update(userId, {
      refreshToken: hashedRefreshToken,
    });
  }
  /**
   * JWT service that's return valid tokens
   * @param userId User unique id
   * @param email user email address
   * @returns Two valid tokens
   */
  async getTokens(userId: string, email: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
        },
        {
          secret: this.configService.get('jwtSecret'),
          expiresIn: '15m',
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
        },
        {
          secret: this.configService.get('jwtRefreshSecret'),
          expiresIn: '7d',
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }
}
