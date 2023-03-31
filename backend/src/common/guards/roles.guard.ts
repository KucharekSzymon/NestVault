import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { User } from 'src/users/schemas/user.schema';

@Injectable()
export class RolesGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const user: User = context.switchToHttp().getRequest().user;

    return user && user.isAdmin;
  }
}
