import { Module } from '@nestjs/common';
import { configurationProviders } from './configuration.providers';
import { ConfigurationService } from './configuration.service';
import { DatabaseModule } from '../database.module';

@Module({
  imports: [DatabaseModule],
  providers: [...configurationProviders, ConfigurationService],
  exports: [ConfigurationService],
})
export class ConfigurationModule {}
