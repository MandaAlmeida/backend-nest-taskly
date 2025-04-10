import {
    IsEmail,
    IsNotEmpty,
    IsString,
    IsStrongPassword,
} from "class-validator";

export class CreateUserDTO {
    @IsNotEmpty({ message: "O nome é obrigatório." })
    @IsString({ message: "O nome deve ser uma string." })
    readonly name!: string;

    @IsNotEmpty({ message: "O e-mail é obrigatório." })
    @IsEmail({}, { message: "E-mail inválido." })
    readonly email!: string;

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
    readonly password!: string;

    @IsNotEmpty({ message: "Confirmar a senha é obrigatória." })
    @IsString()
    readonly passwordConfirm!: string;
}

export class LoginUserDTO {
    @IsNotEmpty({ message: "O e-mail é obrigatório." })
    @IsEmail({}, { message: "E-mail inválido." })
    readonly email!: string;

    @IsNotEmpty({ message: "A senha é obrigatória." })
    @IsString()
    readonly password!: string;
}