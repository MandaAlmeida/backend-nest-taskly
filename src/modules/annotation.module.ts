import { Annotation, AnnotationSchema } from '@/models/annotations.schema';
import { AnnotationController } from '../controllers/annotation.controller';
import { AnnotationService } from '../services/annotation.service';
import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GroupModule } from './group.module';


@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Annotation.name, schema: AnnotationSchema },
        ]),
        forwardRef(() => GroupModule),
    ],
    controllers: [AnnotationController],
    providers: [AnnotationService],
    exports: [MongooseModule, AnnotationService]
})
export class AnnotationModule { }
