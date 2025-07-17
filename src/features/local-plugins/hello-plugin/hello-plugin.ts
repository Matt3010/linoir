import {Component} from '@angular/core';
import {WebsocketService} from '../../../common/services/websocket.service';

@Component({
  selector: 'lin-hello-plugin',
  imports: [],
  templateUrl: './hello-plugin.html',
  styleUrl: './hello-plugin.css'
})
export class HelloPlugin {


  public constructor(
    protected readonly webSocketService: WebsocketService
  ) {
  }

}
