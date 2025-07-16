import {Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs';

@Injectable()
export class WebsocketService {
  private ws!: WebSocket;
  private readonly messageSubject = new Subject<string>();

  public messages$: Observable<string> = this.messageSubject.asObservable();

  connect(url: string): void {
    this.ws = new WebSocket(url);

    this.ws.onopen = () => {
      console.log('WebSocket connected');
    };

    this.ws.onmessage = (event) => {
      this.messageSubject.next(event.data);
    };

    this.ws.onclose = () => {
      console.log('WebSocket closed, reconnecting in 3s...');
      setTimeout(() => this.connect(url), 3000);
    };
  }

  send(message: string): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(message);
    } else {
      console.warn('WebSocket not connected');
    }
  }
}
