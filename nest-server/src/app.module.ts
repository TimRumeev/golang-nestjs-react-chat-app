import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { DatabaseModule } from "./database/database.module";
import { AuthModule } from "./auth/auth.module";
import { PrismaService } from "./database/database.service";
import { AuthMiddleware } from "./middleware/auth-middleware";
import { AuthController } from "./auth/auth.controller";
import { JwtModule, JwtService } from "@nestjs/jwt";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { PassportModule } from "@nestjs/passport";
import { getJWTConfig } from "./configs/jwt.config";
import { ChatRoomsModule } from "./chat-rooms/chat-rooms.module";
import { AppService } from "./app.service";
import { AppController } from "./app.controller";
import { ChatRoomsController } from "./chat-rooms/chat-rooms.controller";

@Module({
	imports: [
		DatabaseModule,
		AuthModule,
		PassportModule.register({
			session: false,
		}),
		JwtModule.registerAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: getJWTConfig,
		}),
		ChatRoomsModule,
	],
	providers: [PrismaService, AppService, ConfigService],
	controllers: [AppController],
})
export class AppModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
		consumer.apply(AuthMiddleware).forRoutes(ChatRoomsController);
	}
}
