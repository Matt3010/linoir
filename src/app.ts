import {Component, OnDestroy, OnInit} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {Subscription} from 'rxjs';
import {WebsocketService} from './common/services/websocket.service';
import {HttpClient} from '@angular/common/http';
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
    const connectToWebSocket = (ip: string) => {
      const wsUrl = `ws://${ip}:3333`;
      this.wsService.connect(wsUrl);
    };

    if (environment.production) {
      connectToWebSocket('backend-ws');
    } else {
      this.http.get<ServerConfig>('/server-config.json').subscribe({
        next: (config) => connectToWebSocket(config.ip),
        error: (err) => console.error('Error loading config:', err)
      });
    }
  }


  ngOnDestroy(): void {
    this.wsSub?.unsubscribe();
  }
}
