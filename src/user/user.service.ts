import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/CreateUserDto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async getUsers() {
    return await this.prisma.user.findMany();
  }

  getUserByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  getUserById(id: string) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async createUser(createUserDto: CreateUserDto) {
    return await this.prisma.user.create({
      data: createUserDto,
    });
  }
}
