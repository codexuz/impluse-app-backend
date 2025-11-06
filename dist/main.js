import { NestFactory } from "@nestjs/core";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { ValidationPipe } from "@nestjs/common";
import { AppModule } from "./app.module.js";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.useStaticAssets(join(__dirname, "..", "uploads"), {
        prefix: "/uploads/",
    });
    app.useBodyParser("json", { limit: "50mb" });
    app.useBodyParser("urlencoded", { limit: "50mb", extended: true });
    app.useGlobalPipes(new ValidationPipe({
        whitelist: true,
        transform: true,
    }));
    app.enableCors({
        origin: "*",
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
        credentials: true,
    });
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
        ignoreGlobalPrefix: false,
        deepScanRoutes: true,
    });
    SwaggerModule.setup("api/docs", app, document, {
        swaggerOptions: {
            persistAuthorization: true,
        },
    });
    app.setGlobalPrefix("api");
    await app.listen(process.env.PORT ?? 3000);
    console.log(`Application is running on: ${await app.getUrl()}`);
    console.log(`API Documentation available at: ${await app.getUrl()}/api/docs`);
}
bootstrap();
//# sourceMappingURL=main.js.map