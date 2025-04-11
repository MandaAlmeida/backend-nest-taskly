import { Status } from "@/enum/status.enum";
import { Type } from "class-transformer";
import {
    IsDate,
    IsEnum,
    IsNotEmpty,
    IsOptional,
    IsString,
} from "class-validator";

export class CreateCategoryDTO {
    @IsNotEmpty({ message: "Nome da categoria é obrigatório" })
    @IsString()
    category: string;

    @IsNotEmpty({ message: "Icone é obrigatória" })
    @IsString()
    icon: string;

    @IsNotEmpty({ message: "Cor é obrigatória" })
    @IsString()
    color: string;
}


export class UpdateCategoryDTO {
    @IsOptional()
    @IsString()
    category: string;

    @IsOptional()
    @IsString()
    icon: string;

    @IsOptional()
    @IsString()
    color: string;
}
