import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { User } from '@prisma/client';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Response } from 'express';
import { TokensDto } from './dto/tokens.dto';
import { COOKIE_EXPIRATION } from './constants/constants';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  async register(user: CreateUserDto) {
    const hashedPassword = await this.hash(user.password);
    user.password = hashedPassword;
    return await this.userService.createUser(user);
  }

  async login(user: User) {
    const tokens = await this.getTokens(user.id);

    const hashedRefreshToken = await this.hash(tokens.refreshToken);

    await this.updateUserRefreshToken(user.id, hashedRefreshToken);

    return tokens;
  }

  async logout(userId: string) {
    await this.prisma.user.updateMany({
      where: {
        id: userId,
        refreshToken: {
          not: null,
        },
      },
      data: {
        refreshToken: null,
      },
    });
  }

  async refreshAccessToken(userId: string, refreshToken: string) {
    try {
      const user = await this.userService.getUserById(userId);

      if (!user || !user.refreshToken) {
        throw new ForbiddenException(
          'Access Denied: User not found or refreshToken missing',
        );
      }

      const isMatch = await bcrypt.compare(refreshToken, user.refreshToken);

      if (!isMatch) {
        throw new ForbiddenException('Access Denied: Invalid refresh token');
      }

      const tokens = await this.getTokens(user.id);

      const hashedRefreshToken = await this.hash(tokens.refreshToken);

      await this.updateUserRefreshToken(user.id, hashedRefreshToken);

      return tokens;
    } catch (error) {
      throw error;
    }
  }

  /**
|--------------------------------------------------
| UTILS FUNCTIONS
|--------------------------------------------------
*/

  async validateUser(username: string, password: string) {
    const user = await this.userService.getUserByEmail(username);

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new ForbiddenException('Invalid credentials');
    }

    const { password: _, ...result } = user;

    return result;
  }

  async hash(data: string) {
    const salt = await bcrypt.genSalt();

    return await bcrypt.hash(data, salt);
  }

  async updateUserRefreshToken(userId: string, hashedRefreshToken: string) {
    try {
      await this.userService.updateUser(userId, {
        refreshToken: hashedRefreshToken,
      });
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw new BadRequestException('Invalid refreshToken data');
      } else {
        throw new InternalServerErrorException('Failed to update refreshToken');
      }
    }
  }

  async getTokens(userId: string) {
    const payload = { sub: userId };

    const [access_token, refresh_token] = [
      this.jwtService.sign(payload, {
        secret: process.env.JWT_SECRET,
        expiresIn: '15m',
      }),
      this.jwtService.sign(payload, {
        secret: process.env.REFRESH_TOKEN_SECRET,
        expiresIn: '7d',
      }),
    ];

    return { accessToken: access_token, refreshToken: refresh_token };
  }

  storeTokensInCookies(res: Response, tokens: TokensDto) {
    res.cookie('access_token', tokens.accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      expires: new Date(Date.now() + COOKIE_EXPIRATION.ACCESS_TOKEN),
    });
    res.cookie('refresh_token', tokens.refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      expires: new Date(Date.now() + COOKIE_EXPIRATION.REFRESH_TOKEN),
    });
    res.send({ status: 'ok', message: 'tokens successfully stored' });
  }
}
