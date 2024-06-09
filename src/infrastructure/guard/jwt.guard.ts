import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from '../decorator/public-route.decorator';
import { UserService } from '../../domain/user/user.service';

@Injectable()
export class JWTAuthGuard extends AuthGuard('jwt_auth') {
  constructor(
    private userService: UserService,
    private reflector: Reflector,
  ) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<any> {
    try {
      const isPublic = this.reflector.getAllAndOverride<boolean>(
        IS_PUBLIC_KEY,
        [context.getHandler(), context.getClass()],
      );

      if (isPublic) {
        return true;
      }

      const request = context.switchToHttp().getRequest();
      const auth = request.headers['authorization'];
      const token = auth.split(' ')[1];
      const user = await this.userService.verifyToken(token);
      if (user) {
        user.token = token;
        request['user'] = user;
        return true;
      }
      return super.canActivate(context);
    } catch (error) {
      console.error(error);
      throw new UnauthorizedException('token expired');
    }
  }
}
