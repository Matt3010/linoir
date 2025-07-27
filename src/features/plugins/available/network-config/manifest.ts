import {PluginManifest} from '../../entities/_index';
import {Dockable, Kioskable} from '../../models/_index';
import {NetworkConfigPlugin} from './NetworkConfigPlugin';
import {RenderType} from '../../../render/enums/render-type';
import {Socketable} from '../../models/mixins/Socketable';

export const manifest: PluginManifest[] = [
    {
        key: 'network-config',
        class: Kioskable(Dockable(Socketable(NetworkConfigPlugin))),
        variants: [
            {
                scope: RenderType.Admin,
                UIComponentClassName: 'AdminNetworkConfigComponent',
                loader: () =>
                    import(
                        './scopes/admin/admin-network-config.component'
                        ),
            },
            {
                scope: RenderType.Kiosk,
                UIComponentClassName: 'KioskNetworkConfigComponent',
                loader: () =>
                    import(
                        './scopes/kiosk/kiosk-network-config.component'
                        ),
            },
            {
                scope: RenderType.Dock,
                UIComponentClassName: 'DockNetworkConfigComponent',
                loader: () =>
                    import(
                        './scopes/dock/dock-network-config.component'
                        ),
            },
        ],
    },
];
