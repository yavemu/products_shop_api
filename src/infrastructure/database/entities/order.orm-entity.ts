import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('orders')
export class OrderOrmEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  quantity: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ type: 'int' })
  productId: number;

  @Column({ name: 'customer_name', type: 'varchar', length: 100 })
  customerName: number;
}
