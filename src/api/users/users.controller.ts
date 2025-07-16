import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  NotFoundException,
  ConflictException,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import {
  UsersService,
  CreateUserDto,
  UpdateUserDto,
} from '../../database/users/users.service';
import { User } from '../../database/users/users.entity';
@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'Return all users.', type: [User] })
  async findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }
  @Get('search/pseudo/:pseudo')
  @ApiOperation({ summary: 'Find user by pseudo' })
  @ApiParam({ name: 'pseudo', description: 'User pseudo' })
  @ApiResponse({
    status: 200,
    description: 'Return user with the specified pseudo.',
    type: User,
  })
  @ApiResponse({ status: 404, description: 'User not found.' })
  async findByPseudo(@Param('pseudo') pseudo: string): Promise<User> {
    const user = await this.usersService.findByPseudo(pseudo);
    if (!user) {
      throw new NotFoundException(`User with pseudo ${pseudo} not found`);
    }
    return user;
  }
  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({
    status: 200,
    description: 'Return user with the specified ID.',
    type: User,
  })
  @ApiResponse({ status: 404, description: 'User not found.' })
  async findById(@Param('id', ParseIntPipe) id: number): Promise<User> {
    const user = await this.usersService.findById(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }
  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({
    status: 201,
    description: 'User created successfully.',
    type: User,
  })
  @ApiResponse({
    status: 409,
    description: 'User with this email already exists.',
  })
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.usersService.findByEmail(
      createUserDto.mail,
    );
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }
    const existingPseudo = await this.usersService.findByPseudo(
      createUserDto.pseudo,
    );
    if (existingPseudo) {
      throw new ConflictException('User with this pseudo already exists');
    }
    return this.usersService.create(createUserDto);
  }
  @Put(':id')
  @ApiOperation({ summary: 'Update user by ID' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({
    status: 200,
    description: 'User updated successfully.',
    type: User,
  })
  @ApiResponse({ status: 404, description: 'User not found.' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    const user = await this.usersService.update(id, updateUserDto);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }
  @Delete(':id')
  @ApiOperation({ summary: 'Delete user by ID' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({ status: 200, description: 'User deleted successfully.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  async delete(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ message: string }> {
    const deleted = await this.usersService.delete(id);
    if (!deleted) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return { message: 'User deleted successfully' };
  }
}
