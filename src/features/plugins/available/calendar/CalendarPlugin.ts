import {BasePlugin} from '../../models/BasePlugin';
import {WebsocketService} from '../../../../common/services/websocket.service';
import {PluginManifest} from '../../services/plugin-loader.service';

export class CalendarPlugin extends BasePlugin {
  constructor(
    manifest: PluginManifest,
    webSocketService: WebsocketService
  ) {
    super(manifest, webSocketService);

    if (!localStorage.getItem(`${this.key()}`)) {
      this.configuration = {
        active: false,
        lastUpdatedAt: new Date()
      }
    }
  }

}
