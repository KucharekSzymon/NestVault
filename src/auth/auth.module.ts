import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalStrategy } from './local.strategy';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';
import { MongooseModule } from '@nestjs/mongoose';
import { User } from 'src/users/user.entity';
import { UserSchema } from 'src/users/schemas/user.schema';
import { UsersService } from 'src/users/users.service';
import { HashService } from 'src/users/hash.service';

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
    JwtModule.register({
      secret: 'asd', // do zamiany na ev value
      signOptions: { expiresIn: '60d' },
    }),
  ],
  providers: [AuthService, UsersService, LocalStrategy, HashService],
  controllers: [AuthController],
})
export class AuthModule {}
