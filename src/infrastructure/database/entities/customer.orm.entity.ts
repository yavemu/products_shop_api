import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { OrderOrmEntity } from './order.orm-entity';

@Entity('customers')
export class CustomerOrmEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    name: 'name',
    type: 'varchar',
    length: 100,
    nullable: false,
  })
  name: string;

  @Column({
    name: 'email',
    type: 'varchar',
    length: 100,
    nullable: false,
    unique: true,
  })
  email: string;

  @Column({
    name: 'phone',
    type: 'varchar',
    length: 20,
    nullable: false,
  })
  phone: string;

  @OneToMany(() => OrderOrmEntity, (order) => order.customer)
  orders: OrderOrmEntity[];
}
