import { Type } from 'class-transformer';
import {
  IsInt,
  IsPositive,
  IsString,
  IsNotEmpty,
  MaxLength,
  IsOptional,
  IsDate,
} from 'class-validator';

export class Transaction {
  id: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  status: string;

  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  orderId: number;

  @IsString()
  @IsOptional()
  @MaxLength(50)
  providerName?: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  providerTransactionId?: string;

  @IsString()
  @IsOptional()
  @MaxLength(50)
  providerStatus?: string;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  providerStatusMessage?: string;

  @IsString()
  @IsOptional()
  @MaxLength(20)
  providerAmountInCents?: string;

  @IsString()
  @IsOptional()
  @MaxLength(10)
  providerCurrency?: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  providerReference?: string;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  providerCustomerEmail?: string;

  @IsString()
  @IsOptional()
  @MaxLength(50)
  providerPaymentMethodType?: string;

  @IsString()
  @IsOptional()
  @MaxLength(10)
  providerInstallments?: string;

  @IsString()
  @IsOptional()
  @MaxLength(50)
  providerCreatedAtProvider?: string;

  @IsString()
  @IsOptional()
  @MaxLength(50)
  providerFinalizedAtProvider?: string;

  @IsString()
  @IsOptional()
  @MaxLength(50)
  providerCardBrand?: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  providerCardNameMasked?: string;

  @IsString()
  @IsOptional()
  @MaxLength(10)
  providerCardLastFour?: string;

  @IsString()
  @IsOptional()
  @MaxLength(50)
  providerCardType?: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  providerMerchantId?: string;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  providerMerchantName?: string;

  @IsString()
  @IsOptional()
  providerRawFirstResponse?: string;

  @IsString()
  @IsOptional()
  providerRawLastResponse?: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  createdAt?: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  updatedAt?: Date;
}
