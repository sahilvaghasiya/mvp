import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductsService } from 'src/products/products.service';
import { Repository } from 'typeorm';
import { PlaceOrderDto } from './dto/order.dto';
import { OrderEntity } from './entities/order.entity';
import { OrderStatus } from './order.model';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(OrderEntity)
    private orderRepository: Repository<OrderEntity>,
    private readonly productService: ProductsService,
  ) {}

  async placeOrder(userId: number, placeOrderDto: PlaceOrderDto) {
    const product = await this.productService.findOneProduct(
      placeOrderDto.productId,
    );
    const order = this.orderRepository.create({
      user: { id: userId },
      quantity: placeOrderDto.quantity,
      product,
      totalPrice: product.price * placeOrderDto.quantity,
      status: OrderStatus.PREPARING,
    });
    return await this.orderRepository.save(order);
  }

  async findAllOrders() {
    return await this.orderRepository.find();
  }

  async findOrder(id: number) {
    return await this.orderRepository.findOne({
      where: {
        id,
      },
    });
  }

  async findOrdersByUser(userId: number) {
    return await this.orderRepository.find({
      where: {
        user: { id: userId },
      },
    });
  }

  async updateOrderStatus(orderId: number, status: OrderStatus) {
    const order = await this.findOrder(orderId);
    order.status = status;
    return this.orderRepository.save(order);
  }
}
