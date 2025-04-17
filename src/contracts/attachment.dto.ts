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


    static create(title: string, url: string): AttachentDTO {
        const attachment = new AttachentDTO()
        attachment.title = title;
        attachment.url = url;
        return attachment
    }
}