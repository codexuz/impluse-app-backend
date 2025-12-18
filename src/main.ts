import { NestFactory } from "@nestjs/core";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { ValidationPipe } from "@nestjs/common";
import { AppModule } from "./app.module.js";
import { NestExpressApplication } from "@nestjs/platform-express";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useStaticAssets(join(__dirname, "..", "uploads"), {
    prefix: "/uploads/", // so /uploads/filename.jpg works
  });

  app.useBodyParser("json", { limit: "50mb" });
  app.useBodyParser("urlencoded", { limit: "50mb", extended: true });

  // 2. ✅ Serve Vue static files from 'public'
  app.useStaticAssets(join(__dirname, '..', 'public'));

  app.getHttpAdapter().getInstance().set('*', join(__dirname, '..', 'public'));

  // Enable validation pipes globally
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    })
  );

  // Enable CORS
  app.enableCors({
    origin: "*", // Adjust this to your needs
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  });

  // Swagger documentation setup
  const config = new DocumentBuilder()
    .setTitle("Impulse App API")
    .setDescription("Learning Management System API Documentation")
    .setVersion("1.0")
    .addTag("auth", "Authentication endpoints")
    .addTag("users", "User management")
    .addTag("courses", "Course management")
    .addTag("lessons", "Lesson management")
    .addTag("units", "Unit management")
    .addTag("reading", "Reading exercises")
    .addTag("writing", "Writing exercises")
    .addTag("speaking", "Speaking exercises")
    .addTag("listening", "Listening exercises")
    .addTag("exams", "Exam management")
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config, {
    ignoreGlobalPrefix: false, // Do not ignore global prefix
    deepScanRoutes: true, // Scan all routes deeply
  });
  SwaggerModule.setup("api/docs", app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  app.setGlobalPrefix("api"); // Set global prefix for all routes

  await app.listen(process.env.PORT ?? 3000);
  console.log(`Application is running on: ${await app.getUrl()}`);
  console.log(`API Documentation available at: ${await app.getUrl()}/api/docs`);
}
bootstrap();
