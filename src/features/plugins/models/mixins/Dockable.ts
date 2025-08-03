import {BaseMessagePayload, Constructor} from "../../entities";

export function Dockable<
  GenericConfig extends BaseMessagePayload,
  TBase extends Constructor<
    {
      configuration: GenericConfig;
      updateConfiguration<GenericConfig>(newProps: Partial<GenericConfig>): void;
    }>
>(Base: TBase) {
  return class extends Base implements DockableInterface {
    public toggleDock(): void {
      this.updateConfiguration({dockActive: !this.configuration.dockActive});
    }
  };
}

interface DockableInterface {
  toggleDock(): void;
}

export type WithDockable<T extends { configuration: { dockActive: boolean } }> =
  T & DockableInterface;
