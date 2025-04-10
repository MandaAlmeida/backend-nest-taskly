import { ConflictException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { TokenPayloadSchema } from "@/auth/jwt.strategy";
import { CreateTaskDTO, UpdateTaskDTO } from "@/contracts/task.dto";
import { InjectModel } from "@nestjs/mongoose";
import { Task, TaskDocument } from "@/models/tasks.schema";
import { Model } from "mongoose";
import { Status } from "@/enum/status.enum";

@Injectable()
export class TaskService {
    constructor(
        @InjectModel(Task.name) private taskModel: Model<TaskDocument>
    ) { }

    async create(task: CreateTaskDTO, user: TokenPayloadSchema): Promise<CreateTaskDTO> {
        const { name, category, priority, date } = task;

        const { sub: userId } = user;
        const existingTask = await this.taskModel.findOne({ name, category, date, userId });

        if (existingTask) {
            throw new ConflictException("Essa task já existe");
        }

        // Calcula a data de hoje no formato yyyy-mm-dd
        const today = new Date();
        const todayStr = today.toISOString().split('T')[0];
        const taskDateStr = new Date(date).toISOString().split('T')[0];

        // Define o status baseado na data
        let status: Status;
        if (taskDateStr === todayStr) {
            status = Status.TODAY;
        } else if (taskDateStr < todayStr) {
            status = Status.PENDING;
        } else {
            status = Status.FUTURE;
        }

        const taskToCreate = {
            name,
            category,
            priority,
            date,
            userId,
            status
        };

        const createdTask = new this.taskModel(taskToCreate);
        await createdTask.save();

        return taskToCreate;
    }

    async fetch(user: TokenPayloadSchema): Promise<CreateTaskDTO[]> {
        if (!user) {
            throw new ForbiddenException("Voce nao tem autorizacao para acessar essa rota");
        }

        const { sub: userId } = user;
        return await this.taskModel.find({ userId }).exec();
    }

    async update(taskId: string, task: UpdateTaskDTO, user: TokenPayloadSchema) {
        const { name, category, priority, date, status } = task;
        const { sub: userId } = user;

        const existingTask = await this.taskModel.findById(taskId);
        if (!existingTask) {
            throw new ConflictException("Essa task não existe");
        }

        // Monta dinamicamente os dados a serem atualizados
        const taskToUpdate: any = {};

        if (name) taskToUpdate.name = name;
        if (category) taskToUpdate.category = category;
        if (priority) taskToUpdate.priority = priority;
        if (date) {
            taskToUpdate.date = date;

            const today = new Date();
            const todayStr = today.toISOString().split('T')[0];
            const taskDateStr = new Date(date).toISOString().split('T')[0];

            if (taskDateStr === todayStr) {
                taskToUpdate.status = Status.TODAY;
            } else if (taskDateStr < todayStr) {
                taskToUpdate.status = Status.PENDING;
            } else {
                taskToUpdate.status = Status.FUTURE;
            }
        }
        if (status) {
            taskToUpdate.status = status;
        }

        taskToUpdate.userId = userId;

        const updatedTask = await this.taskModel.findByIdAndUpdate(
            taskId,
            taskToUpdate,
            { new: true }
        ).exec();

        return updatedTask;
    }

    async delete(taskId: string, user: TokenPayloadSchema) {
        if (!user) {
            throw new ForbiddenException("Você não tem autorização para acessar essa rota");
        }

        const { sub: userId } = user;

        const task = await this.taskModel.findById(taskId).exec();

        if (!task) {
            throw new NotFoundException("Task não encontrada");
        }

        // Verifica se o usuário é o dono da task
        if (task.userId.toString() !== userId) {
            throw new ForbiddenException("Você não tem permissão para excluir esta task");
        }

        // Se for o dono, pode deletar
        await this.taskModel.findByIdAndDelete(taskId).exec();

        return { message: "Task excluída com sucesso" };
    }

}