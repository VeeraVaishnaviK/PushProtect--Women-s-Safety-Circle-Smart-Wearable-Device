import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS for client web app & mobile capacitor
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // Swagger OpenAPI Documentation
  const config = new DocumentBuilder()
    .setTitle('Push Protect Core Gateway API')
    .setDescription(
      'REST API and WebSocket gateway for Push Protect smart women safety platform. Manages idempotent emergency activations, BLE hardware telemetry, Response Confidence Envelopes, and multi-tier circle escalation.'
    )
    .setVersion('1.0.0')
    .addTag('Emergency Incidents', 'Idempotent SOS triggers, delivery tracking, and timeline')
    .addTag('Wearable Hardware', 'BLE pairing, battery telemetry, and diagnostics')
    .addTag('Trusted Circle Contacts', 'Responder escalation order and invitation validation')
    .addTag('Safe Journey Automated Escort', 'Automated check-ins and grace period escalations')
    .addTag('Authentication & Identity', 'Privacy consent settings and user authentication')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/v1/docs', app, document);

  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`\n======================================================`);
  console.log(`🛡️  Push Protect NestJS API running on http://localhost:${port}`);
  console.log(`📖  Swagger OpenAPI Documentation: http://localhost:${port}/api/v1/docs`);
  console.log(`======================================================\n`);
}

bootstrap();
