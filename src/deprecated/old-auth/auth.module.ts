import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalStrategy } from './strategies/local.strategy';
import { UsersModule } from '../old-users/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User } from 'src/old-users/entities/user.entity';
import { UserSchema } from 'src/old-users/schemas/user.schema';
import { UsersService } from 'src/old-users/users.service';
import { HashService } from 'src/old-users/hash.service';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('jwtSecret'),
        expiresIn: '60d',
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [AuthService, UsersService, LocalStrategy, HashService],
  controllers: [AuthController],
})
export class AuthModule {}
