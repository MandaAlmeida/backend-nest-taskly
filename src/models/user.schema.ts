import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Document, ObjectId } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({ collection: 'users', timestamps: true })
export class User {
    @Prop({
        required: true,
        auto: true,
        type: mongoose.Schema.Types.ObjectId,
    })
    _id: ObjectId;

    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    email: string;

    @Prop({ required: true })
    password: string;

    @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: 'Group', default: [] })
    groups: mongoose.Types.ObjectId[];

    @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: 'Annotation', default: [] })
    sharedAnnotations: mongoose.Types.ObjectId[];
}

export const UserSchema = SchemaFactory.createForClass(User);