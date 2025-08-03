import {Component, input, InputSignal, OnDestroy, OnInit} from '@angular/core';
import {AuthComponent, TelegramLoginEventPayload} from './components/auth/auth.component';
import {Message, WebsocketService} from '../../../../../../../common/services/websocket.service';
import {Subscription} from 'rxjs';
import {TelegramMessagePayload} from '../../../TelegramPlugin';
import {MixedTelegramPlugin} from '../../../../../entities';

@Component({
  selector: 'lin-kiosk-telegram',
  templateUrl: './kiosk-telegram.component.html',
  imports: [
    AuthComponent
  ],
  styleUrl: './kiosk-telegram.component.css'
})
export class KioskTelegramComponent implements OnInit, OnDestroy {
  public classInput: InputSignal<MixedTelegramPlugin> = input.required<MixedTelegramPlugin>();
  private readonly subscription: Subscription = new Subscription(); // To manage subscriptions

  public constructor(
    private readonly webSockerService: WebsocketService,
  ) {
  }

  ngOnInit(): void {
    const loginRequest: Message<TelegramLoginEventPayload> = {
      topic: "TelegramPlugin:LoginEvent",
      payload: {
        apiId: this.classInput().configuration.apiId,
        apiHash: this.classInput().configuration.apiHash,
        stringSession: this.classInput().configuration.stringSession ?? '',
        isLogged: this.classInput().configuration.isLogged
      },
      ignoreSelf: false,
    }
    this.webSockerService.send(loginRequest)

    const loginSub: Subscription = this.webSockerService.subscribeToLatestMessage<TelegramLoginEventPayload>('TelegramPlugin:LoginEvent')
      .subscribe((res: Message<TelegramLoginEventPayload>): void => {
        console.log(`Received login event:`, res);
        const currentConfig: TelegramMessagePayload = this.classInput().configuration;
        if (currentConfig.stringSession !== res.payload.stringSession || currentConfig.isLogged !== res.payload.isLogged) {
          this.classInput().updateConfiguration({
            stringSession: res.payload.stringSession,
            isLogged: res.payload.isLogged
          }, false);
        }
      });

    this.subscription.add(loginSub);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
