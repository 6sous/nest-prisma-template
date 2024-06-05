import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Put,
} from '@nestjs/common';
import { UserService } from './user.service';
import { GetCurrentUser } from 'src/auth/decorators/get-current-user.decorator';
import { UpdateUserDto } from './dto/update-user.dto';
import { TokenPayload } from 'src/auth/types/token-payload.type';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  getUsers() {
    return this.userService.getUsers();
  }

  @Get('profile')
  async getMe(@GetCurrentUser() payload: TokenPayload) {
    return await this.userService.getUserById(payload.sub);
  }

  @Put()
  @HttpCode(HttpStatus.NO_CONTENT)
  async update(
    @GetCurrentUser('sub') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.updateUser(id, updateUserDto);
  }
}
