import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('API Documentation') // Set the title of the API documentation.
    .setDescription('This is the backend api server for the interview project') // Set the description of the API documentation.
    .setVersion('1.0') // Set the version of the API documentation.
    .addTag('smart-contract, blockchain, api') // Add a tag to categorize the API documentation.
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.listen(3020);
}
bootstrap();
