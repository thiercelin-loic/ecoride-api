import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';

interface SSLConfig {
  rejectUnauthorized: boolean;
  cert?: string;
  key?: string;
  ca?: string;
}

export const databaseProviders = [
  {
    provide: 'DATA_SOURCE',
    inject: [ConfigService],
    useFactory: async (configService: ConfigService) => {
      const isProduction =
        configService.get<string>('NODE_ENV') === 'production';

      const useSSL = configService.get<string>('DB_SSL', 'false') === 'true';
      let sslConfig: SSLConfig | false = false;

      if (useSSL) {
        sslConfig = {
          rejectUnauthorized: true,
        };

        const cert = configService.get<string>('DB_SSL_CERT');
        const key = configService.get<string>('DB_SSL_KEY');
        const ca = configService.get<string>('DB_SSL_CA');

        if (cert) sslConfig.cert = cert;
        if (key) sslConfig.key = key;
        if (ca) sslConfig.ca = ca;
      }

      const dataSource = new DataSource({
        type: 'mysql',
        host: configService.get<string>('DB_HOST', 'localhost'),
        port: parseInt(configService.get<string>('DB_PORT', '3306'), 10),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_DATABASE'),
        entities: [
          __dirname + '/cars/cars.entity.{ts,js}',
          __dirname + '/users/users.entity.{ts,js}',
          __dirname + '/brand/brand.entity.{ts,js}',
          __dirname + '/codriving/codriving.entity.{ts,js}',
          __dirname + '/reviews/reviews.entity.{ts,js}',
          __dirname + '/parameters/parameters.entity.{ts,js}',
          __dirname + '/configuration/configuration.entity.{ts,js}',
          __dirname + '/bookings/booking.entity.{ts,js}',
        ],
        synchronize: !isProduction,
        logging: !isProduction ? ['query', 'error'] : ['error'],
        ssl: sslConfig,
        extra: {
          connectionLimit: 10,
          acquireTimeout: 60000,
          timeout: 60000,
          reconnect: true,
        },
      });

      return dataSource.initialize();
    },
  },
];
