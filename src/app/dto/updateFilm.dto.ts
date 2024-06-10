import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateFilmDTO {
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

  @ApiProperty({ type: 'string', format: 'binary', required: false })
  @IsOptional()
  image_thumbnail: any;
}
