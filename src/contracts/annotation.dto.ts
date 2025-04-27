import { Transform, Type } from "class-transformer";
import {
    IsArray,
    IsNotEmpty,
    IsOptional,
    IsString,
    ValidateNested,
} from "class-validator";
import { MemberDTO } from "./member.dto";
import { ApiProperty } from "@nestjs/swagger";
import { AttachmentDTO } from "./attachment.dto";
import { ContentDTO } from "./content.dto";

export class CreateAnnotationDTO {
    @IsNotEmpty({ message: "Titulo é obrigatório" })
    @IsString()
    @ApiProperty({
        description: "Titulo da anotacao",
        example: "Estudo sobre Nest"
    })
    title: string;


    @Transform(({ value }) => {
        if (typeof value === 'string') {
            try {
                return JSON.parse(value);
            } catch (error) {
                throw new Error('Invalid JSON string for content');
            }
        }
        return value;
    }, { toClassOnly: true })
    @IsArray()
    @ApiProperty({
        description: 'Conteúdo da anotação',
        example: [
            { type: 'text', value: 'Texto da anotação' },
            { type: 'image', value: 'imagem.jpg' },
        ],
    })
    content: ContentDTO[];

    @IsNotEmpty({ message: "Categoria é obrigatória" })
    @IsString()
    @ApiProperty({
        description: "Categoria onde a anotacao se encontra",
        example: "Estudo"
    })
    category: string;

    @IsOptional()
    @IsArray()
    @Type(() => MemberDTO)
    @ApiProperty({
        description: "Com quem voce quer compartilhar essa anotacao",
        example: [
            {
                "userId": "67f84a94f3512313ce56e030",
                "accessType": "VIEWER"
            }
        ]
    })
    members?: MemberDTO[];

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    groupId?: string[];
}

export class UpdateAnnotationDTO {
    @IsOptional()
    @IsString()
    @ApiProperty({
        description: "Titulo da anotacao",
        example: "Estudo sobre Nest"
    })
    title?: string;

    @ValidateNested({ each: true })
    @Type(() => ContentDTO)
    @Transform((value) => ContentDTO)
    @ApiProperty({
        description: 'Conteúdo da anotação',
        example: [
            { type: 'text', value: 'Texto da anotação' },
            { type: 'image', value: 'imagem.jpg' },
        ],
    })
    content?: ContentDTO;

    @IsOptional()
    @IsString()
    @ApiProperty({
        description: "Categoria onde a anotacao se encontra",
        example: "Estudo"
    })
    category?: string;

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => MemberDTO)
    @ApiProperty({
        description: "Com quem voce quer compartilhar essa anotacao",
        example: [
            {
                "userId": "67f84a94f3512313ce56e030",
                "accessType": "VIEWER"
            }
        ]
    })
    members?: MemberDTO[];

    @ApiProperty({ type: AttachmentDTO, required: false })
    @IsOptional()
    @IsArray()
    attachment?: AttachmentDTO[];

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    groupId?: string[];
}
