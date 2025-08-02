import {BaseMessagePayload, Constructor} from "../../entities";

export function Dockable<
  GenericConfig extends BaseMessagePayload,
  TBase extends Constructor<
    {
      configuration: GenericConfig;
      setNewConfig<GenericConfig>(newProps: Partial<GenericConfig>): void;
    }>
>(Base: TBase) {
  return class extends Base {
    toggleDock(): void {
      this.setNewConfig({dockActive: !this.configuration.dockActive});
    }
  };
}
