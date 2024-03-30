import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function SwaggerConfig(app: INestApplication): void {
  // configs
  const document = new DocumentBuilder()
    .setTitle('Nestjs-Virgool')
    .setDescription('APIs related to the backend part of the website.')
    .setVersion('v0.0.1')
    .build();

  const SwaggerDocument = SwaggerModule.createDocument(app, document);
  SwaggerModule.setup('api', app, SwaggerDocument);
}
