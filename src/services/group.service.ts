import { ConflictException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { TokenPayloadSchema } from "@/auth/jwt.strategy";
import { InjectModel } from "@nestjs/mongoose";
import { Group, GroupDocument } from "@/models/groups.schema";
import { Model } from "mongoose";
import { CreateGroupDTO, UpdateGroupDTO } from "@/contracts/group.dto";

@Injectable()
export class GroupService {
    constructor(
        @InjectModel(Group.name) private groupModel: Model<GroupDocument>
    ) { }

    async create(group: CreateGroupDTO, user: TokenPayloadSchema) {
        const { name, description, members } = group;

        const { sub: userId } = user;

        const existingGroup = await this.groupModel.findOne({ name, createdUserId: userId });

        if (existingGroup) {
            throw new ConflictException("Essa grupo já existe");
        }

        if (members) {
            const userIds = members.map(member => member.userId.toString());

            const uniqueUserIds = new Set(userIds);

            if (uniqueUserIds.size !== userIds.length) {
                throw new ConflictException("Não é permitido membros duplicados.");
            }
        }

        const groupToCreate = {
            name,
            createdUserId: userId,
            description,
            members
        };

        const createdGroup = new this.groupModel(groupToCreate);
        await createdGroup.save();

        return groupToCreate;
    }

    async fetch(user: TokenPayloadSchema) {
        const { sub: userId } = user;

        const filter = {
            $or: [
                { createdUserId: userId },
                { 'members.userId': userId }
            ]
        };

        return await this.groupModel.find(filter).exec();
    }

    async fetchByPage(user: TokenPayloadSchema, page: number) {
        const { sub: userId } = user;

        const filter = {
            $or: [
                { createdUserId: userId },
                { 'members.userId': userId }
            ]
        };

        const limit = 20;
        const skip = (page - 1) * limit;
        return await this.groupModel.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).exec();
    }

    async fetchBySearch(query: string, user: TokenPayloadSchema) {
        const { sub: userId } = user;
        const regex = new RegExp(query, 'i');
        const isDate = !isNaN(Date.parse(query));
        const filters: any[] = [
            { name: { $regex: regex } },
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

        const groups = await this.groupModel.find({
            createdUserId: userId,
            $or: filters,
        });

        return groups;
    }

    async update(groupId: string, group: UpdateGroupDTO, user: TokenPayloadSchema) {
        const { name, description, members } = group;
        const { sub: userId } = user;

        const existingGroup = await this.groupModel.findById(groupId);
        if (!existingGroup) {
            throw new ConflictException("Essa group não existe");
        }
        if (existingGroup.createdUserId.toString() !== userId) {
            throw new ConflictException("Voce nao tem acesso a essa tarefa");
        }

        const existingGroupName = await this.groupModel.findOne({ name, createdUserId: userId });

        if (existingGroupName) {
            throw new ConflictException("Ja existe um grupo com esse nome");
        }

        const groupToUpdate: any = {};

        if (name) groupToUpdate.name = name;
        if (description) groupToUpdate.description = description;
        if (members && members.length > 0) {
            const userIds = members.map(membro => membro.userId.toString());

            const duplicates = userIds.filter((id, i) => userIds.indexOf(id) !== i);

            if (duplicates.length > 0) {
                throw new ConflictException(`Usuário duplicado na lista de membros`);
            }
            const existingMembers = existingGroup.members || [];

            const updateMembers = [...existingMembers]

            members.forEach(newMember => {
                const existingMembers = updateMembers.findIndex(
                    member => member.userId.toString() === newMember.userId.toString()
                )

                if (!existingMembers) {
                    return updateMembers.push(newMember)
                }

                if (updateMembers[existingMembers].accessType !== newMember.accessType) {
                    updateMembers[existingMembers].accessType = newMember.accessType
                }
            })

            groupToUpdate.members = updateMembers;
        }


        const updatedGroup = await this.groupModel.findByIdAndUpdate(
            groupId,
            groupToUpdate,
            { new: true }
        ).exec();

        return updatedGroup;

    }

    async deleteMember(groupId: string, memberId: string, user: TokenPayloadSchema) {
        const { sub: userId } = user;

        const group = await this.groupModel.findById(groupId).exec();

        if (!group) {
            throw new NotFoundException("Group não encontrada");
        }

        if (group.createdUserId.toString() !== userId) {
            throw new ForbiddenException("Você não tem permissão para excluir esta group");
        }

        const existingGroup = await this.groupModel.findById(groupId);

        if (!existingGroup) {
            throw new ConflictException("Essa anotacao não existe");
        }

        const isOwner = existingGroup.createdUserId.toString() === userId;
        const isEditor = existingGroup.members?.some(
            (member) => member.userId.toString() === userId && member.accessType === 'admin'
        );

        if (!isOwner && !isEditor) {
            throw new ConflictException("Você não tem acesso para editar essa anotação");
        }

        const updatedMembers = group.members?.filter(
            member => member.userId.toString() !== memberId
        ) || [];

        const updatedGroup = await this.groupModel.findByIdAndUpdate(
            groupId,
            { members: updatedMembers },
            { new: true }
        ).exec();

        return updatedGroup;

    }

    async delete(groupId: string, user: TokenPayloadSchema) {
        const { sub: userId } = user;

        const group = await this.groupModel.findById(groupId).exec();

        if (!group) {
            throw new NotFoundException("Grupo não encontrada");
        }

        // Verifica se o usuário é o dono da group
        if (group.createdUserId.toString() !== userId) {
            throw new ForbiddenException("Você não tem permissão para excluir esta group");
        }

        // Se for o dono, pode deletar
        await this.groupModel.findByIdAndDelete(groupId).exec();

        return { message: "Grupo excluída com sucesso" };
    }

}