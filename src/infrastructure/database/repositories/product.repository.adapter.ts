import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductRepositoryPort } from '../../../domain/products/ports/product-repository.port';
import { Product } from '../../../domain/products/entities/product.entity';
import { ProductOrmEntity } from '../entities/product.orm-entity';

@Injectable()
export class ProductRepositoryAdapter implements ProductRepositoryPort {
  constructor(
    @InjectRepository(ProductOrmEntity)
    private readonly repo: Repository<ProductOrmEntity>,
  ) {}

  async save(product: Product): Promise<Product> {
    const entity = this.repo.create(product);
    const saved = await this.repo.save(entity);
    return saved;
  }

  async findAll(): Promise<Product[]> {
    return this.repo.find();
  }

  async findById(id: number): Promise<Product | null> {
    return this.repo.findOne({ where: { id } });
  }

  async count(): Promise<number> {
    return await this.repo.count();
  }
}
