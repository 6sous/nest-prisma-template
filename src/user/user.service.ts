import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/CreateUserDto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async getUsers() {
    return await this.prisma.user.findMany();
  }

  async getUserByEmail(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async getUserById(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async createUser(createUserDto: CreateUserDto) {
    const existingUser = await this.prisma.user.findFirst({
      where: {
        AND: [
          { email: createUserDto.email },
          { OR: [{ pseudo: createUserDto.pseudo }] },
        ],
      },
    });

    if (existingUser) {
      throw new ForbiddenException('User already exists', {
        cause: new Error(),
        description: `${existingUser.email} or ${existingUser.pseudo} already used`,
      });
    }

    return await this.prisma.user.create({
      data: createUserDto,
    });
  }
}
