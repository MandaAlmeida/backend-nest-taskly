import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Task, TaskDocument } from "../schema/task.schema";
import { TaskEntity } from "../interface/TaskEntity";

@Injectable()
export class FetchTaskRepositorie {
    constructor(@InjectModel(Task.name) private taskModel: Model<TaskDocument>) { }

    // Buscar todas as categorias
    async findAll(): Promise<TaskEntity[]> {
        return this.taskModel.find().exec();
    }

    // Buscar uma categoria pelo ID
    async findByUserId(userId: string): Promise<TaskEntity[]> {

        const task = await this.taskModel.find({ userId }).exec();
        return task
    }
}
