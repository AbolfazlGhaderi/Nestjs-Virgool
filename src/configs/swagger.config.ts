import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { SecuritySchemeObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';

export function SwaggerConfig(app: INestApplication): void {
  // configs
  const document = new DocumentBuilder()
    .setTitle('Nestjs-Virgool')
    .setDescription('APIs related to the backend part of the website.')
    .setVersion('v0.0.1')
    .addBearerAuth(swaggerAuthConfig(),'Authorization')
    .build();

  const SwaggerDocument = SwaggerModule.createDocument(app, document);
  SwaggerModule.setup('api', app, SwaggerDocument);
}

function swaggerAuthConfig(): SecuritySchemeObject {
  return {
    type: 'http',
    bearerFormat: 'JWT',
    in: 'header',
    scheme: 'bearer',
  };
}
