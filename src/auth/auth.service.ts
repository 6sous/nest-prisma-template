import { ForbiddenException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from 'src/user/dto/CreateUserDto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async register(user: CreateUserDto) {
    const hashedPassword = await this.hash(user.password);
    user.password = hashedPassword;
    return await this.userService.createUser(user);
  }

  async login(username: string, password: string) {
    const user = await this.userService.getUserByEmail(username);

    if (!user) {
      throw new ForbiddenException('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw new ForbiddenException('Invalid credentials');
    }

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

  async hash(password: string) {
    const salt = await bcrypt.genSalt();

    return await bcrypt.hash(password, salt);
  }
}
