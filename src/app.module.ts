import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { config } from 'dotenv';
import { CategoriesModule } from './categories/modules/categories.module';
import { TaskModule } from './tasks/modules/task.module';
import { UserModule } from './users/modules/user.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { envSchema } from './env';


config()

@Module({
    imports: [
        ConfigModule.forRoot({
            validate: env => envSchema.parse(env),
            isGlobal: true,
        }),
        MongooseModule.forRoot(process.env.DATABASE_URL!),
        CategoriesModule,
        TaskModule,
        UserModule,
        AuthModule
    ],
})
export class AppModule {
    constructor() {
        console.log('Conectado ao MongoDB');
    }
}
