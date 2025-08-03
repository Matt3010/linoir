import {PluginVariant} from './plugin-variant';
import {Type} from '@angular/core';
import {PossiblePlugins} from './possible-plugins';

export interface PluginManifest {
  key: string;
  class: Type<PossiblePlugins>;
  variants: PluginVariant[];
}
