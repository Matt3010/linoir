import {WithDockable, WithKioskable} from '../models/_index';
import {CalendarPlugin, NetworkConfigPlugin} from '../available/_index';
import {WithSocketable} from '../models/mixins/Socketable';

export type PossiblePlugin =
  | WithSocketable<WithKioskable<CalendarPlugin>>
  | WithSocketable<WithDockable<WithKioskable<NetworkConfigPlugin>>>;
