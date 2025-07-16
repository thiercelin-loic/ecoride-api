import { DataSource } from 'typeorm';
import { Parameters } from './parameters.entity';
export const parametersProviders = [
  {
    provide: 'PARAMETERS_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(Parameters),
    inject: ['DATA_SOURCE'],
  },
];
