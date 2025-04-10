import { CurrentUser } from '@/auth/current-user-decorator';
import { JwtAuthGuard } from '@/auth/jwt-auth.guard';
import { TokenPayloadSchema } from '@/auth/jwt.strategy';
import { CreateSubCategoryDTO } from '@/contracts/subCategory.dto';
import { SubCategoryService } from '@/services/subCategory.service';
import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';

// Controller para buscar categorias
@Controller("sub-category")
@UseGuards(JwtAuthGuard)
export class SubCategoryController {
    constructor(
        private readonly SubCategoryService: SubCategoryService,
    ) { }

    @Post("create")
    async create(@Body() subCategory: CreateSubCategoryDTO, @CurrentUser() user: TokenPayloadSchema) {
        return this.SubCategoryService.create(subCategory, user);
    }

    @Get("fetch/:id")
    async fetch(@Param('id') categoryId: string, @CurrentUser() user: TokenPayloadSchema) {
        return this.SubCategoryService.fetch(categoryId, user);
    }

    @Delete("delete/:id")
    async delete(@Param('id') subCategoryId: string, @CurrentUser() user: TokenPayloadSchema) {
        return this.SubCategoryService.delete(subCategoryId, user);
    }

}
