import { UserRole } from 'src/user/user.model';

export interface IUserLogin {
  email: string;
  password: string;
}

export interface IAuthTokenPayload {
  id: number;
  name: string;
  email: string;
  role: UserRole;
}
