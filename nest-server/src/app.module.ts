import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { DatabaseModule } from "./database/database.module";
import { AuthModule } from "./auth/auth.module";
import { PrismaService } from "./database/database.service";
import { MessagesModule } from "./messages/messages.module";
import { RoomsModule } from "./rooms/rooms.module";
import { AuthMiddleware } from "./middleware/auth-middleware";
import { AuthController } from "./auth/auth.controller";
import { JwtModule, JwtService } from "@nestjs/jwt";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { PassportModule } from "@nestjs/passport";
import { getJWTConfig } from "./configs/jwt.config";
import { RoomsController } from "./rooms/rooms.controller";

@Module({
	imports: [
		DatabaseModule,
		AuthModule,
		MessagesModule,
		RoomsModule,
		PassportModule.register({
			session: false,
		}),
		JwtModule.registerAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: getJWTConfig,
		}),
	],
	providers: [PrismaService, JwtService],
})
export class AppModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
		consumer.apply(AuthMiddleware).forRoutes(RoomsController);
	}
}
