import { Injectable, UnauthorizedException } from "@nestjs/common";
import { CreateTasksRepositorie } from "../repositories/create-task.repositorie";
import { TaskEntity } from "../interface/TaskEntity";
import { FetchTaskRepositorie } from "../repositories/fetch-recent-task.repositorie";
import { TokenPayloadSchema } from "@/auth/jwt.strategy";

@Injectable()
export class CreateTaskService {
    constructor(
        private readonly createTaskRepositorie: CreateTasksRepositorie,
    ) { }

    async execute(event: TaskEntity, user: TokenPayloadSchema): Promise<TaskEntity> {
        const { name, category, priority, date } = event

        if (!name) {
            throw new UnauthorizedException("Name is obrigatorio");
        }

        if (!category) {
            throw new UnauthorizedException("Category is obrigatorio");
        }

        if (!priority) {
            throw new UnauthorizedException("Priority is obrigatorio");
        }

        if (!date) {
            throw new UnauthorizedException("Date is obrigatorio");
        }

        const newTask = await this.createTaskRepositorie.create(event, user);

        return newTask;
    }
}

@Injectable()
export class FetchTaskService {
    constructor(
        private readonly fetchTaskRepositorie: FetchTaskRepositorie,
    ) { }

    async fetch(event: string): Promise<TaskEntity[]> {
        if (event !== "") {
            const taskById = await this.fetchTaskRepositorie.findByUserId(event);
            return taskById;
        }
        console.log("")

        const task = await this.fetchTaskRepositorie.findAll();

        return task;
    }
}