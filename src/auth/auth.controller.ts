import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/user/dto/CreateUserDto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { GetCurrentUser } from './decorators/get-current-user.decorator';
import { User } from '@prisma/client';
import { Public } from './decorators/public.decorator';
import { Response } from 'express';

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
    console.log(user);

    const { access_token } = await this.authService.login(user);

    // -----------------Uncomment this to use cookies------------------------

    res
      .cookie('access_token', access_token, {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        expires: new Date(Date.now() + 1 * 24 * 60 * 1000),
      })
      .send({ status: 'ok' });
  }

  @Post('logout')
  logout() {
    return this.authService.logout();
  }

  @Post('refresh')
  refresh() {
    return this.authService.refresh();
  }
}
