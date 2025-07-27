import {WithDockable, WithKioskable} from '../models';
import {CalendarPlugin, NetworkConfigPlugin} from '../available';
import {WithSocketable} from '../models/mixins/SocketableMixin';

export type PossiblePlugin =
  | WithSocketable<WithKioskable<CalendarPlugin>>
  | WithSocketable<WithDockable<WithKioskable<NetworkConfigPlugin>>>;
