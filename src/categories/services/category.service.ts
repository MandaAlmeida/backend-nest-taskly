import { Injectable, UnauthorizedException } from "@nestjs/common";
import { CategoriesEntity } from "@/categories/interface/CategoriesEntity";
import { CreateCategorysRepositorie } from "@/categories/repositories/create-category.repositorie";
import { FetchCategorysRepositorie } from "@/categories/repositories/fetch-category.repositorie";
import { TokenPayloadSchema } from "@/auth/jwt.strategy";

@Injectable()
export class CreateCategorysService {
    constructor(
        private readonly createCategorysRepositorie: CreateCategorysRepositorie,
    ) { }

    async execute(event: CategoriesEntity, user: TokenPayloadSchema): Promise<CategoriesEntity> {
        if (!event.name) {
            throw new UnauthorizedException("Name is obrigatorio");
        }

        let newCategory = await this.createCategorysRepositorie.execute(event, user);

        return newCategory;
    }
}

@Injectable()
export class FetchCategorysService {
    constructor(
        private readonly fetchCategorysRepositorie: FetchCategorysRepositorie,
    ) { }

    async fetch(event: string): Promise<CategoriesEntity[]> {
        if (event !== "") {
            const categoryById = await this.fetchCategorysRepositorie.findByUserId(event);
            return categoryById;
        }
        console.log("")

        const category = await this.fetchCategorysRepositorie.findAll();

        return category;
    }
}