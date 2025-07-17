import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';

@Injectable({
  providedIn: "root"
})
export class WebsocketService {
  private ws: WebSocket | null = null;
  private readonly messagesSubject = new BehaviorSubject<string[]>([]);
  public readonly messages$: Observable<string[]> = this.messagesSubject.asObservable();

  connect(url: string): void {
    this.ws = new WebSocket(url);
    this.ws.onmessage = (event) => {
      const currentMessages = this.messagesSubject.value;
      this.messagesSubject.next([...currentMessages, event.data]);
    };
  }

  send(message: string): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(message);
    }
  }
}
