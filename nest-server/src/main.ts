import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { PrismaService } from "./database/database.service";
import * as cookieParser from "cookie-parser";
import { ConfigService } from "@nestjs/config";
import { NestFastifyApplication } from "@nestjs/platform-fastify";
import { VersioningType } from "@nestjs/common";
import swaggerConfig from "./configs/swagger.config";
import { SwaggerModule } from "@nestjs/swagger";
import { NestExpressApplication } from "@nestjs/platform-express";
//  "socket.io": "^4.7.2",

async function bootstrap() {
	const app = await NestFactory.create<NestExpressApplication>(AppModule);
	const configService = app.get(ConfigService);
	const port = configService.get<number>("PORT");

	app.enableVersioning({
		type: VersioningType.URI,
	});
	const corsOptions = {
		origin: "http://localhost:3000",
		methods: ["GET", "POST"],
		credentials: true,
		transports: ["websocket"],
		port: 3001,
	};
	app.enableCors(corsOptions);
	const document = SwaggerModule.createDocument(app, swaggerConfig);
	SwaggerModule.setup("api", app, document);
	app.set("trust proxy", true);
	app.use(cookieParser("secret"));
	const prismaService = app.get(PrismaService);
	await prismaService.enableShutdownHooks(app);
	await app.listen(3001);
}
bootstrap();
