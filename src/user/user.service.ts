import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

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
    try {
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
          description: `User with email ${existingUser.email} or pseudo ${existingUser.pseudo} already exists.`,
        });
      }

      return await this.prisma.user.create({
        data: createUserDto,
      });
    } catch (error) {
      if (error instanceof ForbiddenException) {
        throw error;
      } else {
        throw new Error(error.message);
      }
    }
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto) {
    try {
      return await this.prisma.user.update({
        where: { id },
        data: updateUserDto,
      });
    } catch (error) {
      throw new NotFoundException('User not found');
    }
  }
}
