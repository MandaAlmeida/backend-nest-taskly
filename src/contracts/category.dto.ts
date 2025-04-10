import { Status } from "@/enum/status.enum";
import { Type } from "class-transformer";
import {
    IsDate,
    IsEnum,
    IsNotEmpty,
    IsString,
} from "class-validator";

export class CreateCategoryDTO {
    @IsNotEmpty({ message: "Nome da categoria é obrigatório" })
    @IsString()
    readonly category!: string;

    @IsNotEmpty({ message: "Icone é obrigatória" })
    @IsString()
    readonly icon!: string;

    @IsNotEmpty({ message: "Cor é obrigatória" })
    @IsString()
    readonly color!: string;
}
