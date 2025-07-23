import {AfterViewInit, Component, HostListener, OnInit, Type, ViewChild, ViewContainerRef} from '@angular/core';
import {ActivatedRoute, ChildrenOutletContexts, RouterOutlet} from '@angular/router';
import {gsap} from 'gsap';
import {Draggable} from 'gsap/Draggable';

gsap.registerPlugin(Draggable);

@Component({
  selector: 'lin-render-container',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <div class="inertia-container position-fixed overflow-hidden">
      @if (hasChildren) {
        <div class="inertia-element">
          <router-outlet></router-outlet>
        </div>
      }
    </div>
    <ng-container #container></ng-container>
  `
})
export class RenderContainerComponent implements OnInit, AfterViewInit {
  @ViewChild('container', {read: ViewContainerRef, static: true}) container!: ViewContainerRef;
  protected hasChildren = false;

  private draggableInstance: Draggable[] = [];

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

  ngAfterViewInit(): void {
    this.initInertia();
  }

  @HostListener('window:resize')
  onResize(): void {
    this.initInertia();
  }

  protected initInertia(): void {
    const containerElement: HTMLElement | null = document.querySelector<HTMLElement>('.inertia-container');
    const inertiaElement: HTMLElement | null = document.querySelector<HTMLElement>('.inertia-element');

    if (containerElement && inertiaElement) {
      gsap.set(containerElement, {
        width: window.innerWidth,
        height: window.innerHeight,
        pointerEvents: 'none',
      });

      gsap.set(inertiaElement, {
        width: 800,
        height: 300,
        x: window.innerWidth,
        y: window.innerHeight,
        scale: 0.3,
        pointerEvents: 'auto',
      });

      if (this.draggableInstance.length) {
        this.draggableInstance.forEach(instance => instance.kill());
        this.draggableInstance = [];
      }

      this.draggableInstance = Draggable.create(inertiaElement, {
        bounds: containerElement,
        edgeResistance: 0.7,
        type: 'x,y',
        inertia: true,
      });
    }
  }
}
