import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument } from 'mongoose';

export type CategoriesDocument = HydratedDocument<Categories>

@Schema({ collection: 'categories' })
export class Categories extends Document {
    @Prop({ required: true })
    name!: string;
    @Prop({ required: true, type: String })
    userId!: string;
}

export const CategoriesSchema = SchemaFactory.createForClass(Categories);
