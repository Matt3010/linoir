import {AfterViewInit, Component, OnDestroy, QueryList, ViewChildren, ViewContainerRef} from '@angular/core';
import {PluginLoaderService} from '../../../plugins/services/plugin-loader.service';
import {BasePlugin} from '../../../plugins/models/BasePlugin';
import {RenderType} from '../../enums/render-type';
import {Flip} from 'gsap/Flip';

@Component({
  selector: 'lin-render-preview',
  standalone: true,
  imports: [],
  template: `
    <div class="d-flex flex-wrap h-100 gap-2 p-2 flip-container">
      @for (plugin of filteredPlugins(pluginLoader.plugins); track $index) {
        <div class="flex-grow-1 bg-danger rounded target ps-3 py-2 pe-2">
          <ng-template #pluginContainer></ng-template>
        </div>
      }
    </div>
  `
})
export class RenderKioskComponent implements AfterViewInit, OnDestroy {
  @ViewChildren('pluginContainer', {read: ViewContainerRef})
  containers!: QueryList<ViewContainerRef>;

  private readonly renderType: RenderType = RenderType.Kiosk;
  private resizeObserver: ResizeObserver | null = null;

  constructor(protected readonly pluginLoader: PluginLoaderService) {
  }

  protected filteredPlugins(plugins: BasePlugin[]): BasePlugin[] {
    return plugins.filter((p: BasePlugin): boolean => p.configuration.active);
  }

  public ngAfterViewInit(): void {
    const renderCallback = async (): Promise<void> => {
      await this.pluginLoader.render(
        this.filteredPlugins(this.pluginLoader.plugins),
        this.containers,
        this.renderType
      );

      const state: Flip.FlipState = Flip.getState('.target');

      await new Promise(requestAnimationFrame);

      Flip.from(state, {
        duration: 1,
        ease: 'power1.inOut',
        absolute: true,
        stagger: 0.05
      });
    };

    this.pluginLoader.initializeConfigurationChangeListeners(renderCallback);

    renderCallback().then((): void => {
      this.setupResizeObserver();
    });
  }

  private setupResizeObserver(): void {
    const container: Element | null = document.querySelector('.flip-container');
    if (container) {
      this.resizeObserver = new ResizeObserver((): void => {
        const state: Flip.FlipState = Flip.getState('.target');

        requestAnimationFrame((): void => {
          Flip.from(state, {
            duration: 0.4,
            ease: 'power1.inOut',
            absolute: true,
            stagger: 0.03
          });
        });
      });

      this.resizeObserver.observe(container);
    }
  }

  public ngOnDestroy(): void {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
  }
}
