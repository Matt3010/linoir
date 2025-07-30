import {Observable} from 'rxjs';
import {Message, WebsocketService} from '../../../../common/services/websocket.service';
import {BaseMessagePayload, Constructor} from '../../entities';

/**
 * A mixin function that adds WebSocket-related functionality to a base class.
 * The resulting class can listen to a WebSocket topic and send messages.
 *
 * @template GenericConfig - The type of the WebSocket message payload.
 * @template TBase - The type of the base class being extended.
 * @param Base - The base class to extend.
 * @returns A new class that extends the base class with WebSocket functionality.
 */
export function Socketable<
  GenericConfig extends BaseMessagePayload,
  TBase extends Constructor<{
    key(): string;
    webSocketService: WebsocketService;
    configuration: GenericConfig;
  }>
>(Base: TBase) {
  return class extends Base {
    /**
     * Extends the base class constructor to set up a WebSocket subscription.
     * Updates the configuration whenever a new message is received.
     *
     * @param args - Arguments to pass to the base class constructor.
     */
    constructor(...args: any[]) {
      super(...args);
      this.listenTopic().subscribe((res: Message<GenericConfig>): void => {
        res.payload.lastUpdatedAt = new Date();
        this.configuration = res.payload;
      });
    }

    /**
     * Subscribes to a WebSocket topic using the key provided by the base class.
     *
     * @returns An observable that emits messages from the WebSocket topic.
     */
    listenTopic(): Observable<Message<GenericConfig>> {
      return this.webSocketService.subscribe<GenericConfig>(this.key());
    }

    /**
     * Sends a message to the WebSocket topic associated with the key provided by the base class.
     *
     * @param message - The message payload to send.
     */
    sendMessage(message: GenericConfig): void {
      this.webSocketService.send<GenericConfig>({
        topic: this.key(),
        payload: message
      });
    }
  };
}

/**
 * An interface that defines the WebSocket-related methods added by the `Socketable` mixin.
 *
 * @template GenericConfig - The type of the WebSocket message payload.
 */
interface SocketableInterface<GenericConfig> {
  /**
   * Subscribes to a WebSocket topic.
   *
   * @returns An observable that emits messages from the WebSocket topic.
   */
  listenTopic(): Observable<Message<GenericConfig>>;

  /**
   * Sends a message to the WebSocket topic.
   *
   * @param message - The message payload to send.
   */
  sendMessage(message: GenericConfig): void;
}

/**
 * A utility type that combines a class with the `SocketableInterface`.
 *
 * @template T - The type of the class being extended.
 */
export type WithSocketable<T extends { configuration: BaseMessagePayload }> =
  T & SocketableInterface<T['configuration']>;
