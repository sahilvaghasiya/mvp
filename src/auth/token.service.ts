import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { jwtSecret } from 'src/environment/environment';
import { UserEntity } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { IAuthTokenPayload } from './auth.model';
import { LoginDto } from './dto/auth.dto';

@Injectable()
export class TokenService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async login(loginCredential: LoginDto) {
    loginCredential.email = loginCredential.email.toLowerCase();
    const userData = await this.userService.findUserByEmail(
      loginCredential.email,
    );
    const payload: IAuthTokenPayload = {
      id: userData.id,
      name: userData.name,
      email: userData.email,
      role: userData.role,
    };

    const token = this.jwtService.sign(payload, { secret: jwtSecret });
    await this.userRepository.update(userData.id, {
      jwtToken: token,
    });
    return token;
  }

  decodeToken(token: string): IAuthTokenPayload {
    const decode = this.jwtService.decode(token, {
      json: true,
    });
    return decode as IAuthTokenPayload;
  }
}
