import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';
import { ProductEntity } from './entities/product.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(ProductEntity)
    private productRepository: Repository<ProductEntity>,
  ) {}

  async create(createProductDto: CreateProductDto) {
    const newProduct = this.productRepository.create(createProductDto);
    return await this.productRepository.save(newProduct);
  }

  async findAllProducts() {
    return await this.productRepository.find();
  }

  async findOneProduct(id: number) {
    return await this.productRepository.findOne({
      where: {
        id,
      },
    });
  }

  async updateProduct(id: number, updateProductDto: UpdateProductDto) {
    const product = await this.findOneProduct(id);
    if (!product) return 'Product not found';
    await this.productRepository.update(id, updateProductDto);
    return product;
  }

  async removeProduct(id: number) {
    const product = await this.productRepository.softDelete(id);
    if (!product) return 'Product not found';
    return 'Product deleted Successfuly';
  }
}
