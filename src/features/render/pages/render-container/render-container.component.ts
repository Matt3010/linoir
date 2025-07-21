import {Component, OnInit, Type, ViewChild, ViewContainerRef} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'lin-render-container',
  template: `
    <ng-container #container></ng-container>`,
  standalone: true
})
export class RenderContainerComponent implements OnInit {
  @ViewChild('container', {read: ViewContainerRef, static: true}) container!: ViewContainerRef;

  constructor(private readonly route: ActivatedRoute) {
  }

  ngOnInit(): void {
    const componentType: Type<unknown> = this.route.snapshot.data['hostComponent'];
    this.container.clear();
    this.container.createComponent(componentType);
  }
}
