import { ApiProperty } from "@nestjs/swagger";
import {
    IsArray,
    IsEmail,
    IsNotEmpty,
    IsOptional,
    IsString,
    IsStrongPassword,
} from "class-validator";

export class CreateUserDTO {
    @IsNotEmpty({ message: "O nome é obrigatório." })
    @IsString()
    @ApiProperty({
        description: "Nome do usuario",
        example: "Diego Martins"
    })
    name: string;

    @IsNotEmpty({ message: "O e-mail é obrigatório." })
    @IsEmail({}, { message: "E-mail inválido." })
    @ApiProperty({
        description: "Email do usuario",
        example: "diegomartins16@gmail.com"
    })
    email: string;

    @IsNotEmpty({ message: "A senha é obrigatória." })
    @IsStrongPassword(
        {
            minLength: 8,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1,
        },
        {
            message:
                "A senha precisa ter no mínimo 8 caracteres, com letra maiúscula, minúscula, número e símbolo.",
        }
    )
    @ApiProperty({
        description: "Senha para acessar a aplicacao",
        example: "DiegoM13#"
    })
    password: string;

    @IsNotEmpty({ message: "Confirmar a senha é obrigatória." })
    @IsString()
    @ApiProperty({
        description: "Confirmar senha quando cria o usuario",
        example: "DiegoM13#"
    })
    passwordConfirm: string;
}

export class LoginUserDTO {
    @IsNotEmpty({ message: "O e-mail é obrigatório." })
    @IsEmail({}, { message: "E-mail inválido." })
    @ApiProperty({
        description: "Email do usuario",
        example: "diegomartins16@gmail.com"
    })
    email: string;

    @IsNotEmpty({ message: "A senha é obrigatória." })
    @IsString()
    @ApiProperty({
        description: "Senha para acessar a aplicacao",
        example: "DiegoM13#"
    })
    password: string;
}

export class UpdateUserDTO {
    @IsOptional()
    @IsString()
    @ApiProperty({
        description: "Nome do usuario",
        example: "Diego Martins"
    })
    name: string;

    @IsOptional()
    @IsEmail({}, { message: "E-mail inválido." })
    @ApiProperty({
        description: "Email do usuario",
        example: "diegomartins16@gmail.com"
    })
    email: string;

    @IsOptional()
    @IsStrongPassword(
        {
            minLength: 8,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1,
        },
        {
            message:
                "A senha precisa ter no mínimo 8 caracteres, com letra maiúscula, minúscula, número e símbolo.",
        }
    )
    @ApiProperty({
        description: "Senha para acessar a aplicacao",
        example: "DiegoM13#"
    })
    password: string;

    @IsOptional()
    @IsString()
    @ApiProperty({
        description: "Confirmar senha quando cria o usuario",
        example: "DiegoM13#"
    })
    passwordConfirm: string;
}