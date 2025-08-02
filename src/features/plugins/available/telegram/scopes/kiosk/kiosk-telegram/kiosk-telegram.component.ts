import {Component, input, InputSignal, OnDestroy, OnInit} from '@angular/core';
import {TelegramPluginWithMixins} from '../../../../../entities';
import {AuthComponent, TelegramLoginEventPayload} from './components/auth/auth.component';
import {Message, WebsocketService} from '../../../../../../../common/services/websocket.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'lin-kiosk-telegram',
  templateUrl: './kiosk-telegram.component.html',
  imports: [
    AuthComponent
  ],
  styleUrl: './kiosk-telegram.component.css'
})
export class KioskTelegramComponent implements OnInit, OnDestroy {
  public classInput: InputSignal<InstanceType<typeof TelegramPluginWithMixins>> = input.required<InstanceType<typeof TelegramPluginWithMixins>>();
  private readonly subscription: Subscription = new Subscription(); // To manage subscriptions

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

    const loginSub = this.webSockerService.subscribeToLatestMessage<TelegramLoginEventPayload>('TelegramLoginEventPayload')
      .subscribe((res: Message<TelegramLoginEventPayload>): void => {
        const currentConfig = this.classInput().configuration;

        if (currentConfig.stringSession !== res.payload.stringSession || currentConfig.isLogged !== res.payload.isLogged) {
          console.log('Configuration changed, updating...');
          this.classInput().configuration = {
            ...currentConfig,
            stringSession: res.payload.stringSession,
            isLogged: res.payload.isLogged,
          };
          this.classInput().updateAllClientsConfig(this.classInput().configuration)
        }
      });

    this.subscription.add(loginSub);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
