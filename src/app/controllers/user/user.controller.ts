import {
  Body,
  Controller,
  HttpCode,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { RegisterDTO } from '../../../app/dto/register.dto';
import { PublicRoute } from '../../../infrastructure/decorator/public-route.decorator';
import { RegisterInteface } from '../../../app/interface/register.interface';
import { UserService } from '../../../domain/user/user.service';
import { LocalAuthGuard } from '../../../infrastructure/guard/local.guard';
import { LoginDTO } from '../../../app/dto/login.dto';
import { LoginInteface } from '../../interface/login.interface';

@ApiTags('Users')
@Controller('api/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  @PublicRoute()
  @HttpCode(201)
  async register(@Body() registerDTO: RegisterDTO): Promise<RegisterInteface> {
    try {
      return await this.userService.register(registerDTO);
    } catch (error) {
      throw error;
    }
  }

  @UseGuards(LocalAuthGuard)
  @PublicRoute()
  @Post('signin')
  @ApiBody({ type: LoginDTO })
  @HttpCode(200)
  async login(@Request() request: any): Promise<LoginInteface> {
    return this.userService.login(request, request.user);
  }
}
