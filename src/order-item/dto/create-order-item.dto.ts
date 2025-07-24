import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsPositive } from 'class-validator';

export class CreateOrderItemDto {
  @ApiProperty({ example: 2 })
  @IsInt()
  @IsPositive()
  quantity: number;

  @ApiProperty({ example: 35000 })
  @IsInt()
  @IsPositive()
  price: number;

  @ApiProperty({ example: 3 })
  @IsInt()
  @IsPositive()
  productId: number;

  @ApiProperty({ example: 5 })
  @IsInt()
  @IsPositive()
  orderId: number;
}
