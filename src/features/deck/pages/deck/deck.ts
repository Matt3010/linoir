import {Component, OnDestroy, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Subscription} from 'rxjs';
import {WebsocketService} from '../../../../common/services/websocket.service';

interface ServerConfig {
  ip: string;
}

@Component({
  selector: 'app-deck',
  templateUrl: './deck.html',
  styleUrls: ['./deck.css']
})
export class Deck implements OnInit, OnDestroy {
  private wsSub?: Subscription;

  constructor(
    private readonly wsService: WebsocketService,
    private readonly http: HttpClient
  ) {
  }

  ngOnInit(): void {
    this.http.get<ServerConfig>('/server-config.json').subscribe({
      next: (config) => {
        const wsUrl = `ws://${config.ip}:3333`;
        this.wsService.connect(wsUrl);

        this.wsSub = this.wsService.messages$.subscribe(msg => {
        });
      },
      error: (err) => {
        console.error('Errore caricando la configurazione:', err);
      }
    });
  }

  ngOnDestroy(): void {
    this.wsSub?.unsubscribe();
  }
}
