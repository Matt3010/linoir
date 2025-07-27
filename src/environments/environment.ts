import {NetworkConfigPlugin} from '../features/plugins/available';
import {Dockable, Kioskable} from '../features/plugins/models';
import {Socketable} from '../features/plugins/models/mixins/Socketable';

export const environment = {
  production: true,
  wsServer: 'backend-ws',
  fallbackAllDeactivated: Kioskable(Dockable(Socketable(NetworkConfigPlugin))),
};
