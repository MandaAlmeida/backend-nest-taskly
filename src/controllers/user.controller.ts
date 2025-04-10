import { CurrentUser } from '@/auth/current-user-decorator';
import { JwtAuthGuard } from '@/auth/jwt-auth.guard';
import { TokenPayloadSchema } from '@/auth/jwt.strategy';
import { CreateUserDTO, LoginUserDTO } from '@/contracts/user.dto';
import { UserService } from '@/services/user.service';
import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';

// Controller para buscar categorias
@Controller("user")
export class UserController {
    constructor(
        private readonly UserService: UserService,
    ) { }

    @Post("register")
    async create(@Body() user: CreateUserDTO) {
        return this.UserService.create(user);
    }

    @Post("login")
    async login(@Body() user: LoginUserDTO): Promise<{ token: string }> {
        return this.UserService.login(user)
    }

    @UseGuards(JwtAuthGuard)
    @Get("fetch")
    async fetch(@CurrentUser() user: TokenPayloadSchema) {
        return this.UserService.fetch(user)
    }

    @Delete("delete/:id")
    async delete(@Param('id') userId: string) {
        return this.UserService.delete(userId)
    }

}
