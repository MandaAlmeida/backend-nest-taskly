import { UserEntity } from '../interface/UserEntity';
import { LoginUserRepositorie } from '../repositories/login-user.repositorie';
import { CreateUserService } from '../services/user.service';
import { Body, Controller, Get, Post } from '@nestjs/common';

// Controller para buscar categorias
@Controller("user")
export class UserController {
    constructor(
        private readonly createUserService: CreateUserService,
        private readonly loginUserService: LoginUserRepositorie
    ) { }

    @Post("register")
    async create(@Body() event: UserEntity): Promise<UserEntity> {
        return this.createUserService.create(event);
    }

    @Post("login")
    async login(@Body() event: UserEntity): Promise<{ token: string }> {
        return this.loginUserService.login(event)
    }

}
