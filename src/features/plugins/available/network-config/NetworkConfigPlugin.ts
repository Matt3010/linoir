import {BasePlugin} from '../../models/BasePlugin';
import {BaseMessagePayload} from '../../entities/base-message-payload';
import {PluginManifest} from '../../entities/plugin-mainfest';
import {WebsocketService} from '../../../../common/services/websocket.service';


interface NetworkMessagePayload extends BaseMessagePayload {
  local_ip: string;
}

export class NetworkConfigPlugin extends BasePlugin<NetworkMessagePayload> {

  constructor(
    manifest: PluginManifest,
    webSocketService: WebsocketService
  ) {
    super(manifest, webSocketService);
    if (!localStorage.getItem(`${this.key()}`)) {
      this.configuration = {
        kioskActive: true,
        local_ip: 'ciao',
        lastUpdatedAt: new Date(),
        dockActive: false
      }
    }
  }

}
