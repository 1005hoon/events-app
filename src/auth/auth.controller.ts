import { AuthGuardJwt } from './auth-guard.jwt';
import { AuthGuardLocal } from './auth-guard.local';
import { AuthService } from './auth.service';
import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Post,
  SerializeOptions,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CurrentUser } from './current-user.decorator';
import { User } from './user.entity';

@Controller('auth')
@SerializeOptions({ strategy: 'excludeAll' })
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(AuthGuardLocal)
  async login(@CurrentUser() user: User) {
    return {
      userId: user.id,
      token: this.authService.getTokenForUser(user),
    };
  }

  @Get('profile')
  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(AuthGuardJwt)
  async getProfile(@CurrentUser() user: User) {
    return user;
  }
}
