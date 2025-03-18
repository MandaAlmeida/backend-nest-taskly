import { TaskEntity } from "../interface/TaskEntity";
import { Task, TaskDocument } from "../schema/task.schema";
import { UnauthorizedException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { TokenPayloadSchema } from "@/auth/jwt.strategy";


export class CreateTasksRepositorie {
    constructor(@InjectModel(Task.name) private taskModel: Model<TaskDocument>) { }

    async create(event: TaskEntity, user: TokenPayloadSchema): Promise<TaskEntity> {
        const { sub: userId } = user
        const { name, category, date, active, priority } = event
        const existingTask = await this.taskModel.findOne({ name, category, date, userId });


        if (existingTask) {
            throw new UnauthorizedException("Essa task já existe para este usuário");
        }

        const Task = { name, category, date, userId: userId, active, priority }

        const createdTask = new this.taskModel(Task);
        await createdTask.save();
        return createdTask.toObject();
    }

}
