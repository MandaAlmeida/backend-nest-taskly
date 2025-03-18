import { CurrentUser } from '@/auth/current-user-decorator';
import { JwtAuthGuard } from '@/auth/jwt-auth.guard';
import { TokenPayloadSchema } from '@/auth/jwt.strategy';
import { CategoriesEntity } from '@/categories/interface/CategoriesEntity';
import { CreateCategorysService, FetchCategorysService } from '@/categories/services/category.service';
import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';

// Controller para buscar categorias
@Controller("categories")
@UseGuards(JwtAuthGuard)
export class CategoriesController {
    constructor(
        private readonly createCategoriesService: CreateCategorysService,
        private readonly fetchCategoriesService: FetchCategorysService,
    ) { }

    @Post("create")
    async create(@Body() event: CategoriesEntity, @CurrentUser() user: TokenPayloadSchema): Promise<CategoriesEntity> {
        return this.createCategoriesService.execute(event, user);
    }

    @Get("fetch")
    async fetch(@Body() body?: { userId: string }): Promise<CategoriesEntity[]> {
        return this.fetchCategoriesService.fetch(body?.userId || "");
    }

}
