import { Injectable, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { User, UserRole, UserType } from './users.entity';
import { UserPreferences } from '../../types/user.types';
export class CreateUserDto {
  @ApiProperty({ description: 'User email address' })
  mail: string;
  @ApiProperty({ description: 'User first name' })
  firstname: string;
  @ApiProperty({ description: 'User last name' })
  lastname: string;
  @ApiProperty({ description: 'User password' })
  password: string;
  @ApiPropertyOptional({ description: 'User phone number' })
  phone?: string;
  @ApiPropertyOptional({ description: 'User address' })
  adress?: string;
  @ApiPropertyOptional({ description: 'User birthday' })
  birthday?: Date;
  @ApiProperty({ description: 'User pseudo/username' })
  pseudo: string;
  @ApiPropertyOptional({ description: 'User profile picture' })
  picture_profil?: Buffer;
  @ApiPropertyOptional({ description: 'User role', enum: UserRole })
  role?: UserRole;
  @ApiPropertyOptional({ description: 'User type', enum: UserType })
  userType?: UserType;
  @ApiPropertyOptional({ description: 'User credit balance' })
  credits?: number;
  @ApiPropertyOptional({ description: 'User preferences' })
  preferences?: UserPreferences;
}
export class UpdateUserDto {
  @ApiPropertyOptional({ description: 'User email address' })
  mail?: string;
  @ApiPropertyOptional({ description: 'User first name' })
  firstname?: string;
  @ApiPropertyOptional({ description: 'User last name' })
  lastname?: string;
  @ApiPropertyOptional({ description: 'User phone number' })
  phone?: string;
  @ApiPropertyOptional({ description: 'User address' })
  adress?: string;
  @ApiPropertyOptional({ description: 'User birthday' })
  birthday?: Date;
  @ApiPropertyOptional({ description: 'User pseudo/username' })
  pseudo?: string;
  @ApiPropertyOptional({ description: 'User profile picture' })
  picture_profil?: Buffer;
  @ApiPropertyOptional({ description: 'User credit balance' })
  credits?: number;
}
@Injectable()
export class UsersService {
  constructor(
    @Inject('USERS_REPOSITORY')
    private usersRepository: Repository<User>,
  ) {}
  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }
  async findOne(id: number): Promise<User | null> {
    return this.usersRepository.findOne({ where: { id } });
  }
  async findById(id: number): Promise<User | null> {
    return this.usersRepository.findOne({ where: { id } });
  }
  async findByEmail(mail: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { mail } });
  }
  async findByPseudo(pseudo: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { pseudo } });
  }
  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = this.usersRepository.create(createUserDto);
    return this.usersRepository.save(user);
  }
  async update(id: number, updateUserDto: UpdateUserDto): Promise<User | null> {
    await this.usersRepository.update(id, updateUserDto);
    return this.findById(id);
  }
  async updateCredits(id: number, credits: number): Promise<User | null> {
    await this.usersRepository.update(id, { credits });
    return this.findById(id);
  }
  async delete(id: number): Promise<boolean> {
    const result = await this.usersRepository.delete(id);
    return (result.affected ?? 0) > 0;
  }
}
