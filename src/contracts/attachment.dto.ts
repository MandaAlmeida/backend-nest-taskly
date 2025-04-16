import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class AttachentDTO {
    @IsString()
    @ApiProperty({
        description: "Titulo do anexo",
        example: "Logo do Nest"
    })
    title: string;

    @IsString()
    @ApiProperty({
        description: "Url do anexo",
        example: "src/assets/logo_nest.jpg"
    })
    url: string;

}