import { Injectable } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { EncryptionService } from 'src/common/encryption.service';
import { ClientProxyMsProject } from 'src/common/proxy/client-proxy';
import { UserMSG } from 'src/common/constants';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AuthService {
  constructor(
    private readonly clientProxy: ClientProxyMsProject,
    private readonly encryptionService: EncryptionService,
  ) {}
  private _clientProxyUsers = this.clientProxy.clientProxyUsers();

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
