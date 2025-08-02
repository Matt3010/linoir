import {ChangeDetectionStrategy, Component, input, InputSignal} from '@angular/core';
import {TelegramPluginWithMixins} from '../../../../../../../entities';
import {Message, WebsocketService} from '../../../../../../../../../common/services/websocket.service';
import {QRCodeComponent} from 'angularx-qrcode';
import {Observable} from 'rxjs';
import {AsyncPipe} from '@angular/common';

export interface TelegramLoginEventPayload {
  apiId: number;
  apiHash: string;
  stringSession: string;
  isLogged: boolean;
}

interface TelegramQrCodeTokenEventPayload {
  qrCodeToken: string;
}

interface TelegramQrCode2FAEventRequestPayload {
  hint: string | null;
}

interface TelegramQrCode2FAEventResponsePayload {
  password: string;
}

interface TelegramQrCodeLoginErrorEventPayload {
  error: string;
}

@Component({
  selector: 'lin-auth',
  imports: [
    QRCodeComponent,
    AsyncPipe
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css'
})
export class AuthComponent {

  public classInput: InputSignal<InstanceType<typeof TelegramPluginWithMixins>> = input.required<InstanceType<typeof TelegramPluginWithMixins>>();

  public constructor(
    private readonly webSockerService: WebsocketService,
  ) {
  }

  protected get qrCode(): Observable<Message<TelegramQrCodeTokenEventPayload>> {
    return this.webSockerService.subscribeToLatestMessage<TelegramQrCodeTokenEventPayload>('TelegramPluginLoginQrCodeTokenUpdate');
  }
}
