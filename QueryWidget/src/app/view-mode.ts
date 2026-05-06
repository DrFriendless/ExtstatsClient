export interface ViewMode {
  key: string;
  description: string;
  view?: View;
}

export interface ViewComponent {
  setData: (data: any) => void;
  setLoading: (loading: boolean) => void;
}

export abstract class View {
  protected constructor(public mode: ViewMode) {
    mode.view = this;
  }

  abstract refresh(selector: string, geek: string | undefined, view: ViewComponent, controls: ViewComponent): Promise<void>;

  abstract getComponent(): any;

  abstract getControlsComponent(): any;
}
