import { IsIn, IsMongoId } from "class-validator";
import { ObjectId } from "mongoose";

export class MemberDTO {
    @IsMongoId()
    userId: ObjectId;

    @IsIn(['admin', 'invited'], { message: "O tipo de acesso deve ser 'admin' ou 'invited'" })
    accessType: 'admin' | 'invited';
}