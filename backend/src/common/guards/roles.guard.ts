import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '../enums';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: UserRole[]) => {
  const decorator = (target: any, key: string, descriptor: PropertyDescriptor) => {
    Reflect.defineMetadata(ROLES_KEY, roles, descriptor.value);
    return descriptor;
  };
  return decorator;
};

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<UserRole[]>(ROLES_KEY, context.getHandler());
    if (!requiredRoles || requiredRoles.length === 0) return true;

    const { user } = context.switchToHttp().getRequest();
    if (!user) throw new ForbiddenException('Not authenticated');

    if (!requiredRoles.includes(user.role)) {
      throw new ForbiddenException(
        `Role '${user.role}' does not have access to this resource`,
      );
    }
    return true;
  }
}
