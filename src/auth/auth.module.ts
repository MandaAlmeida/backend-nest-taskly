import { Env } from "@/env";
import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtModule, JwtModuleOptions } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { JwtStrategy } from "./jwt.strategy";

@Module({
    imports: [
        PassportModule,
        JwtModule.registerAsync({
            inject: [ConfigService],
            global: true,
            useFactory: (config: ConfigService<Env, true>): JwtModuleOptions => ({
                privateKey: Buffer.from(config.get<string>("JWT_PRIVATE_KEY", { infer: true }), "base64"),
                publicKey: Buffer.from(config.get<string>("JWT_PUBLIC_KEY", { infer: true }), "base64"),
                signOptions: {
                    algorithm: "RS256",
                }

            })
        })
    ],
    providers: [JwtStrategy],
    exports: [JwtModule, PassportModule],
})

export class AuthModule { }