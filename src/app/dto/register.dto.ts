import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class RegisterDTO {
  @ApiProperty({
    example: 'oding_saloso',
    required: true,
  })
  @IsNotEmpty({ message: 'Username is required' })
  @IsString({ message: 'username must be format string' })
  username: string;

  @ApiProperty({
    example: 'oding_saloso@gmail.com',
    required: true,
  })
  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Email must be format email' })
  @Transform(({ value }) => value.toLowerCase())
  email: string;

  @ApiProperty({
    example: 'password',
    required: true,
  })
  @IsNotEmpty({ message: 'Password is required' })
  password: string;
}
