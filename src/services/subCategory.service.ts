import { ConflictException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { TokenPayloadSchema } from "@/auth/jwt.strategy";
import { InjectModel } from "@nestjs/mongoose";
import { Categories, CategoriesDocument } from "@/models/category.schema";
import { Model } from "mongoose";
import { CreateSubCategoryDTO } from "@/contracts/subCategory.dto";
import { SubCategory, SubCategoryDocument } from "@/models/subCategory.schema";

@Injectable()
export class SubCategoryService {
    constructor(
        @InjectModel(SubCategory.name) private subCategoryModel: Model<SubCategoryDocument>,
        @InjectModel(Categories.name) private categoryModel: Model<CategoriesDocument>,
    ) { }

    async create(createCategory: CreateSubCategoryDTO, user: TokenPayloadSchema) {
        const { sub: userId } = user
        const { subCategory, category, color, icon } = createCategory;

        const categoryId = await this.categoryModel.findOne({
            category,
            userId
        });

        if (!categoryId) {
            throw new ConflictException("Essa categoria nao existe");
        }

        const existingSubCategory = await this.subCategoryModel.findOne({
            subCategory,
            categoryName: category,
            userId
        });

        console.log(existingSubCategory)

        if (existingSubCategory) {
            throw new ConflictException("Essa sub categoria já existe para essa categoria");
        }

        const Category = { subCategory, categoryName: category, categoryId: categoryId._id, color, icon, userId: userId }

        const createdCategories = new this.subCategoryModel(Category);
        await createdCategories.save();
        return createdCategories;

    }

    async fetch(categoryId: string, user: TokenPayloadSchema) {
        if (!user || !categoryId) {
            throw new ForbiddenException("Dados invalidos");
        }

        const { sub: userId } = user;
        const subCategory = await this.subCategoryModel.find({
            userId,
            categoryId
        }).exec();

        return subCategory
    }


    async delete(subCategoryId: string, user: TokenPayloadSchema) {
        if (!user || !subCategoryId) {
            throw new ForbiddenException("Dados invalidos");
        }


        const { sub: userId } = user;

        const subCategory = await this.subCategoryModel.findById(subCategoryId).exec();

        if (!subCategory) {
            throw new NotFoundException("Sub categoria não encontrada");
        }

        // Verifica se o usuário é o dono da task
        if (subCategory.userId.toString() !== userId) {
            throw new ForbiddenException("Você não tem permissão para excluir esta sub categoria");
        }
        await this.subCategoryModel.findByIdAndDelete(subCategoryId).exec();

        return { message: "Sub categoria excluída com sucesso" }
    }
}
