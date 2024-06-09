import { ExecutionContext, HttpStatus, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { LoginDTO } from '../../app/dto/login.dto';

@Injectable()
export class LocalAuthGuard extends AuthGuard('authentication_guard') {
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();

    const body = plainToClass(LoginDTO, request.body);

    const errors = await validate(body);

    const errorMessages = errors.map((error) => ({
      field: error.property,
      error: Object.values(error.constraints).join(', '),
    }));

    if (errorMessages.length > 0) {
      response.code(HttpStatus.BAD_REQUEST).send({
        statusCode: HttpStatus.BAD_REQUEST,
        error: 'Bad Request',
        message: errorMessages,
      });
    }

    return super.canActivate(context) as boolean | Promise<boolean>;
  }
}
