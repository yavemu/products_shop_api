import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductRepositoryPort } from '../../../core/domain/products/ports/product-repository.port';
import { Product } from '../../../core/domain/products/entities/product.entity';
import { ProductOrmEntity } from '../entities/product.orm-entity';

@Injectable()
export class ProductRepositoryAdapter implements ProductRepositoryPort {
  constructor(
    @InjectRepository(ProductOrmEntity)
    private readonly repository: Repository<ProductOrmEntity>,
  ) {}

  async save(product: Product): Promise<Product> {
    const entity = this.repository.create(product);
    const saved = await this.repository.save(entity);
    return saved;
  }

  async findAll(): Promise<Product[]> {
    return this.repository.find();
  }

  async findById(id: number): Promise<Product | null> {
    return this.repository.findOne({ where: { id } });
  }

  async count(): Promise<number> {
    return await this.repository.count();
  }
}
