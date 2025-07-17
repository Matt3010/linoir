import {Component} from '@angular/core';
import {PluginHostComponent} from '../../../plugin-host/pages/plugin-host/plugin-host.component';

@Component({
  selector: 'lin-admin',
  imports: [
    PluginHostComponent
  ],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent {
}
