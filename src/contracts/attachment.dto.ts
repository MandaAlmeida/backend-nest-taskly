import { IsString } from "class-validator";

export class AttachentDTO {
    @IsString()
    url: string;

    @IsString()
    title: string;
}