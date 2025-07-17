import {Component} from '@angular/core';
import {WebsocketService} from '../../../../common/services/websocket.service';
import {AsyncPipe, JsonPipe} from '@angular/common';


@Component({
  selector: 'app-kiosk',
  templateUrl: './kiosk.component.html',
  imports: [
    AsyncPipe,
    JsonPipe
  ],
  styleUrls: ['./kiosk.component.css']
})
export class KioskComponent {

  public constructor(
    protected readonly webSocketService: WebsocketService
  ) {
  }


}
