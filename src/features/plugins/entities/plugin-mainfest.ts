import {PluginVariant} from './plugin-variant';
import {Type} from '@angular/core';
import {PossiblePlugin} from './possible-plugin';

export interface PluginManifest {
  key: string;
  class: Type<PossiblePlugin>;
  variants: PluginVariant[];
}
