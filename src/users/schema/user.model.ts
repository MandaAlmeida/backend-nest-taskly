import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Document } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({ collection: 'users', timestamps: true })
export class User extends Document {
    @Prop({ required: true })
    name!: string;
    @Prop({ required: true })
    email!: string;
    @Prop({ required: true })
    password!: string
}

export const UserSchema = SchemaFactory.createForClass(User);