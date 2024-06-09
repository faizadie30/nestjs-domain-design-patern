import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserHelper {
  encryptPassword(password: string): Promise<string> {
    const saltRounds = 10;
    const hashedPassword = bcrypt.hash(password, saltRounds);
    return hashedPassword;
  }

  comparePasswords(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }
}
