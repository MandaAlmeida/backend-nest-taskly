import { BadRequestException, ConflictException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { TokenPayloadSchema } from "@/auth/jwt.strategy";
import { CreateCategoryDTO } from "@/contracts/category.dto";
import { InjectModel } from "@nestjs/mongoose";
import { Categories, CategoriesDocument } from "@/models/category.schema";
import { Model } from "mongoose";

@Injectable()
export class CategorysService {
    constructor(
        @InjectModel(Categories.name) private categoryModel: Model<CategoriesDocument>
    ) { }

    async execute(createCategory: CreateCategoryDTO, user: TokenPayloadSchema) {
        const { sub: userId } = user
        const { category, color, icon } = createCategory

        const existingCategory = await this.categoryModel.findOne({
            category,
            userId
        });

        if (existingCategory) {
            throw new ConflictException("Essa categoria já existe para este usuário");
        }

        const Category = { category, color, icon, userId: userId }

        const createdCategories = new this.categoryModel(Category);
        await createdCategories.save();
        return createdCategories;

    }

    async fetch(user: TokenPayloadSchema) {
        if (!user) {
            throw new ForbiddenException("Voce nao tem autorizacao para acessar essa rota");
        }

        const { sub: userId } = user;
        return await this.categoryModel.find({ userId }).exec();
    }

    async delete(categoryId: string, user: TokenPayloadSchema) {
        if (!user || !categoryId) {
            throw new ForbiddenException("Dados invalidos");
        }


        const { sub: userId } = user;

        const subCategory = await this.categoryModel.findById(categoryId).exec();

        if (!subCategory) {
            throw new NotFoundException("Categoria não encontrada");
        }

        // Verifica se o usuário é o dono da task
        if (subCategory.userId.toString() !== userId || subCategory.category === "Todas") {
            throw new ForbiddenException("Você não tem permissão para excluir esta categoria");
        }

        await this.categoryModel.findByIdAndDelete(categoryId).exec();

        return { message: "Categoria excluída com sucesso" }
    }
}
