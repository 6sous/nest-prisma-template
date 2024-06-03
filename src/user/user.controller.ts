import { Controller, Get } from '@nestjs/common';
import { UserService } from './user.service';
import { GetCurrentUser } from 'src/auth/decorators/get-current-user.decorator';
import { TokenPayload } from 'src/auth/types/tokens.type';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  getUsers() {
    return this.userService.getUsers();
  }

  @Get('profile')
  async getMe(@GetCurrentUser() payload: TokenPayload) {
    const user = await this.userService.getUserById(payload.sub);

    return user;
  }
}
