import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { Categories, CategoriesDocument } from "@/categories/schema/categories.schema";
import { CategoriesEntity } from "@/categories/interface/CategoriesEntity";

@Injectable()
export class FetchCategorysRepositorie {
    constructor(@InjectModel(Categories.name) private categoryModel: Model<CategoriesDocument>) { }

    // Buscar todas as categorias
    async findAll(): Promise<CategoriesEntity[]> {
        return this.categoryModel.find().exec();
    }

    // Buscar uma categoria pelo ID
    async findByUserId(userId: string): Promise<CategoriesEntity[]> {

        const categories = await this.categoryModel.find({ userId }).exec();
        return categories
    }
}
