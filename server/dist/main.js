"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const swagger_1 = require("@nestjs/swagger");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors({
        origin: '*',
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
        credentials: true,
    });
    const config = new swagger_1.DocumentBuilder()
        .setTitle('Push Protect Core Gateway API')
        .setDescription('REST API and WebSocket gateway for Push Protect smart women safety platform. Manages idempotent emergency activations, BLE hardware telemetry, Response Confidence Envelopes, and multi-tier circle escalation.')
        .setVersion('1.0.0')
        .addTag('Emergency Incidents', 'Idempotent SOS triggers, delivery tracking, and timeline')
        .addTag('Wearable Hardware', 'BLE pairing, battery telemetry, and diagnostics')
        .addTag('Trusted Circle Contacts', 'Responder escalation order and invitation validation')
        .addTag('Safe Journey Automated Escort', 'Automated check-ins and grace period escalations')
        .addTag('Authentication & Identity', 'Privacy consent settings and user authentication')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api/v1/docs', app, document);
    const port = process.env.PORT || 3001;
    await app.listen(port);
    console.log(`\n======================================================`);
    console.log(`🛡️  Push Protect NestJS API running on http://localhost:${port}`);
    console.log(`📖  Swagger OpenAPI Documentation: http://localhost:${port}/api/v1/docs`);
    console.log(`======================================================\n`);
}
bootstrap();
//# sourceMappingURL=main.js.map