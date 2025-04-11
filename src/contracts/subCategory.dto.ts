import {
    IsNotEmpty,
    IsOptional,
    IsString,
} from "class-validator";


export class CreateSubCategoryDTO {
    @IsNotEmpty({ message: "Nome da sub categoria é obrigatório" })
    @IsString()
    subCategory: string;

    @IsNotEmpty({ message: "Selecionar a categoria é obrigatório" })
    @IsString()
    category: string;

    @IsNotEmpty({ message: "Icone é obrigatória" })
    @IsString()
    icon: string;

    @IsNotEmpty({ message: "Cor é obrigatória" })
    @IsString()
    color: string;
}

export class UpdateSubCategoryDTO {
    @IsOptional()
    @IsString()
    subCategory: string;

    @IsOptional()
    @IsString()
    categoryName: string;

    @IsOptional()
    @IsString()
    icon: string;

    @IsOptional()
    @IsString()
    color: string;
}