import {
  Body,
  Controller,
  InternalServerErrorException,
  Post,
} from '@nestjs/common';

import { ApiTags } from '@nestjs/swagger';
import { ApprovalStatus } from 'src/user/user.model';
import { UserService } from 'src/user/user.service';
import { LoginDto } from './dto/auth.dto';
import { TokenService } from './token.service';

@ApiTags('Login')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private readonly tokenService: TokenService,
  ) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    try {
      const user = await this.userService.findUserByEmail(loginDto.email);
      if (!user) return 'Invalid Email';
      const isPasswordValid = await this.userService.comparePasswords(
        loginDto.password,
        user.password,
      );
      if (!isPasswordValid) return 'Invalid Password';
      if (
        user.approvalStatus === ApprovalStatus.PENDING ||
        user.approvalStatus === ApprovalStatus.REJECTED
      )
        return 'Please verify your account';
      return await this.tokenService.login(loginDto);
    } catch (error) {
      return new InternalServerErrorException(error);
    }
  }
}
