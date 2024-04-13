import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(private userService: UserService) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userService.findUserByEmail(email);
    if (!user) return 'User not found';
    const isPasswordValid = await this.userService.comparePasswords(
      password,
      user.password,
    );
    if (!isPasswordValid) return 'Invalid Password';
    return user;
  }
}
