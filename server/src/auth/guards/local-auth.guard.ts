import { UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

export class LocalAuthGuard extends AuthGuard('local') {
  constructor() {
    super();
  }

  handleRequest(err: any, user: any) {
    console.log({ error: err }, { user: user });

    if (err || !user) {
      throw err || new UnauthorizedException('You should not pass!! 🥸');
    }
    return user;
  }
}
