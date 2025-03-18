import { TaskController } from '../controllers/task.controller';
import { CreateTasksRepositorie } from '../repositories/create-task.repositorie';
import { FetchTaskRepositorie } from '../repositories/fetch-recent-task.repositorie';
import { Task, TaskSchema } from '../schema/task.schema';
import { CreateTaskService, FetchTaskService } from '../services/task.service';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';


@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Task.name, schema: TaskSchema },
        ]),
    ],
    controllers: [TaskController],
    providers: [CreateTasksRepositorie, FetchTaskRepositorie, CreateTaskService, FetchTaskService],
})
export class TaskModule { }
