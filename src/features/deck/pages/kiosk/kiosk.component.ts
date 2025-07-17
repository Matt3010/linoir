import {Component} from '@angular/core';
import {WebsocketService} from '../../../../common/services/websocket.service';
import {PluginHostComponent} from '../../../plugin-host/pages/plugin-host/plugin-host.component';


@Component({
  selector: 'lin-kiosk',
  templateUrl: './kiosk.component.html',
  imports: [
    PluginHostComponent
  ],
  styleUrls: ['./kiosk.component.css']
})
export class KioskComponent {

  public constructor(
    protected readonly webSocketService: WebsocketService
  ) {
  }


}
