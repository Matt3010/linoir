import {Component} from '@angular/core';
import {Message, WebsocketService} from '../../../common/services/websocket.service';
import {AsyncPipe, JsonPipe} from '@angular/common';
import {DefaultMessage} from '../../../common/entities/wsPayloads/default-message';
import {Observable} from 'rxjs';


@Component({
  selector: 'lin-hello-plugin-2',
  imports: [
    JsonPipe,
    AsyncPipe
  ],
  templateUrl: './hello-plugin.html',
  styleUrl: './hello-plugin.css'
})
export class HelloPlugin2 {
  public messages$: Observable<Message<DefaultMessage>[]>;

  public constructor(
    protected readonly webSocketService: WebsocketService,
  ) {
    this.messages$ = this.webSocketService.subscribe<DefaultMessage>('AAA');
  }

}
