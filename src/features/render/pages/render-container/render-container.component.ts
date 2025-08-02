import {Component, OnInit, Type, ViewChild, ViewContainerRef} from '@angular/core';
import {ActivatedRoute, ChildrenOutletContexts} from '@angular/router';
import {gsap} from 'gsap';
import {Draggable} from 'gsap/Draggable';

gsap.registerPlugin(Draggable);

@Component({
  selector: 'lin-render-container',
  standalone: true,
  imports: [],
  template: `
    <ng-container #container></ng-container>
  `,
})
export class RenderContainerComponent implements OnInit {

  /**
   * If true, the component will not render the router outlet with GSAP Inertia.
   * Manual router outlet rendering is required in this case inside specific render components.
   */

  @ViewChild('container', {read: ViewContainerRef, static: true}) container!: ViewContainerRef;
  protected hasChildren = false;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly childrenRouterContext: ChildrenOutletContexts
  ) {
  }

  ngOnInit(): void {
    const componentType: Type<unknown> = this.route.snapshot.data['hostComponent'];
    if (componentType) {
      this.container.clear();
      this.container.createComponent(componentType);
    }
    this.hasChildren = !!this.childrenRouterContext.getContext('primary');
  }

}
