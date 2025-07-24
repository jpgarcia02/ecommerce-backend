import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsPositive } from 'class-validator';

export class CreateOrderDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  @IsPositive()
  userId: number;
}
