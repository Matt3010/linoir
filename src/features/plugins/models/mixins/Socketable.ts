import {Observable} from 'rxjs';
import {Message, WebsocketService} from '../../../../common/services/websocket.service';
import {BaseMessagePayload} from '../../entities';

type Constructor<T = {}> = new (...args: any[]) => T;

export function Socketable<
  GenericConfig extends BaseMessagePayload,
  TBase extends Constructor<{
    key(): string;
    webSocketService: WebsocketService;
    configuration: GenericConfig;
  }>
>(Base: TBase) {
  return class extends Base {
    constructor(...args: any[]) {
      super(...args);
      this.listenTopic().subscribe((res: Message<GenericConfig>): void => {
        res.payload.lastUpdatedAt = new Date();
        this.configuration = res.payload;
      });
    }

    listenTopic(): Observable<Message<GenericConfig>> {
      return this.webSocketService.subscribe<GenericConfig>(this.key());
    }

    sendMessage(message: GenericConfig): void {
      this.webSocketService.send<GenericConfig>({
        topic: this.key(),
        payload: message
      });
    }
  };
}

interface SocketableInterface<GenericConfig> {
  listenTopic(): Observable<Message<GenericConfig>>;

  sendMessage(message: GenericConfig): void;
}

export type WithSocketable<T extends { configuration: BaseMessagePayload }> =
  T & SocketableInterface<T['configuration']>;
