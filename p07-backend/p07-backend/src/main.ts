import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Global prefix
  const apiPrefix = configService.get<string>('API_PREFIX', 'frequencia/api');
  app.setGlobalPrefix(apiPrefix);
  app.enableCors();

  // Global filters and interceptors
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new TransformInterceptor());

  // Swagger/OpenAPI
  const swaggerConfig = new DocumentBuilder()
    .setTitle(configService.get<string>('SWAGGER_TITLE', 'P07 API'))
    .setDescription(configService.get<string>('SWAGGER_DESCRIPTION', 'API documentation'))
    .setVersion(configService.get<string>('SWAGGER_VERSION', '1.0.0'))
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  const swaggerPath = configService.get<string>('SWAGGER_PATH', 'api/docs');
  SwaggerModule.setup(swaggerPath, app, document);

  // Start server
  const port = configService.get<number>('PORT', 3000);
  await app.listen(port);
  console.log(`✅ Application is running on: http://localhost:${port}/${apiPrefix}`);
  console.log(`📚 Swagger available at: http://localhost:${port}/${swaggerPath}`);
}

bootstrap().catch((error) => {
  console.error('❌ Bootstrap error:', error);
  process.exit(1);
});
