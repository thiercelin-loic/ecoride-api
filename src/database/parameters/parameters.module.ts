import { Module } from '@nestjs/common';
import { parametersProviders } from './parameters.providers';
import { ParametersService } from './parameters.service';
import { DatabaseModule } from '../database.module';

@Module({
  imports: [DatabaseModule],
  providers: [...parametersProviders, ParametersService],
  exports: [ParametersService],
})
export class ParametersModule {}
