import { Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Categories, CategoriesDocument } from "@/categories/schema/categories.schema";
import { CategoriesEntity } from "@/categories/interface/CategoriesEntity";
import { TokenPayloadSchema } from "@/auth/jwt.strategy";

@Injectable()
export class CreateCategorysRepositorie {
    constructor(@InjectModel(Categories.name) private categoryModel: Model<CategoriesDocument>) { }

    async execute(event: CategoriesEntity, user: TokenPayloadSchema): Promise<CategoriesEntity> {
        const { sub: userId } = user
        const { name } = event

        const existingCategory = await this.categoryModel.findOne({
            name,
            userId
        });

        if (existingCategory) {
            throw new UnauthorizedException("Essa categoria já existe para este usuário");
        }

        const Category = { name, userId: userId }

        const createdCategories = new this.categoryModel(Category);
        await createdCategories.save();
        return createdCategories.toObject();
    }
}
