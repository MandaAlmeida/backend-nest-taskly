import { ConflictException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { TokenPayloadSchema } from "@/auth/jwt.strategy";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Annotation, AnnotationDocument } from "@/models/annotations.schema";
import { CreateAnnotationDTO } from "@/contracts/annotation.dto";

@Injectable()
export class AnnotationService {
    constructor(
        @InjectModel(Annotation.name) private annotationModel: Model<AnnotationDocument>
    ) { }

    async create(annotation: CreateAnnotationDTO, user: TokenPayloadSchema) {
        const { title, content, category, attachent, members } = annotation;

        const { sub: userId } = user;
        const existingAnnotation = await this.annotationModel.findOne({ title, category, createdUserId: userId });

        if (existingAnnotation) {
            throw new ConflictException("Essa anotacao já existe");
        }

        if (members) {
            const userIds = members.map(member => member.userId.toString());

            const uniqueUserIds = new Set(userIds);

            if (uniqueUserIds.size !== userIds.length) {
                throw new ConflictException("Não é permitido membros duplicados.");
            }
        }

        const annotationToCreate = {
            title,
            content,
            category,
            attachent,
            members,
            createdUserId: userId
        };

        const createdAnnotation = new this.annotationModel(annotationToCreate);
        await createdAnnotation.save();


        return annotationToCreate;
    }

    async createByGroup(annotation: CreateAnnotationDTO, groupId: string, user: TokenPayloadSchema) {
        const { title, content, category, attachent, members } = annotation;

        const { sub: userId } = user;
        const existingAnnotation = await this.annotationModel.findOne({ title, category, createdUserId: userId, groupId });

        if (existingAnnotation) {
            throw new ConflictException("Essa anotacao já existe");
        }

        if (members) {
            const userIds = members.map(member => member.userId.toString());

            const uniqueUserIds = new Set(userIds);

            if (uniqueUserIds.size !== userIds.length) {
                throw new ConflictException("Não é permitido membros duplicados.");
            }
        }

        const annotationToCreate = {
            title,
            content,
            category,
            attachent,
            groupId,
            members,
            createdUserId: userId
        };

        const createdAnnotation = new this.annotationModel(annotationToCreate);
        await createdAnnotation.save();

        return annotationToCreate;
    }

    async fetch(user: TokenPayloadSchema) {
        const { sub: userId } = user;

        const filter = {
            $or: [
                { createdUserId: userId },
                { 'members.userId': userId }
            ]
        };

        const Annotations = await this.annotationModel.find(filter).sort({ date: 1 }).exec();

        return Annotations
    }

    async fetchById(annotationId: string) {
        const Annotations = await this.annotationModel.findById(annotationId).sort({ date: 1 }).exec();

        return Annotations
    }

    async fetchByPage(user: TokenPayloadSchema, page: number) {
        const { sub: userId } = user;

        const filter = {
            $or: [
                { createdUserId: userId },
                { 'members.userId': userId }
            ]
        };
        const limit = 10;
        const skip = (page - 1) * limit;
        return await this.annotationModel.find(filter).sort({ createdAt: 1 }).skip(skip).limit(limit).exec();
    }

