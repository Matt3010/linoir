import {ChangeDetectionStrategy, Component, OnInit, Type, ViewChild, ViewContainerRef} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
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
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RenderContainerComponent implements OnInit {
  @ViewChild('container', {read: ViewContainerRef, static: true}) container!: ViewContainerRef;

  constructor(
    private readonly route: ActivatedRoute,
  ) {
  }

  ngOnInit(): void {
    const componentType: Type<unknown> = this.route.snapshot.data['hostComponent'];
    if (componentType) {
      this.container.clear();
      this.container.createComponent(componentType);
    }
  }

}
