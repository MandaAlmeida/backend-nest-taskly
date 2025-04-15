import {
    CanActivate,
    ExecutionContext,
    Injectable,
    ForbiddenException,
    Inject,
    forwardRef,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AnnotationService } from '../services/annotation.service';
import { ROLES_KEY } from '@/decorator/roles.decorator';
import { GroupService } from '@/services/group.service';

@Injectable()
export class AnnotationRoleGuard implements CanActivate {
    constructor(
        private reflector: Reflector,
        @Inject(forwardRef(() => AnnotationService))
        private readonly annotationService: AnnotationService,
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        if (!requiredRoles) return true;

        const request = context.switchToHttp().getRequest();
        const user = request.user;

        const annotationId = request.params.annotationId
        if (!annotationId) throw new ForbiddenException('Anotação não informada');

        const annotation = await this.annotationService.fetchById(annotationId);
        if (!annotation) throw new ForbiddenException('Anotação não encontrada');

        const isOwner = annotation.createdUserId.toString() === user.sub;
        const member = annotation.members.find(
            (m) => m.userId.toString() === user.sub
        );

        const hasPermission = isOwner || (member && requiredRoles.includes(member.accessType));

        if (!hasPermission) {
            throw new ForbiddenException('Você não tem permissão para acessar essa rota');
        }

        return true;
    }
}

@Injectable()
export class GroupRoleGuard implements CanActivate {
    constructor(
        private reflector: Reflector,
        @Inject(forwardRef(() => GroupService))
        private readonly groupService: GroupService,
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        if (!requiredRoles) return true;

        const request = context.switchToHttp().getRequest();
        const user = request.user;

        const groupId = request.params.groupId
        if (!groupId) throw new ForbiddenException('Grupo não informada');

        const group = await this.groupService.fetchById(groupId);
        if (!group) throw new ForbiddenException('Grupo não encontrada');

        const isOwner = group.createdUserId.toString() === user.sub;
        const member = group.members.find(
            (m) => m.userId.toString() === user.sub
        );

        const hasPermission =
            isOwner || (member && requiredRoles.includes(member.accessType));

        if (!hasPermission) {
            throw new ForbiddenException('Você não tem permissão para acessar essa rota');
        }

        return true;
    }
}
