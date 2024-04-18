import {
  Body,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UserRole } from 'src/user/user.model';
import { UserService } from 'src/user/user.service';
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';
import { ProductsService } from './products.service';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
    private readonly userService: UserService,
  ) {}

  @Post('createProduct')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async createProduct(
    @Req() req: any,
    @Body() createProductDto: CreateProductDto,
  ) {
    try {
      const userId = req.user.id;
      const user = await this.userService.findOneUser(userId);
      if (user.role !== UserRole.ADMIN)
        return 'You are not authorized to create the product';
      return await this.productsService.create(createProductDto);
    } catch (error) {
      return new InternalServerErrorException(error);
    }
  }

  @Get('getAllProducts')
  async findAll() {
    try {
      return this.productsService.findAllProducts();
    } catch (error) {
      return new InternalServerErrorException(error);
    }
  }

  @Get('getProduct/:id')
  async getProductById(@Param('id') id: number) {
    try {
      const product = this.productsService.findOneProduct(id);
      if (!product) return 'Product not found';
      return product;
    } catch (error) {
      return new InternalServerErrorException(error);
    }
  }

  @Patch('updateProduct/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async updateProduct(
    @Req() req: any,
    @Param('id') id: number,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    try {
      const userId = req.user.id;
      const user = await this.userService.findOneUser(userId);
      if (user.role !== UserRole.ADMIN)
        return 'You are not authorized to update the product';
      return this.productsService.updateProduct(id, updateProductDto);
    } catch (error) {
      return new InternalServerErrorException(error);
    }
  }

  @Delete('deleteProduct/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async deleteProduct(@Req() req: any, @Param('id') id: number) {
    try {
      const userId = req.user.id;
      const user = await this.userService.findOneUser(userId);
      if (user.role !== UserRole.ADMIN)
        return 'You are not authorized to delete the product';
      return this.productsService.removeProduct(id);
    } catch (error) {
      return new InternalServerErrorException(error);
    }
  }
}
