import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, Min } from 'class-validator';

export class PlaceOrderDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  productId: number;

  @ApiProperty()
  @IsNumber()
  @Min(1)
  @IsNotEmpty()
  quantity: number;
}
