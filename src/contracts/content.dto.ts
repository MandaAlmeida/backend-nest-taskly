import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsIn } from "class-validator";

export class ContentDTO {
    @ApiProperty({
        description: "Tipo do conteúdo",
        example: "text",
    })
    @IsIn(["text", "image"], { message: "O tipo de conteúdo deve ser 'text' ou 'image'" })
    type: string;

    @ApiProperty({
        description: "Conteúdo a ser adicionado",
        example: "Texto da anotação",
    })
    @IsString()
    value: string;
}
