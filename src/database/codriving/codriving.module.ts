import { Module } from '@nestjs/common';
import { codrivingProviders } from './codriving.providers';
import { CodrivingService } from './codriving.service';
import { DatabaseModule } from '../database.module';

@Module({
  imports: [DatabaseModule],
  providers: [...codrivingProviders, CodrivingService],
  exports: [CodrivingService, ...codrivingProviders],
})
export class CodrivingModule {}
