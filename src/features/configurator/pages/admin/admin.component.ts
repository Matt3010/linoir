import {Component} from '@angular/core';
import {WebsocketService} from '../../../../common/services/websocket.service';

@Component({
  selector: 'app-admin',
  imports: [],
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
