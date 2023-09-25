import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { PrismaService } from "../database/database.service";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { PassportModule } from "@nestjs/passport/dist/passport.module";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { JwtModule, JwtService } from "@nestjs/jwt";
import { getJWTConfig } from "src/configs/jwt.config";
import { DatabaseModule } from "src/database/database.module";

@Module({
	providers: [AuthService, PrismaService, JwtStrategy, JwtService],
	controllers: [AuthController],
	imports: [
		ConfigModule,
		DatabaseModule,
		PassportModule,
		PassportModule.register({
			session: false,
		}),
		JwtModule.register({
			global: true,
			secret: "secret",
			signOptions: { expiresIn: "24h" },
		}),
	],
})
export class AuthModule {}
