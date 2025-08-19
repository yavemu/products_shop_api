import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('products')
export class ProductOrmEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'name', type: 'varchar', length: 100 })
  name: string;

  @Column({ name: 'brand', type: 'varchar', length: 50 })
  brand: string;

  @Column({ name: 'description', type: 'varchar', length: 255, nullable: true })
  description: string;

  @Column({ name: 'stock', type: 'int' })
  stock: number;

  @Column({ name: 'price', type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ name: 'main_image', type: 'varchar', length: 255, nullable: false })
  mainImage: string;

  @Column({
    name: 'thumbnail_image',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  thumbnail: string;
}
