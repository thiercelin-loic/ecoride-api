import { Injectable, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Configuration } from './configuration.entity';
@Injectable()
export class ConfigurationService {
  constructor(
    @Inject('CONFIGURATION_REPOSITORY')
    private configurationRepository: Repository<Configuration>,
  ) {}
  async findAll(): Promise<Configuration[]> {
    return this.configurationRepository.find();
  }
}
