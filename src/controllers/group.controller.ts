import { JwtAuthGuard } from '@/auth/jwt-auth.guard';
import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { CurrentUser } from '@/auth/current-user-decorator';
import { TokenPayloadSchema } from '@/auth/jwt.strategy';
import { CreateGroupDTO, UpdateGroupDTO } from '@/contracts/group.dto';
import { GroupService } from "../services/group.service"

// Controller para buscar categorias
@Controller("group")
@UseGuards(JwtAuthGuard)
export class GroupController {
    constructor(
        private readonly GroupService: GroupService,
    ) { }

    @Post("create")
    async create(@Body() event: CreateGroupDTO, @CurrentUser() user: TokenPayloadSchema) {
        return this.GroupService.create(event, user);
    }

    @Get("fetch")
    async fetch(@CurrentUser() user: TokenPayloadSchema) {
        return this.GroupService.fetch(user);
    }

    @Get("fetchByPage")
    async fetchByPage(@CurrentUser() user: TokenPayloadSchema, @Query("p") page: number) {
        return this.GroupService.fetchByPage(user, page);
    }

    @Get("search")
    async fetchBySearch(@Query("q") query: string, @CurrentUser() user: TokenPayloadSchema) {
        return this.GroupService.fetchBySearch(query, user);
    }

    @Put("update/:id")
    async update(@Param('id') groupId: string, @Body() group: UpdateGroupDTO, @CurrentUser() user: TokenPayloadSchema) {
        return this.GroupService.update(groupId, group, user)
    }


    @Delete("delete/:id")
    async delete(@Param('id') groupId: string, @CurrentUser() user: TokenPayloadSchema) {
        return this.GroupService.delete(groupId, user);
    }


    @Delete("delete/:groupId/members/:memberId")
    async deleteMember(@Param('groupId') groupId: string, @Param('memberId') memberId: string, @CurrentUser() user: TokenPayloadSchema) {
        return this.GroupService.deleteMember(groupId, memberId, user);
    }
}
