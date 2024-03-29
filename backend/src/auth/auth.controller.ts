import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { AccessTokenGuard } from 'src/common/guards/accessToken.guard';
import { RefreshTokenGuard } from 'src/common/guards/refreshToken.guard';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  signup(@Body() createUserDto: CreateUserDto) {
    return this.authService.signUp(createUserDto);
  }

  @Post('signin')
  signin(@Body() data: AuthDto) {
    return this.authService.signIn(data);
  }

  @UseGuards(AccessTokenGuard)
  @Get('logout')
  logout(@Req() req) {
    this.authService.logout(req.user._id);
  }

  @UseGuards(RefreshTokenGuard)
  @Get('refresh')
  refreshTokens(@Req() req) {
    const userId = req.user.sub;
    const refreshToken = req.user.refreshToken;

    return this.authService.refreshTokens(userId, refreshToken);
  }

  @UseGuards(AccessTokenGuard)
  @Get('role')
  roleCheck(@Req() req) {
    return this.authService.checkRole(req.user._id);
  }
}
