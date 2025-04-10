import { CurrentUser } from '@/auth/current-user-decorator';
import { JwtAuthGuard } from '@/auth/jwt-auth.guard';
import { TokenPayloadSchema } from '@/auth/jwt.strategy';
import { CreateCategoryDTO } from '@/contracts/category.dto';
import { CategorysService } from '@/services/category.service';
import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';

// Controller para buscar categorias
@Controller("categories")
@UseGuards(JwtAuthGuard)
export class CategoriesController {
    constructor(
        private readonly CategoriesService: CategorysService,
    ) { }

    @Post("create")
    async create(@Body() category: CreateCategoryDTO, @CurrentUser() user: TokenPayloadSchema) {
        return this.CategoriesService.execute(category, user);
    }

    @Get("fetch")
    async fetch(@CurrentUser() user: TokenPayloadSchema) {
        return this.CategoriesService.fetch(user);
    }

    @Delete("delete/:id")
    async delete(@Param("id") categoryId: string, @CurrentUser() user: TokenPayloadSchema) {
        return this.CategoriesService.delete(categoryId, user);
    }

}
