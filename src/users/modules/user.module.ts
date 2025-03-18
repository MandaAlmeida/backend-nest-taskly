import { CategoriesModule } from '@/categories/modules/categories.module';
import { UserController } from '../controllers/user.controller';
import { CreateUserRepositorie } from '../repositories/create-user.repositorie';
import { LoginUserRepositorie } from '../repositories/login-user.repositorie';
import { User, UserSchema } from '../schema/user.model';
import { CreateUserService, LoginUserService } from '../services/user.service';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
        CategoriesModule,
    ],
    controllers: [UserController],
    providers: [
        CreateUserRepositorie,
        CreateUserService,
        LoginUserRepositorie,
        LoginUserService,
    ],
})
export class UserModule { }
