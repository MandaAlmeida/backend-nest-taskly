import { CategoriesController } from '@/categories/controllers/categories.controller';
import { CreateCategorysRepositorie } from '@/categories/repositories/create-category.repositorie';
import { FetchCategorysRepositorie } from '@/categories/repositories/fetch-category.repositorie';
import { Categories, CategoriesSchema } from '@/categories/schema/categories.schema';
import { CreateCategorysService, FetchCategorysService } from '@/categories/services/category.service';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Categories.name, schema: CategoriesSchema }]),
    ],
    controllers: [CategoriesController],
    providers: [CreateCategorysRepositorie, FetchCategorysRepositorie, CreateCategorysService, FetchCategorysService],
    exports: [MongooseModule]
})

export class CategoriesModule { }
