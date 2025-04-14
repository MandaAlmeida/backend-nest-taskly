import {
    IsEmail,
    IsNotEmpty,
    IsOptional,
    IsString,
    IsStrongPassword,
} from "class-validator";

type UserType = "admin" | "invited"


export class CreateUserDTO {
    @IsNotEmpty({ message: "O nome é obrigatório." })
    @IsString()
    name: string;

    @IsNotEmpty({ message: "O e-mail é obrigatório." })
    @IsEmail({}, { message: "E-mail inválido." })
    email: string;

    @IsNotEmpty({ message: "O tipo de usuário é obrigatório, escolha se e admin ou invited" })
    @IsString()
    type: UserType;

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

    @IsNotEmpty({ message: "O tipo de usuário é obrigatório." })
    @IsString()
    type: UserType;

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