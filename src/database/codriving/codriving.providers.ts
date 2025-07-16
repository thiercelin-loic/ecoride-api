import { DataSource } from 'typeorm';
import { Codriving } from './codriving.entity';
export const codrivingProviders = [
  {
    provide: 'CODRIVING_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Codriving),
    inject: ['DATA_SOURCE'],
  },
];
