import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from '../../infrastructure/models/users.model';
import { RegisterDTO } from '../../app/dto/register.dto';
import { RegisterInteface } from '../../app/interface/register.interface';
import { Repository } from 'typeorm';
import { UserHelper } from '../../infrastructure/helpers/user.helper';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from '../../constants';
import { LoginInteface } from '../../app/interface/login.interface';
import { ConvertionHelper } from '../../infrastructure/helpers/convertion.helper';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
    private readonly userHelper: UserHelper,
    private readonly convertionHelper: ConvertionHelper,
    private jwtService: JwtService,
  ) {}

  async register(registerDTO: RegisterDTO): Promise<RegisterInteface> {
    const { email, username } = registerDTO;
    const checkUser = await this.usersRepository
      .createQueryBuilder('users')
      .where('users.email = :email', { email })
      .orWhere('users.username = :username', { username })
      .getExists();

    if (checkUser) {
      throw new ConflictException('Username or Email has been used');
    }

    registerDTO.password = await this.userHelper.encryptPassword(
      registerDTO.password,
    );
    await this.usersRepository.save(registerDTO);

    return {
      status: 'Success',
      message: 'Created on success',
    };
  }

  async validateUser(email: string, password: string): Promise<any> {
    const getUser = await this.usersRepository
      .createQueryBuilder('users')
      .where('users.email = :email', { email })
      .cache(60000)
      .getOne();

    if (!getUser) {
      return null;
    }

    const isPasswordValid = await this.userHelper.comparePasswords(
      password,
      getUser.password,
    );

    if (!isPasswordValid) {
      return null;
    }

    return getUser;
  }

  public async verifyToken(token: string): Promise<any> {
    try {
      const user = this.jwtService.verify(token, {
        secret: jwtConstants.secret,
      });

      return user;
    } catch (error) {
      return null;
    }
  }

  private async generateToken(user: Users) {
    return this.jwtService.sign(
      { sub: user.id, data: user },
      { expiresIn: jwtConstants.expiresIn, secret: jwtConstants.secret },
    );
  }

  async login(req: any, data_user: any): Promise<LoginInteface> {
    delete data_user.password;
    const token = await this.generateToken(data_user);
    data_user.id = this.convertionHelper.convertDataToNumber(data_user.id);
    data_user.token = token;
    req.session[`user${data_user.id}`] = data_user;
    delete data_user.token;

    return {
      data: data_user,
      token,
      status: 'success',
      message: 'login successfully',
    };
  }
}
