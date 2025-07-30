import {PluginManifest} from '../../../../../entities';
import {Dockable, Kioskable, Socketable} from '../../../../../models';
import {RenderType} from '../../../../../../render/enums/render-type';
import {TelegramPlugin} from '../../../TelegramPlugin';

export const manifest: PluginManifest[] = [
  {
    key: 'telegram',
    class: Dockable(Kioskable(Socketable(TelegramPlugin))),
    variants: [
      {
        scope: RenderType.Dock,
        UIComponentClassName: 'DockTelegramComponent',
        loader: () =>
          import(
            './dock-telegram.component'
            ),
      }
    ],
  },
]
