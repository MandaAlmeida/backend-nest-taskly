import { ConflictException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { TokenPayloadSchema } from "@/auth/jwt.strategy";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Status } from "@/enum/status.enum";
import { Annotation, AnnotationDocument } from "@/models/annotations.schema";
import { CreateAnnotationDTO } from "@/contracts/annotation.dto";

@Injectable()
export class AnnotationService {
    constructor(
        @InjectModel(Annotation.name) private annotationModel: Model<AnnotationDocument>
    ) { }

    async create(annotation: CreateAnnotationDTO, user: TokenPayloadSchema) {
        const { title, content, category, attachent, groupId, members } = annotation;

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
        return await this.annotationModel.find(filter).sort({ date: 1 }).exec();
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

        if (!existingAnnotation) {
            throw new ConflictException("Essa anotacao não existe");
        }

        const isOwner = existingAnnotation.createdUserId.toString() === userId;
        const isEditor = existingAnnotation.members?.some(
            (member) => member.userId.toString() === userId && member.accessType === 'admin'
        );

        if (!isOwner && !isEditor) {
            throw new ConflictException("Você não tem acesso para editar essa anotação");
        }

        const existingAnnotationName = await this.annotationModel.findOne({ title, category, createdUserId: userId });

        if (existingAnnotationName) {
            throw new ConflictException("Ja existe uma anotacao com esse nome");
        }

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
        const { members } = annotation;
        const { sub: userId } = user;

        const existingAnnotation = await this.annotationModel.findById(annotationId);

        if (!existingAnnotation) {
            throw new ConflictException("Essa anotacao não existe");
        }

        const isOwner = existingAnnotation.createdUserId.toString() === userId;
        const isEditor = existingAnnotation.members?.some(
            (member) => member.userId.toString() === userId && member.accessType === 'admin'
        );

        if (!isOwner && !isEditor) {
            throw new ConflictException("Você não tem acesso para editar essa anotação");
        }

        const annotationToUpdate: any = {};

        if (members && members.length > 0) {
            const userIds = members.map(membro => membro.userId.toString());
            const duplicates = userIds.filter((id, index) => userIds.indexOf(id) !== index);

            if (duplicates.length > 0) {
                throw new ConflictException(`Usuário duplicado na lista de membros`);
            }

            const existingMembers = existingAnnotation.members || [];
            const updateMembers = [...existingMembers];

            members.forEach(newMember => {
                const index = updateMembers.findIndex(
                    member => member.userId.toString() === newMember.userId.toString()
                );

                if (index < 0) {
                    updateMembers.push(newMember);
                } else {
                    const existingAccess = updateMembers[index].accessType;
                    const newAccess = newMember.accessType;

                    if (existingAccess !== newAccess) {

                        updateMembers[index].accessType = newAccess;
                    }
                }
            });

            annotationToUpdate.members = updateMembers;
        }

        const updatedAnnotation = await this.annotationModel.findByIdAndUpdate(
            annotationId,
            annotationToUpdate,
            { new: true }
        ).exec();

        return updatedAnnotation;

    }

    async deleteMember(annotationId: string, memberId: string, user: TokenPayloadSchema) {
        const { sub: userId } = user;

        const annotation = await this.annotationModel.findById(annotationId).exec();

        if (!annotation) {
            throw new NotFoundException("Annotation não encontrada");
        }

        if (annotation.createdUserId.toString() !== userId) {
            throw new ForbiddenException("Você não tem permissão para excluir esta annotation");
        }

        const existingAnnotation = await this.annotationModel.findById(annotationId);

        if (!existingAnnotation) {
            throw new ConflictException("Essa anotacao não existe");
        }

        const isOwner = existingAnnotation.createdUserId.toString() === userId;
        const isEditor = existingAnnotation.members?.some(
            (member) => member.userId.toString() === userId && member.accessType === 'admin'
        );

        if (!isOwner && !isEditor) {
            throw new ConflictException("Você não tem acesso para editar essa anotação");
        }

        const updatedMembers = annotation.members?.filter(
            member => member.userId.toString() !== memberId
        ) || [];

        const updatedAnnotation = await this.annotationModel.findByIdAndUpdate(
            annotationId,
            { members: updatedMembers },
            { new: true }
        ).exec();

        return updatedAnnotation;

    }

    async delete(annotationId: string, user: TokenPayloadSchema) {
        const { sub: userId } = user;

        const annotation = await this.annotationModel.findById(annotationId).exec();

        if (!annotation) {
            throw new NotFoundException("Annotation não encontrada");
        }

        if (annotation.createdUserId.toString() !== userId) {
            throw new ForbiddenException("Você não tem permissão para excluir esta annotation");
        }

        await this.annotationModel.findByIdAndDelete(annotationId).exec();

        return { message: "Anotacao excluída com sucesso" };
    }

}