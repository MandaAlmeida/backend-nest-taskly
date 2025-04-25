import { ConflictException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { TokenPayloadSchema } from "@/auth/jwt.strategy";
import { CreateTaskDTO, UpdateTaskDTO } from "@/contracts/task.dto";
import { InjectModel } from "@nestjs/mongoose";
import { Task, TaskDocument } from "@/models/tasks.schema";
import { Model } from "mongoose";
import { Status } from "@/enum/status.enum";
import { SubTask } from "@/models/subTask";

@Injectable()
export class TaskService {
    constructor(
        @InjectModel(Task.name) private taskModel: Model<TaskDocument>
    ) { }

    async create(task: CreateTaskDTO, user: TokenPayloadSchema): Promise<CreateTaskDTO> {
        const { name, category, subCategory, subTask, priority, date } = task;
        const { sub: userId } = user;
        const existingTask = await this.taskModel.findOne({ name, category, date, userId });

        if (existingTask) throw new ConflictException("Essa task já existe");

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
            subCategory,
            priority,
            date,
            userId,
            status,
            subTask
        };

        const createdTask = new this.taskModel(taskToCreate);
        await createdTask.save();

        return taskToCreate;
    }

    async fetch(user: TokenPayloadSchema): Promise<CreateTaskDTO[]> {
        const { sub: userId } = user;
        return await this.taskModel.find({ userId }).sort({ date: 1 }).exec();
    }

    async fetchById(taskId: string) {
        return await this.taskModel.findById(taskId).exec();
    }

    async fetchByPage(user: TokenPayloadSchema, page: number): Promise<CreateTaskDTO[]> {
        const { sub: userId } = user;

        const limit = 20;
        const currentPage = page
        const skip = (currentPage - 1) * limit;
        return await this.taskModel.find({ userId }).sort({ date: 1 }).skip(skip).limit(limit).exec();
    }

    async fetchBySearch(query: string, user: TokenPayloadSchema): Promise<CreateTaskDTO[]> {
        const { sub: userId } = user;
        const regex = new RegExp(query, 'i');
        const isDate = !isNaN(Date.parse(query));
        const filters: any[] = [
            { name: { $regex: regex } },
            { category: { $regex: regex } },
            { subCategory: { $regex: regex } },
        ];

        if (isDate) {
            const searchDate = new Date(query);
            const nextDay = new Date(searchDate);
            nextDay.setDate(searchDate.getDate() + 1);

            filters.push({
                date: {
                    $gte: searchDate.toISOString(),
                    $lt: nextDay.toISOString(),
                },
            });
        }

        const tasks = await this.taskModel.find({
            userId,
            $or: filters,
        });

        return tasks;
    }

    async update(taskId: string, task: UpdateTaskDTO) {
        const { name, category, priority, date, status, subCategory, subTask } = task;

        const existingTask = await this.taskModel.findById(taskId);

        if (!existingTask) throw new ConflictException("Essa task não existe");

        console.log(existingTask.name === name, existingTask.category === category, existingTask.date === date)

        const existingTaskName = await this.taskModel.findOne({ name: name, category: category, date: date, userId: existingTask.userId });

        if (existingTaskName !== null && existingTaskName?._id.toString() !== taskId) throw new ConflictException("Ja existe uma tarefa com esse nome");

        const taskToUpdate: any = {};
        if (name) taskToUpdate.name = name;
        if (category) taskToUpdate.category = category;
        if (priority) taskToUpdate.priority = priority;
        if (date) taskToUpdate.date = date;
        if (subCategory) taskToUpdate.subCategory = subCategory;
        if (subTask) {
            const updatedSubTasks = existingTask.subTask ?? [];

            const finalSubTasks = subTask.map(newSub => {
                if (!newSub._id) {
                    const alreadyExists = updatedSubTasks.find(st => st.task === newSub.task);
                    if (alreadyExists) throw new ConflictException("Essa sub Tarefa já existe");

                    return {
                        task: newSub.task,
                        status: newSub.status
                    }; // nova subTask (sem _id)
                } else {
                    const existingSub = updatedSubTasks.find(st => st._id?.toString() === newSub._id);
                    if (!existingSub) throw new ConflictException("Subtarefa não encontrada");

                    return {
                        _id: existingSub._id,
                        task: newSub.task,
                        status: newSub.status
                    };
                }
            });

            taskToUpdate.subTask = finalSubTasks;
        }

        const today = new Date();
        const todayStr = today.toISOString().split('T')[0];

        if (status !== undefined && status !== 'COMPLETED') {
            taskToUpdate.status = 'COMPLETED';
        } else {
            const taskDateStr = new Date(date || existingTask.date).toISOString().split('T')[0];

            if (taskDateStr === todayStr) {
                taskToUpdate.status = 'TODAY';
            } else if (taskDateStr < todayStr) {
                taskToUpdate.status = 'PENDING';
            } else {
                taskToUpdate.status = 'FUTURE';
            }
        }

        const updatedTask = await this.taskModel.findByIdAndUpdate(
            taskId,
            taskToUpdate,
            { new: true }
        ).exec();

        return updatedTask;

    }

    async updateStatus(user: TokenPayloadSchema) {
        const { sub: userId } = user;
        const today = new Date().toISOString().split('T')[0];

        const allTasks = await this.taskModel.find({ userId });

        const tasksToUpdate = allTasks.map(task => {
            const taskDate = new Date(task.date).toISOString().split('T')[0];

            let status = task.status;

            if (task.status !== 'COMPLETED') {
                if (taskDate === today) {
                    status = Status.TODAY;
                } else if (taskDate < today) {
                    status = Status.PENDING;
                } else {
                    status = Status.FUTURE;
                }
            }

            return {
                updateOne: {
                    filter: { _id: task._id },
                    update: { status }
                }
            };
        });

        if (tasksToUpdate.length > 0) {
            await this.taskModel.bulkWrite(tasksToUpdate);
        }

        return { message: 'Statuses updated successfully' };
    }

    async deleteSubTask(taskId: string, subTask: string) {
        const task = await this.taskModel.findById(taskId).exec();

        if (!task) {
            throw new NotFoundException("Tarefa não encontrada");
        }

        if (task.subTask) {
            const newSubTask = task.subTask.filter(task => task._id.toString() !== subTask)

            await this.taskModel.findByIdAndUpdate(taskId, { subTask: newSubTask }, { new: true }).exec()
        }

        return { message: "Sub tarefa excluída com sucesso" };
    }

    async delete(taskId: string, user: TokenPayloadSchema) {
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