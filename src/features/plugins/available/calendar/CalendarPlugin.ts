import {BasePlugin} from '../../models/BasePlugin';
import {PluginManifest} from '../../entities/_index';
import {WebsocketService} from '../../../../common/services/websocket.service';

export class CalendarPlugin extends BasePlugin {
    constructor(
        manifest: PluginManifest,
        webSocketService: WebsocketService
    ) {
        super(manifest, webSocketService);

        if (!localStorage.getItem(`${this.key()}`)) {
            this.configuration = {
                kioskActive: false,
                lastUpdatedAt: new Date(),
                dockActive: false
            }
        }
    }

}
