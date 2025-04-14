import { Annotation, AnnotationSchema } from '@/models/annotations.schema';
import { AnnotationController } from '../controllers/annotation.controller';
import { AnnotationService } from '../services/annotation.service';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';


@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Annotation.name, schema: AnnotationSchema },
        ]),
    ],
    controllers: [AnnotationController],
    providers: [AnnotationService],
    exports: [MongooseModule]
})
export class AnnotationModule { }
