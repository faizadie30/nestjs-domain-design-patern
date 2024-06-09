import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class LoginDTO {
  @ApiProperty({
    example: 'oding_saloso@gmail.com',
    required: true,
  })
  @IsNotEmpty({ message: 'Email tidak boleh kosong' })
  @IsEmail({}, { message: 'harus berformat email' })
  @Transform(({ value }) => value.toLowerCase())
  email: string;

  @ApiProperty({
    example: 'password',
    required: true,
  })
  @IsNotEmpty({ message: 'Password wajib di isi' })
  password: string;
}