    async fetchBySearch(query: string, user: TokenPayloadSchema) {
        const { sub: userId } = user;
        const regex = new RegExp(query, 'i');
        const isDate = !isNaN(Date.parse(query));
        const filters: any[] = [
            { title: { $regex: regex } },
            { category: { $regex: regex } },
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

        const annotations = await this.annotationModel.find({
            createdUserId: userId,
            $or: filters,
        });

        return annotations;
    }

    async update(annotationId: string, annotation: CreateAnnotationDTO, user: TokenPayloadSchema) {
        const { title, content, category, attachent, groupId, members } = annotation;
        const { sub: userId } = user;

        const existingAnnotation = await this.annotationModel.findById(annotationId);

        if (!existingAnnotation) throw new ConflictException("Essa anotacao não existe");

        const existingAnnotationName = await this.annotationModel.findOne({ title, category, createdUserId: userId });

        if (existingAnnotationName) throw new ConflictException("Ja existe uma anotacao com esse nome");

        const annotationToUpdate: any = {};

        if (title) annotationToUpdate.title = title;
        if (category) annotationToUpdate.category = category;
        if (content) annotationToUpdate.content = content;

        const updatedAnnotation = await this.annotationModel.findByIdAndUpdate(
            annotationId,
            annotationToUpdate,
            { new: true }
        ).exec();

        return updatedAnnotation;

    }

    async addMember(annotationId: string, annotation: CreateAnnotationDTO, user: TokenPayloadSchema) {
        const { members = [] } = annotation;
        const userId = user.sub;

        const existingAnnotation = await this.annotationModel.findById(annotationId);

        if (!existingAnnotation) throw new ConflictException("Essa anotação não existe");

        const editedUserId = members.some(
            (member) => member.userId.toString() === userId
        );

        if (editedUserId) throw new ConflictException("Você não pode adicionar seu proprio Usuário");

        const userIds = members.map(member => member.userId.toString());

        const hasDuplicates = new Set(userIds).size !== userIds.length;

        if (hasDuplicates) throw new ConflictException("Usuário duplicado na lista de membros");


        const existingMembers = existingAnnotation.members || [];
        const newMembers = [...existingMembers];

        for (const member of members) {
            const alreadyExists = existingMembers.some(
                ({ userId: existingId }) => existingId.toString() === member.userId.toString()
            );
            if (alreadyExists) {
                throw new ConflictException("Usuário já cadastrado na lista de membros");
            }
            newMembers.push(member);
        }

        const updatedAnnotation = await this.annotationModel.findByIdAndUpdate(
            annotationId,
            { members: newMembers },
            { new: true }
        ).exec();

        return updatedAnnotation;
    }

    async updatePermissonMember(annotationId: string, memberId: string, body: { accessType: string }, user: TokenPayloadSchema) {
        const userId = user.sub;

        const type = body.accessType;

        const existingAnnotation = await this.annotationModel.findById(annotationId);

        if (!existingAnnotation) throw new ConflictException("Essa anotação não existe");

        const editedUserId = memberId === userId

        if (editedUserId) throw new ConflictException("Você não pode mudar a permissão do seu proprio usuário");

        const existingMember = existingAnnotation.members.some(member => member.userId.toString() === memberId)

        if (!existingMember) throw new ConflictException("Membro nao existe nessa anotação");


        const updatedMembers = existingAnnotation.members.map((member) => {
            if (member.userId.toString() === memberId) {
                return {
                    userId: memberId,
                    accessType: type,
                }
            }

            return member;
        });

        const updatedAnnotation = await this.annotationModel.findByIdAndUpdate(
            annotationId,
            { members: updatedMembers },
            { new: true }
        ).exec();

        return updatedAnnotation;
    }

    async deleteMember(annotationId: string, memberId: string, user: TokenPayloadSchema) {
        const { sub: userId } = user;

        const annotation = await this.annotationModel.findById(annotationId).exec();

        if (!annotation) throw new NotFoundException("Anotatacao não encontrada");

        if (annotation.createdUserId.toString() !== userId) throw new ForbiddenException("Você não tem permissão para excluir esta annotation");

        const existingAnnotation = await this.annotationModel.findById(annotationId);

        if (!existingAnnotation) throw new ConflictException("Essa anotacao não existe");

        const existingMember = existingAnnotation.members.some(member => member.userId.toString() === memberId)

        if (!existingMember) throw new ConflictException("Membro nao existe nessa anotação");


        const updatedMembers = annotation.members?.filter(
            member => member.userId.toString() !== memberId
        );

        const updatedAnnotation = await this.annotationModel.findByIdAndUpdate(
            annotationId,
            { members: updatedMembers },
            { new: true }
        ).exec();

        return updatedAnnotation;

    }

    async addGroup(annotationId: string, newGroupId: string) {
        const existingAnnotation = await this.annotationModel.findById(annotationId);

        if (!existingAnnotation) throw new ConflictException("Essa anotação não existe");


        const currentGroups = existingAnnotation.groupId || [];

        if (currentGroups) {
            currentGroups.map(group => {
                if (group === newGroupId) {
                    throw new ConflictException("Essa anotacao ja esta neste grupo");
                }
            })
        }

        const updatedGroups = [...currentGroups, newGroupId];

        const updatedAnnotation = await this.annotationModel.findByIdAndUpdate(
            annotationId,
            { groupId: updatedGroups },
            { new: true }
        ).exec();

        return updatedAnnotation;
    }

    async deleteGroup(annotationId: string, newGroupId: string) {
        const existingAnnotation = await this.annotationModel.findById(annotationId);

        if (!existingAnnotation) throw new ConflictException("Essa anotacao não existe");

        if (!existingAnnotation.groupId) throw new ConflictException("Essa anotacao nao esta em um grupo");


        const existingGroup = existingAnnotation.groupId.map(group => group === newGroupId)

        if (!existingGroup) throw new ConflictException("Grupo nao existe nessa anotação");


        const updatedGroups = existingAnnotation.groupId.filter(
            group => group !== newGroupId
        );

        const updatedAnnotation = await this.annotationModel.findByIdAndUpdate(
            annotationId,
            { groupId: updatedGroups },
            { new: true }
        ).exec();

        return updatedAnnotation;

    }

    async delete(annotationId: string, user: TokenPayloadSchema) {
        const { sub: userId } = user;

        const annotation = await this.annotationModel.findById(annotationId).exec();

        if (!annotation) throw new NotFoundException("Annotation não encontrada");


        if (annotation.createdUserId.toString() !== userId) throw new ForbiddenException("Você não tem permissão para excluir esta annotation");


        await this.annotationModel.findByIdAndDelete(annotationId).exec();

        return { message: "Anotacao excluída com sucesso" };
    }

}