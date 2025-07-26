import {WithDockable, WithKioskable} from '../models';
import {CalendarPlugin, NetworkConfigPlugin} from '../available';

export type PossiblePlugin =
  | WithKioskable<CalendarPlugin>
  | WithDockable<WithKioskable<NetworkConfigPlugin>>;
