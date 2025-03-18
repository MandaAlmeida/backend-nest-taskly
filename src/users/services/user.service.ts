import { UserEntity } from "../interface/UserEntity";
import { CreateUserRepositorie } from "../repositories/create-user.repositorie";
import { LoginUserRepositorie } from "../repositories/login-user.repositorie";
import { Injectable, UnauthorizedException } from "@nestjs/common";


@Injectable()
export class CreateUserService {
    constructor(
        private readonly createUserRepositorie: CreateUserRepositorie,
    ) { }

    async create(event: UserEntity): Promise<UserEntity> {
        const { name, email, password, passwordConfirm } = event

        if (!name) {
            throw new UnauthorizedException("Name is obrigatorio");
        }

        if (!email) {
            throw new UnauthorizedException("Email is obrigatorio");
        }

        if (!password) {
            throw new UnauthorizedException("Password is obrigatorio");
        }

        if (!passwordConfirm) {
            throw new UnauthorizedException("Password Confirm is obrigatorio");
        }

        if (passwordConfirm !== password) {
            throw new UnauthorizedException("As senhas precisam ser iguais");
        }

        const newUser = await this.createUserRepositorie.create(event);

        return newUser;
    }
}

@Injectable()
export class LoginUserService {
    constructor(
        private readonly fetchUserRepositorie: LoginUserRepositorie,
    ) { }

    async fetch(event: UserEntity): Promise<{ token: string }> {
        const user = await this.fetchUserRepositorie.login(event);

        return user;
    }
}