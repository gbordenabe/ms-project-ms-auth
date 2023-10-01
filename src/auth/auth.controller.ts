import { Controller } from '@nestjs/common';
import { AuthService } from './auth.service';

import { AuthMSG } from 'src/common/constants';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { RegisterDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern(AuthMSG.REGISTER)
  register(@Payload() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }
}
