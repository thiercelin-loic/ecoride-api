import { Injectable, UnauthorizedException } from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../database/users/users.service';
import * as bcrypt from 'bcryptjs';
import { User, UserRole } from '../database/users/users.entity';
import { CreateUserDto } from './dto/auth.dto';
import { UserWithoutPassword, LoginResponse } from '../types/auth.types';
@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}
  async validateUser(
    email: string,
    password: string,
  ): Promise<UserWithoutPassword | null> {
    const user = await this.usersService.findByEmail(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      const { password: _, ...result } = user;
      return result;
    }
    return null;
  }
  async login(user: UserWithoutPassword): Promise<LoginResponse> {
    const payload = { email: user.mail, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.mail,
        pseudo: user.pseudo,
        role: user.role,
        credits: user.credits,
      },
    };
  }
  async register(createUserDto: CreateUserDto): Promise<LoginResponse> {
    const existingUser = await this.usersService.findByEmail(
      createUserDto.email,
    );
    if (existingUser) {
      throw new UnauthorizedException('User with this email already exists');
    }
    const existingPseudo = await this.usersService.findByPseudo(
      createUserDto.pseudo,
    );
    if (existingPseudo) {
      throw new UnauthorizedException('User with this pseudo already exists');
    }
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(
      createUserDto.password,
      saltRounds,
    );
    const newUser = await this.usersService.create({
      lastname: createUserDto.lastname,
      firstname: createUserDto.firstname,
      mail: createUserDto.email,
      password: hashedPassword,
      pseudo: createUserDto.pseudo,
      role: UserRole.USER,
      credits: 20,
    });
    return this.login(newUser);
  }
  async validateUserById(userId: number): Promise<User | null> {
    return this.usersService.findOne(userId);
  }
}
