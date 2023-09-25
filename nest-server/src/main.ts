import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { PrismaService } from "./database/database.service";
import * as cookieParser from "cookie-parser";
import { ConfigService } from "@nestjs/config";
import { NestFastifyApplication } from "@nestjs/platform-fastify";

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	app.use(cookieParser("secret"));
	const prismaService = app.get(PrismaService);
	await prismaService.enableShutdownHooks(app);

	let configService: ConfigService;

	await app.listen(3001);
}
bootstrap();
