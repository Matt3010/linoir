import {Component} from '@angular/core';
import {WebsocketService} from '../../../../common/services/websocket.service';
import {AsyncPipe, JsonPipe} from '@angular/common';


@Component({
  selector: 'app-deck',
  templateUrl: './deck.component.html',
  imports: [
    AsyncPipe,
    JsonPipe
  ],
  styleUrls: ['./deck.component.css']
})
export class DeckComponent {

  public constructor(
    protected readonly webSocketService: WebsocketService
  ) {
  }


}
