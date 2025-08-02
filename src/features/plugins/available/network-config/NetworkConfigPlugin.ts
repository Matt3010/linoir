import {BasePlugin} from '../../models/BasePlugin';
import {BaseMessagePayload, PluginManifest} from '../../entities';
import {WebsocketService} from '../../../../common/services/websocket.service';

export interface NetworkMessagePayload extends BaseMessagePayload {
}

export class NetworkConfigPlugin extends BasePlugin<NetworkMessagePayload> {
  public override defaultConfig: NetworkMessagePayload = {
    kioskActive: true,
    lastUpdatedAt: new Date(),
    dockActive: false,
  };

  constructor(
    manifest: PluginManifest,
    webSocketService: WebsocketService
  ) {
    super(manifest, webSocketService);
  }


}
