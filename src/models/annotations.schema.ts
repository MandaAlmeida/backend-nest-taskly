import { Status } from '@/enum/status.enum';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { ObjectId } from 'mongoose';

export type AnnotationDocument = Annotation;

@Schema({ timestamps: true }) // adiciona createdAt e updatedAt automatico
export class Annotation {
    @Prop({
        required: true,
        auto: true,
        type: mongoose.Schema.Types.ObjectId,
    })
    _id: ObjectId;

    @Prop({ required: true })
    title: string;

    @Prop({ required: true })
    content: string;

    @Prop({ required: true })
    category: string

    @Prop({ required: true })
    createdUserId: string;

    @Prop({
        type: [
            {
                userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
                accessType: { type: String, enum: ['admin', 'invited'], required: true }
            }
        ],
        default: []
    })
    members: {
        userId: ObjectId;
        accessType: 'admin' | 'invited';
    }[];

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Group', required: false })
    groupId?: ObjectId;
}

export const AnnotationSchema = SchemaFactory.createForClass(Annotation);
