import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtModule, JwtModuleOptions } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { JwtStrategy } from "./jwt.strategy";
import { EnvService } from "@/env/env.service";
import { EnvModule } from "@/env/env.module";

@Module({
    imports: [
        PassportModule,
        JwtModule.registerAsync({
            imports: [EnvModule],
            inject: [EnvService],
            global: true,
            useFactory: (env: EnvService) => {
                const privateKeyString = env.get("JWT_PRIVATE_KEY") || "";
                const publicKeyString = env.get("JWT_PUBLIC_KEY") || "";

                return {
                    privateKey: Buffer.from(privateKeyString, "base64"),
                    publicKey: Buffer.from(publicKeyString, "base64"),
                    signOptions: {
                        algorithm: "RS256",
                    },
                };
            }
        })
    ],
    providers: [JwtStrategy],
    exports: [JwtModule, PassportModule],
})

export class AuthModule { }