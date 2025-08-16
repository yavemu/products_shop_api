import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('products')
export class ProductOrmEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @Column({ length: 50 })
  brand: string;

  @Column({ length: 255, nullable: true })
  description: string;

  @Column({ type: 'int' })
  stock: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column()
  mainImage: string;

  @Column({ nullable: true })
  thumbnail: string;
}
