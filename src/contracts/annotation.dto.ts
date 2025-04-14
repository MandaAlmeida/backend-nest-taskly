import { Status } from "@/enum/status.enum";
import { Type } from "class-transformer";
import {
    IsArray,
    IsNotEmpty,
    IsOptional,
    IsString,
    ValidateNested,
} from "class-validator";
import { MemberDTO } from "./member.dto";
import { AttachentDTO } from "./attachment.dto";

export class CreateAnnotationDTO {
    @IsNotEmpty({ message: "Titulo é obrigatório" })
    @IsString()
    title: string;

    @IsNotEmpty({ message: "Conteudo é obrigatório" })
    @IsString()
    content: string;

    @IsNotEmpty({ message: "Categoria é obrigatória" })
    @IsString()
    category: string;

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => MemberDTO)
    members?: MemberDTO[];

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => AttachentDTO)
    attachent?: AttachentDTO[];

    @IsNotEmpty({ message: "Categoria é obrigatória" })
    @IsString()
    groupId?: string[];
}

export class UpdateAnnotationDTO {
    @IsOptional()
    @IsString()
    title: string;

    @IsOptional()
    @IsString()
    content: string;

    @IsOptional()
    @IsString()
    category: string;

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => MemberDTO)
    members?: MemberDTO[];

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => AttachentDTO)
    attachent?: AttachentDTO[];

    @IsOptional()
    @IsString()
    groupId?: string[];
}
