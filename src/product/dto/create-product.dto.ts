import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

export class CreateProductDto {
  @ApiProperty({ example: 'Camiseta blanca' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'Talla M, algodón 100%' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: 35000 })
  @IsInt()
  @Min(0)
  price: number;

  @ApiProperty({ example: 10 })
  @IsInt()
  @Min(0)
  stock: number;
}
