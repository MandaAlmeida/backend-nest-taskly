import { Group, GroupSchema } from '@/models/groups.schema';
import { GroupController } from '../controllers/group.controller';
import { GroupService } from '../services/group.service';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';


@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Group.name, schema: GroupSchema },
        ]),
    ],
    controllers: [GroupController],
    providers: [GroupService],
    exports: [MongooseModule]
})
export class GroupModule { }
