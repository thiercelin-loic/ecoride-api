import { Injectable, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Parameters } from './parameters.entity';
@Injectable()
export class ParametersService {
  constructor(
    @Inject('PARAMETERS_REPOSITORY')
    private parametersRepository: Repository<Parameters>,
  ) {}
  async findAll(): Promise<Parameters[]> {
    return this.parametersRepository.find();
  }
}
