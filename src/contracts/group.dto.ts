
import { Type } from "class-transformer";
import {
    IsArray,
    IsIn,
    IsMongoId,
    IsNotEmpty,
    IsOptional,
    IsString,
    ValidateNested,
} from "class-validator";
import { ObjectId } from "mongoose";
import { MemberDTO } from "./member.dto";

export class CreateGroupDTO {
    @IsNotEmpty({ message: "Nome é obrigatório" })
    @IsString()
    name: string;

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => MemberDTO)
    members?: MemberDTO[];

    @IsOptional()
    @IsString()
    description?: string;
}

export class UpdateGroupDTO {
    @IsOptional()
    @IsString()
    name: string;

    @IsOptional()
    @IsString()
    createdUserId: ObjectId[];

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => MemberDTO)
    members?: MemberDTO[];

    @IsOptional()
    @IsString()
    description?: string;
}
