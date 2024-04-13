import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { otpString } from 'src/common/tokens';
import { Repository } from 'typeorm';
import { ChangePasswordDto, CreateUserDto } from './dto/user.dto';
import { UserEntity } from './entities/user.entity';
import { ApprovalStatus, UserRole } from './user.model';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  private hashData(data: string) {
    return bcrypt.hash(data, 10);
  }

  async create(createUserDto: CreateUserDto) {
    const newUser = this.userRepository.create(createUserDto);
    newUser.password = await this.hashData(createUserDto.password);
    newUser.role = createUserDto.role;
    if (createUserDto.role === UserRole.ADMIN)
      newUser.approvalStatus = ApprovalStatus.APPROVED;
    newUser.approvalStatus = ApprovalStatus.PENDING;
    await this.userRepository.save(newUser);
  }

  async findAllUser() {
    return await this.userRepository.find({
      where: {
        role: UserRole.USER,
      },
    });
  }

  async findUserByEmail(email: string) {
    return await this.userRepository.findOne({
      where: {
        email,
      },
    });
  }

  async findOneUser(id: number) {
    return await this.userRepository.findOne({
      where: {
        id,
      },
    });
  }

  async deleteUser(userId: number) {
    await this.userRepository.softDelete(userId);
    return 'User deleted Successfully';
  }

  async verifyChangePassword(userId: number) {
    const existingUser = await this.findOneUser(userId);
    const string = otpString(4);
    existingUser.tokenString = string;
    await this.userRepository.save(existingUser);
    return string;
  }

  async changePassword(id: number, changePasswordDto: ChangePasswordDto) {
    const user = await this.findOneUser(id);
    const passwordHash = await this.hashData(changePasswordDto.newPassword);
    user.password = passwordHash;
    user.tokenString = null;
    await this.userRepository.save(user);
    return user;
  }

  async comparePasswords(Password: string, hashedPassword: string) {
    return bcrypt.compare(Password, hashedPassword);
  }

  async approveUser(userId: number, status: ApprovalStatus) {
    const user = await this.findOneUser(userId);
    user.approvalStatus = status;
    this.userRepository.save(user);
    return 'Your status is updated';
  }
}
