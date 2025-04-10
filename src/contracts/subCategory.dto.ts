import {
    IsNotEmpty,
    IsString,
} from "class-validator";
import { ObjectId } from "mongoose";

export class CreateSubCategoryDTO {
    @IsNotEmpty({ message: "Nome da sub categoria é obrigatório" })
    @IsString()
    readonly subCategory!: string;

    @IsNotEmpty({ message: "Selecionar a categoria é obrigatório" })
    @IsString()
    readonly category!: string;

    @IsNotEmpty({ message: "Icone é obrigatória" })
    @IsString()
    readonly icon!: string;

    @IsNotEmpty({ message: "Cor é obrigatória" })
    @IsString()
    readonly color!: string;
}
