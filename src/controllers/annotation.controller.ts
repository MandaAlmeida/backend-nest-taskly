import { JwtAuthGuard } from '@/auth/jwt-auth.guard';
import { AnnotationService } from '../services/annotation.service';
import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query, UseGuards } from '@nestjs/common';
import { CurrentUser } from '@/auth/current-user-decorator';
import { TokenPayloadSchema } from '@/auth/jwt.strategy';
import { CreateAnnotationDTO, UpdateAnnotationDTO, } from '@/contracts/annotation.dto';

// Controller para buscar categorias
@Controller("annotation")
@UseGuards(JwtAuthGuard)
export class AnnotationController {
    constructor(
        private readonly AnnotationService: AnnotationService,
    ) { }

    @Post("create")
    async create(@Body() event: CreateAnnotationDTO, @CurrentUser() user: TokenPayloadSchema) {
        return this.AnnotationService.create(event, user);
    }

    @Get("fetch")
    async fetchByPage(@CurrentUser() user: TokenPayloadSchema) {
        return this.AnnotationService.fetch(user);
    }


    @Get("fetchByPage")
    async fetch(@CurrentUser() user: TokenPayloadSchema, @Query("p") page: number) {
        return this.AnnotationService.fetchByPage(user, page);
    }

    @Get("search")
    async fetchByFilter(@Query("q") query: string, @CurrentUser() user: TokenPayloadSchema) {
        return this.AnnotationService.fetchBySearch(query, user);
    }

    @Put("update/:id")
    async update(@Param('id') annotationId: string, @Body() annotation: UpdateAnnotationDTO, @CurrentUser() user: TokenPayloadSchema) {
        return this.AnnotationService.update(annotationId, annotation, user)
    }


    @Delete("delete/:id")
    async delete(@Param('id') annotationId: string, @CurrentUser() user: TokenPayloadSchema) {
        return this.AnnotationService.delete(annotationId, user);
    }

    @Delete("delete/:annotationId/members/:memberId")
    async deleteMember(@Param('annotationId') annotationId: string, @Param('memberId') memberId: string, @CurrentUser() user: TokenPayloadSchema) {
        return this.AnnotationService.deleteMember(annotationId, memberId, user);
    }

}
