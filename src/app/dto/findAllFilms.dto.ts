import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class FindAllFilmsDTO {
  @ApiProperty({
    example: 1,
    required: false,
    type: 'number',
  })
  @IsOptional()
  page: string;

  @ApiProperty({
    example: 10,
    required: false,
    type: 'number',
  })
  @IsOptional()
  limit: number;
}
