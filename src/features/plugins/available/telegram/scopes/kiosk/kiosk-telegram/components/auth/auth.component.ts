import {ChangeDetectionStrategy, Component, input, InputSignal, OnInit} from '@angular/core';
import {TelegramPluginWithMixins} from '../../../../../../../entities';
import {Message, WebsocketService} from '../../../../../../../../../common/services/websocket.service';
import {QRCodeComponent} from 'angularx-qrcode';
import {filter, Observable} from 'rxjs';
import {AsyncPipe} from '@angular/common';


interface TelegramLoginEventPayload {
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
export class AuthComponent implements OnInit {

  public classInput: InputSignal<InstanceType<typeof TelegramPluginWithMixins>> = input.required<InstanceType<typeof TelegramPluginWithMixins>>();

  public constructor(
    private readonly webSockerService: WebsocketService,
  ) {
  }

  ngOnInit(): void {
    const loginRequest: Message<TelegramLoginEventPayload> = {
      topic: "TelegramLoginEventPayload",
      payload: {
        apiId: this.classInput().configuration.apiId,
        apiHash: this.classInput().configuration.apiHash,
        stringSession: this.classInput().configuration.stringSession ?? '',
        isLogged: this.classInput().configuration.isLogged
      },
      ignoreSelf: false,
    }
    this.webSockerService.send(loginRequest)

    this.webSockerService.subscribeToLatestMessage<TelegramLoginEventPayload>('TelegramLoginEventPayload')
      .pipe(
        filter((message: Message<TelegramLoginEventPayload>): boolean => message.payload.isLogged)
      )
      .subscribe((res: Message<TelegramLoginEventPayload>): void => {
        this.classInput().configuration = {
          ...this.classInput().configuration,
          stringSession: res.payload.stringSession,
          isLogged: res.payload.isLogged,
        }
      })
  }

  protected get qrCode(): Observable<Message<TelegramQrCodeTokenEventPayload>> {
    return this.webSockerService.subscribeToLatestMessage<TelegramQrCodeTokenEventPayload>('TelegramPluginLoginQrCodeTokenUpdate')
  }

}
