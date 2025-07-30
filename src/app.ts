import {Component, OnDestroy, OnInit} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {Subscription} from 'rxjs';
import {WebsocketService} from './common/services/websocket.service';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {environment} from './environments/environment';

interface ServerConfig {
  ip: string;
}

@Component({
  selector: 'lin-root',
  template: `
    <router-outlet/>
  `,
  imports: [
    RouterOutlet
  ]
})
export class App implements OnInit, OnDestroy {
  private readonly wsSub?: Subscription;

  constructor(
    private readonly wsService: WebsocketService,
    private readonly http: HttpClient
  ) {
  }

  ngOnInit(): void {

    console.log(environment.TELEGRAM_API_ID)

    const connectToWebSocket: (ip: string) => void = (ip: string): void => {
      const wsUrl = `ws://${ip}:3333`;
      this.wsService.connect(wsUrl);
    };

    if (environment.production && environment.wsServer) {
      connectToWebSocket(environment.wsServer);
    } else {
      this.http.get<ServerConfig>('/server-config.json').subscribe({
        next: (config: ServerConfig): void => connectToWebSocket(config.ip),
        error: (err: HttpErrorResponse): void => {
          throw new Error(`Error loading config: ${err.error}`,)
        }
      });
    }
  }


  ngOnDestroy(): void {
    this.wsSub?.unsubscribe();
  }
}
