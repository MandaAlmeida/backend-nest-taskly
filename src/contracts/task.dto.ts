import { Status } from "@/enum/status.enum";
import { Type } from "class-transformer";
import {
    IsDate,
    IsEnum,
    IsNotEmpty,
    IsOptional,
    IsString,
} from "class-validator";

export class CreateTaskDTO {
    @IsNotEmpty({ message: "Nome é obrigatório" })
    @IsString()
    readonly name!: string;

    @IsNotEmpty({ message: "Categoria é obrigatória" })
    @IsString()
    readonly category!: string;

    @IsNotEmpty({ message: "Prioridade é obrigatória" })
    @IsString()
    readonly priority!: string;

    @IsNotEmpty({ message: "Data é obrigatória" })
    @Type(() => Date)
    @IsDate()
    readonly date!: Date;
}

export class UpdateTaskDTO {
    @IsOptional()
    name?: string;

    @IsOptional()
    category?: string;

    @IsOptional()
    priority?: string;

    @IsOptional()
    @Type(() => Date)
    @IsDate()
    date?: Date;

    @IsOptional()
    @IsEnum(Status, {
        message: 'Status inválido',
    })
    status?: Status;
}
