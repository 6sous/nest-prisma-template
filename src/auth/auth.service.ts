import { ForbiddenException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { CreateUserDto } from 'src/user/dto/CreateUserDto';
import * as bcrypt from 'bcrypt';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async register(user: CreateUserDto) {
    const hashedPassword = await this.hash(user.password);
    user.password = hashedPassword;
    return await this.userService.createUser(user);
  }

  async login(user: User) {
    const payload = { sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async logout() {
    return 'logout';
  }

  async refresh() {
    return 'refresh';
  }

  /**
|--------------------------------------------------
| UTILS FUNCTIONS
|--------------------------------------------------
*/

  async validateUser(username: string, password: string) {
    const user = await this.userService.getUserByEmail(username);

    if (!user) {
      throw new ForbiddenException('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw new ForbiddenException('Invalid credentials');
    }

    const { password: _, ...result } = user;

    return result;
  }

  async hash(password: string) {
    const salt = await bcrypt.genSalt();

    return await bcrypt.hash(password, salt);
  }
}
