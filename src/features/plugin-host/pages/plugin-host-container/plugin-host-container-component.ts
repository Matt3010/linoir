import {Component, OnInit, Type, ViewChild, ViewContainerRef} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'lin-plugin-host-container',
  template: `
    <ng-container #container></ng-container>`,
  standalone: true
})
export class PluginHostContainerComponent implements OnInit {
  @ViewChild('container', {read: ViewContainerRef, static: true}) container!: ViewContainerRef;

  constructor(private readonly route: ActivatedRoute) {
  }

  ngOnInit(): void {
    const componentType: Type<unknown> = this.route.snapshot.data['hostComponent'];
    const scope: string = this.route.snapshot.data['scope'];
    this.container.clear();
    const component = this.container.createComponent(componentType);
    component.setInput('scope', scope)
  }
}
