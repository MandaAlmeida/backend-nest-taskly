import { Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { UserEntity } from "../interface/UserEntity";
import { User, UserDocument } from "../schema/user.model";
import { compare } from "bcryptjs";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class LoginUserRepositorie {
    constructor(@InjectModel(User.name) private userModel: Model<UserDocument>, private jwt: JwtService) { }

    async login(event: UserEntity): Promise<{ token: string }> {
        const { email, password } = event
        const user = await this.userModel.findOne({ email });
        if (!user) {
            throw new UnauthorizedException("Senha ou email incorretos");
        }

        const checkPassword = await compare(password, user.password)

        if (!checkPassword) {
            throw new UnauthorizedException("Senha ou email incorretos")
        }

        const accessToken = this.jwt.sign({ sub: user.id.toString() })

        return {
            token: accessToken
        };


    }
}
