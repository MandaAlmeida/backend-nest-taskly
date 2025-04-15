import { JwtAuthGuard } from '@/auth/jwt-auth.guard';
import { AnnotationService } from '../services/annotation.service';
import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query, UseGuards } from '@nestjs/common';
import { CurrentUser } from '@/auth/current-user-decorator';
import { TokenPayloadSchema } from '@/auth/jwt.strategy';
import { CreateAnnotationDTO, UpdateAnnotationDTO, } from '@/contracts/annotation.dto';
import { Roles } from '@/decorator/roles.decorator';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AnnotationRoleGuard, GroupRoleGuard } from '@/guards/roles.guard';

@ApiTags('Annotation')
@Controller("annotation")
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
export class AnnotationController {
    constructor(
        private readonly AnnotationService: AnnotationService,
    ) { }

    @Post("create")
    async create(@Body() event: CreateAnnotationDTO, @CurrentUser() user: TokenPayloadSchema) {
        return this.AnnotationService.create(event, user);
    }

    @UseGuards(GroupRoleGuard)
    @Roles("ADMIN", "EDITOR", "DELETE")
    @Post("createByGroup/:groupId")
    async createByGroup(@Body() event: CreateAnnotationDTO, @Param("groupId") groupId: string, @CurrentUser() user: TokenPayloadSchema) {
        return this.AnnotationService.createByGroup(event, groupId, user);
    }

    @Get("fetch")
    async fetch(@CurrentUser() user: TokenPayloadSchema) {
        return this.AnnotationService.fetch(user);
    }

    @Get("fetchById/:id")
    async fetchById(@Param('id') annotationId: string) {
        return this.AnnotationService.fetchById(annotationId);
    }

    @Get("fetchByPage")
    async fetchByPage(@CurrentUser() user: TokenPayloadSchema, @Query("p") page: number) {
        return this.AnnotationService.fetchByPage(user, page);
    }

    @Get("search")
    async fetchByFilter(@Query("q") query: string, @CurrentUser() user: TokenPayloadSchema) {
        return this.AnnotationService.fetchBySearch(query, user);
    }

    @UseGuards(AnnotationRoleGuard)
    @Roles("ADMIN", "EDITOR", "DELETE")
    @Put("update/:id")
    async update(@Param('id') annotationId: string, @Body() annotation: UpdateAnnotationDTO, @CurrentUser() user: TokenPayloadSchema) {
        return this.AnnotationService.update(annotationId, annotation, user)
    }

    @UseGuards(AnnotationRoleGuard)
    @Roles("ADMIN")
    @Patch("update/:annotationId/members")
    async addNewMember(@Param('annotationId') annotationId: string, @Body() members: UpdateAnnotationDTO, @CurrentUser() user: TokenPayloadSchema) {
        return this.AnnotationService.addMember(annotationId, members, user)
    }

    @UseGuards(AnnotationRoleGuard)
    @Roles("ADMIN")
    @Patch("update/:annotationId/members/:memberId")
    async updatePermissonMember(@Param('annotationId') annotationId: string, @Param('memberId') memberId: string, @Body() body: { accessType: string }, @CurrentUser() user: TokenPayloadSchema) {
        return this.AnnotationService.updatePermissonMember(annotationId, memberId, body, user)
    }

    @UseGuards(GroupRoleGuard)
    @Roles("ADMIN")
    @Patch("update/:annotationId/groups/:groupId")
    async addNewGroup(@Param('annotationId') annotationId: string, @Param('groupId') newGroupId: string) {
        return this.AnnotationService.addGroup(annotationId, newGroupId)
    }

    @UseGuards(AnnotationRoleGuard)
    @Roles("ADMIN", "DELETE")
    @Delete("delete/:id")
    async delete(@Param('id') annotationId: string, @CurrentUser() user: TokenPayloadSchema) {
        return this.AnnotationService.delete(annotationId, user);
    }

    @UseGuards(AnnotationRoleGuard)
    @Roles("ADMIN")
    @Delete("delete/:annotationId/members/:memberId")
    async deleteMember(@Param('annotationId') annotationId: string, @Param('memberId') memberId: string, @CurrentUser() user: TokenPayloadSchema) {
        return this.AnnotationService.deleteMember(annotationId, memberId, user);
    }

    @UseGuards(AnnotationRoleGuard, GroupRoleGuard)
    @Roles("ADMIN")
    @Delete("delete/:annotationId/groups/:groupId")
    async deleteGroup(@Param('annotationId') annotationId: string, @Param('groupId') newGroupId: string) {
        return this.AnnotationService.deleteGroup(annotationId, newGroupId);
    }
}
