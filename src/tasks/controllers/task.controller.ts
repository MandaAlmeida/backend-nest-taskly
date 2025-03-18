import { JwtAuthGuard } from '@/auth/jwt-auth.guard';
import { TaskEntity } from '../interface/TaskEntity';
import { CreateTaskService, FetchTaskService } from '../services/task.service';
import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { CurrentUser } from '@/auth/current-user-decorator';
import { TokenPayloadSchema } from '@/auth/jwt.strategy';

// Controller para buscar categorias
@Controller("task")
@UseGuards(JwtAuthGuard)
export class TaskController {
    constructor(
        private readonly createTaskService: CreateTaskService,
        private readonly fetchTaskService: FetchTaskService,
    ) { }

    @Post("create")
    async create(@Body() event: TaskEntity, @CurrentUser() user: TokenPayloadSchema): Promise<TaskEntity> {
        return this.createTaskService.execute(event, user);
    }

    @Get("fetch")
    async fetch(@Body() body?: { userId: string }): Promise<TaskEntity[]> {
        return this.fetchTaskService.fetch(body?.userId || "");
    }

}
