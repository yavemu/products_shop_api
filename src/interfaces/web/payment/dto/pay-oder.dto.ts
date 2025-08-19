import { ApiProperty } from '@nestjs/swagger';
import {
  IsNumber,
  IsPositive,
  IsString,
  Length,
  Matches,
} from 'class-validator';

export class PayOrderDto {
  @ApiProperty({
    example: 50000,
    description: 'Monto del proveedor de envío',
  })
  @IsNumber()
  @IsPositive()
  deliveryAmount: number;

  @ApiProperty({
    example: 'Interrapidisimo',
    description: 'Nombre del proveedor de envío',
  })
  @IsString()
  deliveryName: string;

  @ApiProperty({
    example: '4242424242424242',
    description: 'Número de tarjeta de crédito',
  })
  @IsString()
  @Length(13, 19, { message: 'La tarjeta debe tener entre 13 y 19 dígitos' })
  @Matches(/^\d+$/, {
    message: 'El número de tarjeta solo debe contener dígitos',
  })
  cardNumber: string;

  @ApiProperty({
    example: '12',
    description: 'Mes de expiración de la tarjeta (MM)',
  })
  @IsString()
  @Length(2, 2, { message: 'El mes debe tener exactamente 2 dígitos' })
  @Matches(/^(0[1-9]|1[0-2])$/, { message: 'El mes debe estar entre 01 y 12' })
  expMonth: string;

  @ApiProperty({
    example: '29',
    description: 'Año de expiración de la tarjeta (YY o YYYY)',
  })
  @IsString()
  @Length(2, 4, { message: 'El año debe tener 2 o 4 dígitos' })
  @Matches(/^\d+$/, { message: 'El año solo debe contener dígitos' })
  expYear: string;

  @ApiProperty({
    example: '123',
    description: 'Código de seguridad de la tarjeta (CVC)',
  })
  @IsString()
  @Length(3, 3, { message: 'El CVC debe tener exactamente 3 dígitos' })
  @Matches(/^\d+$/, { message: 'El CVC solo debe contener dígitos' })
  cvc: string;

  @ApiProperty({
    example: 1,
    description: 'Numero de cuotas de la compra',
  })
  @IsNumber()
  @IsPositive()
  installments: number;

  @ApiProperty({
    example: 'Juan Perez',
    description: 'Nombre del titular de la tarjeta',
  })
  @IsString()
  cardHolder: string;
}
