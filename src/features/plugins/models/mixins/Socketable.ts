import {Observable} from 'rxjs';
import {Message, WebsocketService} from '../../../../common/services/websocket.service';
import {BaseMessagePayload, Constructor} from '../../entities';
import {TelegramMessagePayload} from '../../available';

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
    updateConfiguration(configuration: Partial<GenericConfig>): void;
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
        console.log('Received WebSocket message:', res);
        res.payload.lastUpdatedAt = new Date();
        this.configuration = res.payload;
      });
    }

    /**
     * Subscribes to a WebSocket topic using the key provided by the base class.
     *
     * @returns An observable that emits messages from the WebSocket topic.
     */
    public listenTopic(): Observable<Message<GenericConfig>> {
      return this.webSocketService.subscribeToLatestMessage<GenericConfig>(this.key());
    }

    public setNewConfig(newProps: Partial<TelegramMessagePayload>): void {
      const nextConfiguration = {
        ...this.configuration,
        ...newProps
      };
      this.updateConfiguration(nextConfiguration);
      this.updateAllClientsConfig(this.configuration);
    }

    /**
     * Sends a message to the WebSocket topic associated with the key provided by the base class.
     *
     * @param message - The message payload to send.
     */
    updateAllClientsConfig(message: GenericConfig): void {
      this.webSocketService.send<GenericConfig>({
        topic: this.key(),
        payload: message,
        ignoreSelf: true, // Prevents the message from being sent back to the same client
      });
    }
  };
}

