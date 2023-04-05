import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class AuthDto {
  @ApiProperty()
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @IsNotEmpty({ message: 'Email field cannot be empty' })
  @IsString({ message: 'Email must be a string' })
  email: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Password field cannot be empty' })
  @IsString({ message: 'Password must be a string' })
  password: string;
}
