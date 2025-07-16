import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  const config = new DocumentBuilder()
    .setTitle('EcoRide API')
    .setDescription('API documentation for EcoRide application')
    .setVersion('1.0')
    .addTag('users', 'User operations')
    .addTag('cars', 'Car operations')
    .addTag('reviews', 'Review operations')
    .addTag('codriving', 'Codriving operations')
    .addTag('search', 'Search operations across all entities')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
