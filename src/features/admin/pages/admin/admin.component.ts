import {Component} from '@angular/core';
import {WebsocketService} from '../../../../common/services/websocket.service';
import {PluginHostComponent} from '../../../plugin-host/pages/plugin-host/plugin-host.component';

@Component({
  selector: 'app-admin',
  imports: [
    PluginHostComponent
  ],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent {

  public constructor(protected readonly webSocketService: WebsocketService) {

    this.webSocketService.messages$.subscribe((res) => {
      console.log(res)
    })

  }


}
