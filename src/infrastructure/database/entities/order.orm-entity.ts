import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { OrderDetailOrmEntity } from './order-detail.orm.entity';
import { TransactionOrmEntity } from './transaction.orm-entity';

export enum OrderStatusEnum {
  PREORDENED = 'preordered',
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
}

@Entity('orders')
export class OrderOrmEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    name: 'customer_name',
    type: 'varchar',
    length: 100,
    nullable: false,
  })
  customerName: string;

  @Column({
    name: 'customer_email',
    type: 'varchar',
    length: 100,
    nullable: false,
  })
  customerEmail: string;

  @Column({
    name: 'customer_phone',
    type: 'varchar',
    length: 20,
    nullable: false,
  })
  customerPhone: string;

  @Column({
    name: 'shipping_address',
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  shippingAddress: string;

  @Column({ name: 'total_amount', type: 'decimal', precision: 10, scale: 2 })
  totalAmount: number;

  @Column({
    name: 'status',
    type: 'enum',
    enum: OrderStatusEnum,
    default: OrderStatusEnum.PENDING,
  })
  status: OrderStatusEnum;

  @CreateDateColumn({ name: 'created_at', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @OneToMany(() => OrderDetailOrmEntity, (orderDetail) => orderDetail.order, {
    cascade: true,
    eager: true,
  })
  orderDetails: OrderDetailOrmEntity[];

  @OneToMany(() => TransactionOrmEntity, (trans) => trans.order, {
    cascade: true,
    eager: true,
  })
  transactions: TransactionOrmEntity[];
}
