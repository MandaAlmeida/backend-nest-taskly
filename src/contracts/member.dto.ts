import { UserRole } from "@/enum/userRole.enum";
import { IsIn, IsMongoId } from "class-validator";
import { ObjectId } from "mongoose";

export class MemberDTO {
    @IsMongoId()
    userId: ObjectId;

    @IsIn(["ADMIN", "EDIT", "DELETE", "VIEWER"], { message: "O tipo de acesso deve ser 'ADMIN', 'EDIT', 'DELETE', 'VIEWER'" })
    accessType: UserRole;
}