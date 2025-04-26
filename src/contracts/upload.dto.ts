import { IsString, IsNumber } from 'class-validator';
import { Readable } from 'stream'; // Importa o tipo de stream

export class UploadDTO {
    @IsString()
    fieldname: string;

    @IsString()
    originalname: string;

    @IsString()
    encoding: string;

    @IsString()
    mimetype: string;

    buffer?: Buffer; // Buffer pode ser opcional se for usado stream
    stream?: Readable; // Usando stream no lugar de buffer

    @IsNumber()
    size: number;
}
