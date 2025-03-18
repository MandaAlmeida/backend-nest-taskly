import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument } from 'mongoose';

export type TaskDocument = HydratedDocument<Task>

@Schema({ collection: 'tasks', timestamps: true })
export class Task extends Document {
    @Prop({ required: true })
    name!: string;

    @Prop({ required: true })
    category!: string;

    @Prop({ required: true })
    priority!: string;

    @Prop({ required: true })
    date!: Date;

    @Prop({ default: true })
    active!: boolean;

    @Prop({ required: true, type: String })
    userId!: string;
}

export const TaskSchema = SchemaFactory.createForClass(Task);
