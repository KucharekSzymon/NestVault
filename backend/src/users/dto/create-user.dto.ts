import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'Name field cannot be empty' })
  @IsString({ message: 'Name must be a string' })
  name: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Email field cannot be empty' })
  @IsString({ message: 'Email must be a string' })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  email: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Password field cannot be empty' })
  @IsString({ message: 'Password must be a string' })
  password: string;

  @ApiProperty()
  refreshToken?: string;
}
