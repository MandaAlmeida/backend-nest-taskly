import { JwtAuthGuard } from '@/auth/jwt-auth.guard';
import { TaskService } from '../services/task.service';
import { Body, Controller, Delete, Get, Param, Patch, Post, Put, UseGuards } from '@nestjs/common';
import { CurrentUser } from '@/auth/current-user-decorator';
import { TokenPayloadSchema } from '@/auth/jwt.strategy';
import { CreateTaskDTO, UpdateTaskDTO } from '@/contracts/task.dto';

// Controller para buscar categorias
@Controller("task")
@UseGuards(JwtAuthGuard)
export class TaskController {
    constructor(
        private readonly TaskService: TaskService,
    ) { }

    @Post("create")
    async create(@Body() event: CreateTaskDTO, @CurrentUser() user: TokenPayloadSchema): Promise<CreateTaskDTO> {
        return this.TaskService.create(event, user);
    }

    @Get("fetch")
    async fetch(@CurrentUser() user: TokenPayloadSchema): Promise<CreateTaskDTO[]> {
        return this.TaskService.fetch(user);
    }

    @Put("update/:id")
    async update(@Param('id') taskId: string, @Body() task: UpdateTaskDTO, @CurrentUser() user: TokenPayloadSchema) {
        return this.TaskService.update(taskId, task, user)
    }

    @Patch("update-status")
    async updateStatus(@CurrentUser() user: TokenPayloadSchema) {
        return this.TaskService.updateStatus(user)
    }

    @Delete("delete/:id")
    async delete(@Param('id') taskId: string, @CurrentUser() user: TokenPayloadSchema) {
        return this.TaskService.delete(taskId, user);
    }

}
