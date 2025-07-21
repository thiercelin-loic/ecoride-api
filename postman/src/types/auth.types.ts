import { User } from '../database/users/users.entity';
export interface AuthenticatedRequest {
  user: {
    id: number;
    email: string;
    role: string;
    sub: number;
  };
}
export interface JwtPayload {
  email: string;
  sub: number;
  role: string;
  iat?: number;
  exp?: number;
}
export interface LoginResponse {
  access_token: string;
  user: {
    id: number;
    email: string;
    pseudo: string;
    role: string;
    credits: number;
  };
}
export interface UserWithoutPassword extends Omit<User, 'password'> {}
