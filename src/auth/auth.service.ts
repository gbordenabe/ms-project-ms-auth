import { BadRequestException, Injectable } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { EncryptionService } from 'src/common/encryption.service';
import { ClientProxyMsProject } from 'src/common/proxy/client-proxy';
import { UserMSG } from 'src/common/constants';
import { firstValueFrom } from 'rxjs';
import { LoginDto } from './dto/login.dto';
import { microserviceResponses } from 'src/common/utils';

@Injectable()
export class AuthService {
  constructor(
    private readonly clientProxy: ClientProxyMsProject,
    private readonly encryptionService: EncryptionService,
  ) {}
  private _clientProxyUsers = this.clientProxy.clientProxyUsers();

  async login(loginDto: LoginDto) {
    try {
      const response = await firstValueFrom(
        this._clientProxyUsers.send(
          UserMSG.FIND_ONE_BY_USERNAME,
          loginDto.username,
        ),
      );
      if (response.isError) {
        throw new BadRequestException('Invalid credentials');
      }
      const user = response.result;
      const isCorrectPassword = await this.encryptionService.comparePasswords(
        loginDto.password,
        user.password,
      );
      if (!isCorrectPassword) {
        throw new BadRequestException('Invalid credentials');
      }
      delete user.password;
      return microserviceResponses.success(user);
    } catch (error) {
      return microserviceResponses.error(error);
    }
  }

  async register(registerDto: RegisterDto) {
    try {
      const responseVerification = await firstValueFrom(
        this._clientProxyUsers.send(
          UserMSG.CHECK_USERNAME_EMAIL_DISPONIBILITY,
          {
            username: registerDto.username,
            email: registerDto.email,
          },
        ),
      );

      if (responseVerification.isError) {
        return responseVerification;
      }

      const isAvaible = responseVerification.result;
      if (isAvaible) {
        const response = await firstValueFrom(
          this._clientProxyUsers.send(UserMSG.CREATE, registerDto),
        );
        return response;
      }
    } catch (error) {}
  }
}
