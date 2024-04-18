import {
  Body,
  Controller,
  Delete,
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
import {
  ChangePasswordDto,
  CreateUserDto,
  OldPasswordDto,
} from './dto/user.dto';
import { ApprovalStatus, UserRole } from './user.model';
import { UserService } from './user.service';

@Controller('user')
@ApiTags('User')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('signUp')
  async create(@Body() createUserDto: CreateUserDto) {
    try {
      const existingUser = await this.userService.findUserByEmail(
        createUserDto.email,
      );
      if (existingUser) return 'User Already Exists with this email';
      return this.userService.create(createUserDto);
    } catch (error) {
      return new InternalServerErrorException(error);
    }
  }

  @Post('CreateUserByAdmin')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async createUserByAdmin(
    @Req() req: any,
    @Body() createUserDto: CreateUserDto,
  ) {
    try {
      const adminId = req.user.id;
      const admin = await this.userService.findOneUser(adminId);
      if (admin.role !== UserRole.ADMIN)
        'You are not authorized to create User';
      const existingUser = await this.userService.findUserByEmail(
        createUserDto.email,
      );
      if (existingUser) return 'User Already Exists with this email';
      return this.userService.create(createUserDto);
    } catch (error) {
      return new InternalServerErrorException(error);
    }
  }

  @Get('AllUsers')
  async findAllUsers() {
    try {
      return this.userService.findAllUser();
    } catch (error) {
      return new InternalServerErrorException(error);
    }
  }

  @Get('userInfo')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async find(@Req() req: any) {
    try {
      const userId = req.user.id;
      return await this.userService.findOneUser(userId);
    } catch (error) {
      return new InternalServerErrorException(error);
    }
  }

  @Post('verifyOldPassword')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async verifyOldPassword(
    @Req() req: any,
    @Body() oldPasswordDto: OldPasswordDto,
  ) {
    try {
      const userId = req.user.id;
      const user = await this.userService.findOneUser(userId);
      if (!user) return 'User not found';
      const hashedPassword = await this.userService.comparePasswords(
        oldPasswordDto.oldPassword,
        user.password,
      );
      if (!hashedPassword) return 'Old password is Invalid';
      return await this.userService.verifyChangePassword(userId);
    } catch (error) {
      return new InternalServerErrorException(error);
    }
  }

  @Patch('changePassword')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async changePassword(
    @Req() req: any,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    try {
      const userId = req.user.id;
      const user = await this.userService.findOneUser(userId);
      if (!user) return 'User not found';
      else if (changePasswordDto.changePasswordString !== user.tokenString)
        return 'Old password is Invalid';
      else if (
        changePasswordDto.newPassword !== changePasswordDto.confirmPassword
      )
        return 'New password and Confirm Password not match';
      return await this.userService.changePassword(userId, changePasswordDto);
    } catch (error) {
      return new InternalServerErrorException(error);
    }
  }

  @Post('approveUser')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiParam({
    name: 'userId',
    required: true,
    description: 'Enter UserId',
  })
  @ApiQuery({
    name: 'status',
    enum: ApprovalStatus,
    description: 'Select user approval status',
  })
  async approveUser(
    @Req() req: any,
    @Param('userId') userId: number,
    @Query('status') status: ApprovalStatus,
  ) {
    try {
      const adminId = req.user.id;
      const user = await this.userService.findOneUser(adminId);
      if (user.role !== UserRole.ADMIN)
        return 'You are not authorized to approve the Users';
      return await this.userService.approveUser(userId, status);
    } catch (error) {
      return new InternalServerErrorException(error);
    }
  }

  @Delete('deleteUSerByAdmin')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiParam({
    name: 'userId',
    required: true,
    description: 'Enter UserId',
    type: Number,
  })
  async deleteUserByAdmin(@Req() req: any, @Param('userId') userId: number) {
    try {
      const id = req.user.id;
      const admin = await this.userService.findOneUser(id);
      if (admin.role !== UserRole.ADMIN)
        return 'You are not authorized to delete the user';
      return await this.userService.deleteUser(userId);
    } catch (error) {
      return new InternalServerErrorException(error);
    }
  }
}
