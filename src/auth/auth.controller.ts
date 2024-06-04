import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { GetCurrentUser } from './decorators/get-current-user.decorator';
import { User } from '@prisma/client';
import { Public } from './decorators/public.decorator';
import { Request, Response } from 'express';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { RefreshTokenAuthGuard } from './guards/refresh-token-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() createUserDto: CreateUserDto) {
    return await this.authService.register(createUserDto);
  }

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@GetCurrentUser() user: User, @Res() res: Response) {
    const tokens = await this.authService.login(user);

    this.authService.storeTokensInCookies(res, tokens);

    res.send({ status: 'ok', message: 'tokens successfully stored' });
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@GetCurrentUser('sub') userId: string, @Res() res: Response) {
    await this.authService.logout(userId);
    res.clearCookie('access_token');
    res.clearCookie('refresh_token').send({ status: 'ok' });
  }

  @Public()
  @UseGuards(RefreshTokenAuthGuard)
  @Post('refresh')
  async refresh(
    @GetCurrentUser('sub') userId: string,
    @Res() res: Response,
    @Req() req: Request,
  ) {
    const refreshToken = req.cookies.refresh_token;

    try {
      const newTokens = await this.authService.refreshAccessToken(
        userId,
        refreshToken,
      );
      return this.authService.storeTokensInCookies(res, newTokens);
    } catch (error) {
      throw error;
    }
  }
}
