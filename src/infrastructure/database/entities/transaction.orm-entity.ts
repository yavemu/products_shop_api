import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { OrderOrmEntity } from './order.orm-entity';
import { Exclude } from 'class-transformer';

@Entity('transactions')
export class TransactionOrmEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'order_id', type: 'int' })
  orderId: number;

  @ManyToOne(() => OrderOrmEntity, (order) => order.orderDetails)
  @JoinColumn({ name: 'order_id' })
  order: OrderOrmEntity;

  @Column({
    name: 'status',
    type: 'varchar',
    length: 50,
    nullable: false,
    default: 'PENDING',
  })
  status: string;

  @Column({
    name: 'provider_name',
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  providerName?: string;

  @Column({
    name: 'provider_transaction_id',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  providerTransactionId?: string;

  @Column({
    name: 'provider_status',
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  providerStatus?: string;

  @Column({
    name: 'provider_status_message',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  providerStatusMessage?: string;

  @Column({
    name: 'provider_amount_in_cents',
    type: 'varchar',
    length: 20,
    nullable: true,
  })
  providerAmountInCents?: string;

  @Column({
    name: 'provider_currency',
    type: 'varchar',
    length: 10,
    nullable: true,
  })
  providerCurrency?: string;

  @Column({
    name: 'provider_reference',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  providerReference?: string;

  @Column({
    name: 'provider_customer_email',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  providerCustomerEmail?: string;

  @Column({
    name: 'provider_payment_method_type',
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  providerPaymentMethodType?: string;

  @Column({
    name: 'provider_installments',
    type: 'varchar',
    length: 10,
    nullable: true,
  })
  providerInstallments?: string;

  @Column({
    name: 'provider_created_at_provider',
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  providerCreatedAtProvider?: string;

  @Column({
    name: 'provider_finalized_at_provider',
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  providerFinalizedAtProvider?: string;

  @Column({
    name: 'provider_card_brand',
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  providerCardBrand?: string;

  @Column({
    name: 'provider_card_name_masked',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  providerCardNameMasked?: string;

  @Column({
    name: 'provider_card_last_four',
    type: 'varchar',
    length: 10,
    nullable: true,
  })
  providerCardLastFour?: string;

  @Column({
    name: 'provider_card_type',
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  providerCardType?: string;

  @Column({
    name: 'provider_merchant_id',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  providerMerchantId?: string;

  @Column({
    name: 'provider_merchant_name',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  providerMerchantName?: string;

  @Column({
    name: 'provider_raw_first_response',
    type: 'text',
    nullable: true,
  })
  @Exclude()
  providerRawFirstResponse?: string;

  @Column({
    name: 'provider_raw_last_response',
    type: 'text',
    nullable: true,
  })
  @Exclude()
  providerRawLastResponse?: string;

  @CreateDateColumn({ name: 'created_at', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
