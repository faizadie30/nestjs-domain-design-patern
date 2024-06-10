import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateBodyFilmDTO {
  @ApiProperty({
    example: 'menuju tak terbatas dan melampauinya',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({
    example: 'lalalalalalala',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({
    example: 'http://example.com/image.jpg',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  image_thumbnail: any;
}
