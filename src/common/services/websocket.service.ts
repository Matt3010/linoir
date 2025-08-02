import {Injectable} from '@angular/core';
import {BehaviorSubject, map, mergeAll, Observable} from 'rxjs';

export interface Message<AnyPayload = unknown> {
  topic: string;
  payload: AnyPayload;
  ignoreSelf: boolean; // Optional flag to ignore self in message handling,
}

@Injectable()
export class WebsocketService {
  private ws: WebSocket | null = null;

  private readonly messagesSubject: BehaviorSubject<Message[]> = new BehaviorSubject<Message[]>([]);
  public readonly messages$: Observable<Message[]> = this.messagesSubject.asObservable();

  public connect(url: string): void {
    this.ws = new WebSocket(url);

    this.ws.onmessage = (event: MessageEvent<string>) => {
      const decoded: Message | null = this.decode(event.data);
      if (decoded) {
        const currentMessages: Message[] = this.messagesSubject.value;
        this.messagesSubject.next([...currentMessages, decoded]);
      }
    };

    this.ws.onerror = (err: Event): void => {
      throw new Error(`WebSocket error: ${JSON.stringify(err)}`);
    };

    this.ws.onclose = (): void => {
      throw new Error('WebSocket connection closed unexpectedly.');
    };
  }

  public send<T>(message: Message<T>): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(this.encode(message));
    } else {
      throw new Error('WebSocket not open. Message not sent.');
    }
  }

  private encode<T>(message: T): string {
    return JSON.stringify(message);
  }

  private decode<T>(message: string): Message<T> | null {
    try {
      return JSON.parse(message) as Message<T>;
    } catch (e) {
      throw new Error(`Failed to decode message: ${(e as Error).message}`);
    }
  }

  public subscribeToLatestMessage<T>(topic: string): Observable<Message<T>> {
    return this.messages$.pipe(
      map((messages: Message[]): Message<T>[] =>
        messages.filter((msg: Message, index: number): msg is Message<T> => (msg.topic === topic || msg.topic === '*') && index === messages.length - 1)
      ),
      mergeAll()
    );
  }

}
