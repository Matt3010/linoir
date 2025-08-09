import {Observable} from 'rxjs';
import {Message, WebsocketService} from '../../../../common/services/websocket.service';
import {BaseMessagePayload, Constructor} from '../../entities';
import _ from 'lodash';

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
    resetConfiguration(): void;
    defaultConfig: GenericConfig;
    initOrMergeConfiguration(): void
  }>
>(Base: TBase) {
  return class extends Base implements SocketableInterface<GenericConfig> {

    public constructor(...args: any[]) {
      super(...args);
      this.initOrMergeConfiguration();
      this.listenTopic().subscribe((res: Message<GenericConfig>): void => {
        this.updateConfiguration(res.payload);
      });
    }

    public listenTopic(): Observable<Message<GenericConfig>> {
      return this.webSocketService.subscribeToLatestMessage<GenericConfig>(this.key());
    }

    public override updateConfiguration(configuration: Partial<GenericConfig>, ignoreSelf: boolean = false): void {
      const nextConfiguration = {
        ...this.configuration,
        ...configuration,
        lastUpdatedAt: new Date(),
      };

      const currentConfigFiltered = _.omit(this.configuration, ['lastUpdatedAt']);
      const nextConfigFiltered = _.omit(nextConfiguration, ['lastUpdatedAt']);

      if (!_.isEqual(currentConfigFiltered, nextConfigFiltered)) {
        localStorage.setItem(`${this.key()}`, JSON.stringify(nextConfiguration));
        this.updateAllClientsConfig(nextConfiguration, ignoreSelf);
      }
    }

    private updateAllClientsConfig(message: GenericConfig, ignoreSelf: boolean): void {
      this.webSocketService.send<GenericConfig>({
        topic: this.key(),
        payload: message,
        ignoreSelf, // Prevents the message from being sent back to the same client,
      });
    }

    public override initOrMergeConfiguration(): void {
      const savedConfigString: string | null = localStorage.getItem(`${this.key()}`);
      if (savedConfigString) {
        try {
          const savedConfig: Partial<GenericConfig> = JSON.parse(savedConfigString);

          this.updateConfiguration({
            ...this.defaultConfig,
            ...savedConfig,
          });
        } catch (e) {
          console.warn(`Invalid config for plugin ${this.key()}, resetting to default.`, e);
          this.resetConfiguration();
        }
      } else {
        this.resetConfiguration();
      }
    }

  };
}

interface SocketableInterface<GenericConfig extends BaseMessagePayload> {
  listenTopic(): Observable<Message<GenericConfig>>;

  updateConfiguration(configuration: Partial<GenericConfig>, ignoreSelf?: boolean): void;
}

export type WithSocketable<T extends { configuration: BaseMessagePayload }> =
  T & SocketableInterface<T['configuration']>;

