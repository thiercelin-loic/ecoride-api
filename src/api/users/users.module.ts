import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersModule as DatabaseUsersModule } from '../../database/users/users.module';
@Module({
  imports: [DatabaseUsersModule],
  controllers: [UsersController],
})
export class UsersModule {}
