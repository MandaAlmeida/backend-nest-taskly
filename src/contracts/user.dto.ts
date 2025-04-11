import {
    IsEmail,
    IsNotEmpty,
    IsOptional,
    IsString,
    IsStrongPassword,
} from "class-validator";

export class CreateUserDTO {
    @IsNotEmpty({ message: "O nome é obrigatório." })
    @IsString({ message: "O nome deve ser uma string." })
    name: string;

    @IsNotEmpty({ message: "O e-mail é obrigatório." })
    @IsEmail({}, { message: "E-mail inválido." })
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
    password: string;

    @IsNotEmpty({ message: "Confirmar a senha é obrigatória." })
    @IsString()
    passwordConfirm: string;
}

export class LoginUserDTO {
    @IsNotEmpty({ message: "O e-mail é obrigatório." })
    @IsEmail({}, { message: "E-mail inválido." })
    email: string;

    @IsNotEmpty({ message: "A senha é obrigatória." })
    @IsString()
    password: string;
}

export class UpdateUserDTO {
    @IsOptional()
    @IsString()
    name: string;

    @IsOptional()
    @IsEmail({}, { message: "E-mail inválido." })
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
    password: string;

    @IsOptional()
    @IsString()
    passwordConfirm: string;
}