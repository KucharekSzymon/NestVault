import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { JwtModule } from '@nestjs/jwt';
import { HashService } from './hash.service';
import { AuthService } from 'src/old-auth/auth.service';
import { JwtStrategy } from 'src/old-auth/strategies/jwt.strategy';
import { LocalStrategy } from 'src/old-auth/strategies/local.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('jwtSecret'),
        expiresIn: '60d',
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [
    UsersService,
    HashService,
    AuthService,
    JwtStrategy,
    LocalStrategy,
  ],
  controllers: [UsersController],
})
export class UsersModule {}
