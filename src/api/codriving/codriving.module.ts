import { Module } from '@nestjs/common';
import { CodrivingController } from './codriving.controller';
import { CodrivingModule as DatabaseCodrivingModule } from '../../database/codriving/codriving.module';
@Module({
  imports: [DatabaseCodrivingModule],
  controllers: [CodrivingController],
})
export class CodrivingModule {}
