import {
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ProductsService } from 'src/products/products.service';
import { UserRole } from 'src/user/user.model';
import { UserService } from 'src/user/user.service';
import { PlaceOrderDto } from './dto/order.dto';
import { OrderStatus } from './order.model';
import { OrdersService } from './orders.service';

@ApiTags('Orders')
@Controller('orders')
export class OrdersController {
  constructor(
    private readonly userService: UserService,
    private readonly productService: ProductsService,
    private readonly ordersService: OrdersService,
  ) {}

  @Post('placeOrder')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async placeOrder(@Req() req: any, @Body() placeOrderDto: PlaceOrderDto) {
    try {
      const userId = req.tokenData.id;
      const user = await this.userService.findOneUser(userId);
      if (!user) return 'User not Found';
      const product = await this.productService.findOneProduct(
        placeOrderDto.productId,
      );
      if (!product) return 'Product not Found';
      return this.ordersService.placeOrder(userId, placeOrderDto);
    } catch (error) {
      return new InternalServerErrorException(error);
    }
  }

  @Get('findAllOrders')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async findAllOrders(@Req() req: any) {
    try {
      const userId = req.tokenData.id;
      const user = await this.userService.findOneUser(userId);
      if (user.role !== UserRole.ADMIN) return 'Only Admin can see all orders';
      return this.ordersService.findAllOrders();
    } catch (error) {
      return new InternalServerErrorException(error);
    }
  }

  @Get('findOrderById')
  async findOrderById(@Param('id') id: number) {
    try {
      return this.ordersService.findOrder(id);
    } catch (error) {
      return new InternalServerErrorException(error);
    }
  }

  @Get('FindOrderByUser')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiParam({
    name: 'userId',
    required: true,
    description: 'Enter UserId',
    type: Number,
  })
  async findOrderByUser(@Req() req: any, @Param('userId') userId: number) {
    try {
      const id = req.tokenData.id;
      const user = await this.userService.findOneUser(id);
      if (user.role !== UserRole.ADMIN)
        return 'Only Admin can see all orders of user';
      return await this.ordersService.findOrdersByUser(id);
    } catch (error) {
      return new InternalServerErrorException(error);
    }
  }

  @Patch('updateOrderStatus')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiParam({
    name: 'orderId',
    required: true,
    description: 'Enter orderId',
    type: Number,
  })
  @ApiQuery({
    name: 'status',
    enum: OrderStatus,
    description: 'Select order status',
  })
  async updateOrderStatus(
    @Req() req: any,
    @Param('orderId') orderId: number,
    @Query('status') status: OrderStatus,
  ) {
    try {
      const adminId = req.tokenData.id;
      const user = await this.userService.findOneUser(adminId);
      if (user.role !== UserRole.ADMIN)
        return 'You are not authorized to update order status';
      return await this.ordersService.updateOrderStatus(orderId, status);
    } catch (error) {
      return new InternalServerErrorException(error);
    }
  }
}
