import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntity } from 'src/products/entities/product.entity';
import { ProductsService } from 'src/products/products.service';
import { UserEntity } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { OrderEntity } from './entities/order.entity';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, ProductEntity, OrderEntity])],
  controllers: [OrdersController],
  providers: [UserService, OrdersService, ProductsService],
})
export class OrdersModule {}
