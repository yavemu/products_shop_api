import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { DeliveryStatusEnum } from '../../../core/domain/deliveries/entities/delivery.entity';

@Entity('deliveries')
export class DeliveryOrmEntity {
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
    name: 'tracking_number',
    type: 'varchar',
    length: 100,
    nullable: false,
  })
  trackingNumber: string;

  @Column({
    name: 'address',
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  address: string;

  @Column({
    name: 'fee',
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: false,
  })
  fee: number;

  @Column({
    name: 'status',
    type: 'enum',
    enum: DeliveryStatusEnum,
    default: DeliveryStatusEnum.PENDING,
  })
  status: DeliveryStatusEnum;
}
