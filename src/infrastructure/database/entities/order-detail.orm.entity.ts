import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { OrderOrmEntity } from './order.orm.entity';
import { ProductOrmEntity } from './product.orm-entity';
import { Exclude } from 'class-transformer';

@Entity('order_details')
export class OrderDetailOrmEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'quantity', type: 'int' })
  quantity: number;

  @Column({ name: 'unit_price', type: 'decimal', precision: 10, scale: 2 })
  unitPrice: number;

  @Column({ name: 'total_price', type: 'decimal', precision: 10, scale: 2 })
  totalPrice: number;

  @Column({ name: 'order_id', type: 'int' })
  orderId: number;

  @Column({ name: 'product_id', type: 'int' })
  productId: number;

  @ManyToOne(() => OrderOrmEntity, (order) => order.orderDetails)
  @JoinColumn({ name: 'order_id' })
  @Exclude()
  order: OrderOrmEntity;

  @ManyToOne(() => ProductOrmEntity, (product) => product.id, {
    eager: true,
  })
  @JoinColumn({ name: 'product_id' })
  product: ProductOrmEntity;
}
