import { JwtAuthGuard } from '@/auth/jwt-auth.guard';
import { AnnotationService } from '../services/annotation.service';
import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query, UseGuards } from '@nestjs/common';
import { CurrentUser } from '@/auth/current-user-decorator';
import { TokenPayloadSchema } from '@/auth/jwt.strategy';
import { CreateAnnotationDTO, UpdateAnnotationDTO, } from '@/contracts/annotation.dto';
import { Roles } from '@/decorator/roles.decorator';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { RoleGuard } from '@/guards/roles.guard';

@ApiTags('Annotation')
@Controller("annotation")
@ApiBearerAuth('access-token')
@UseGuards(RoleGuard)
@UseGuards(JwtAuthGuard)
export class AnnotationController {
    constructor(
        private readonly AnnotationService: AnnotationService,
    ) { }

    @Post("create")
    async create(@Body() event: CreateAnnotationDTO, @CurrentUser() user: TokenPayloadSchema) {
        return this.AnnotationService.create(event, user);
    }


    @Roles("ADMIN", "EDITOR", "DELETE")
    @Post("createByGroup/:groupId")
    async createByGroup(@Body() event: CreateAnnotationDTO, @Param("groupId") groupId: string, @CurrentUser() user: TokenPayloadSchema) {
        return this.AnnotationService.createByGroup(event, groupId, user);
    }

    @Get("fetchByUser")
    async fetchByUser(@CurrentUser() user: TokenPayloadSchema, @Query("p") page: number) {
        return this.AnnotationService.fetchByUser(user, page);
    }

    @Get("fetchByGroup")
    async fetchByGroup(@CurrentUser() user: TokenPayloadSchema) {
        return this.AnnotationService.fetchByGroup(user);
    }

    @Get("fetchById/:annotationId")
    async fetchById(@Param('annotationId') annotationId: string) {
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

    @Roles("ADMIN", "EDITOR", "DELETE")
    @Put("update/:annotationId")
    async update(@Param('annotationId') annotationId: string, @Body() annotation: UpdateAnnotationDTO, @CurrentUser() user: TokenPayloadSchema) {
        return this.AnnotationService.update(annotationId, annotation, user)
    }

    @Roles("ADMIN")
    @Patch("update/:annotationId/members")
    async addNewMember(@Param('annotationId') annotationId: string, @Body() members: UpdateAnnotationDTO, @CurrentUser() user: TokenPayloadSchema) {
        return this.AnnotationService.addMember(annotationId, members, user)
    }

    @Roles("ADMIN")
    @Patch("update/:annotationId/members/:memberId")
    async updatePermissonMember(@Param('annotationId') annotationId: string, @Param('memberId') memberId: string, @Body() body: { accessType: string }, @CurrentUser() user: TokenPayloadSchema) {
        return this.AnnotationService.updatePermissonMember(annotationId, memberId, body, user)
    }

    @Roles("ADMIN")
    @Patch("update/:annotationId/groups/:groupId")
    async addNewGroup(@Param('annotationId') annotationId: string, @Param('groupId') newGroupId: string) {
        return this.AnnotationService.addGroup(annotationId, newGroupId)
    }

    @Roles("ADMIN", "DELETE")
    @Delete("delete/:annotationId")
    async deleteByUser(@Param('annotationId') annotationId: string, @CurrentUser() user: TokenPayloadSchema) {
        return this.AnnotationService.deleteAnnotation(annotationId, user);
    }

    @Roles("ADMIN", "DELETE")
    @Delete("delete/:groupId/:annotationId")
    async deleteByGroup(@Param('annotationId') annotationId: string, @Param('groupId') groupId: string) {
        return this.AnnotationService.deleteAnnotationByGroup(annotationId, groupId);
    }

    @Roles("ADMIN")
    @Delete("delete/:annotationId/members/:memberId")
    async deleteMember(@Param('annotationId') annotationId: string, @Param('memberId') memberId: string, @CurrentUser() user: TokenPayloadSchema) {
        return this.AnnotationService.deleteMember(annotationId, memberId, user);
    }

    @Roles("ADMIN")
    @Delete("delete/:annotationId/groups/:groupId")
    async deleteGroup(@Param('annotationId') annotationId: string, @Param('groupId') newGroupId: string) {
        return this.AnnotationService.deleteGroup(annotationId, newGroupId);
    }
}
