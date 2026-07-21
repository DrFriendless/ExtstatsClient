import {Component, effect, model, signal, viewChild, ViewContainerRef} from '@angular/core';
import {ViewMode} from "./view-mode";
import {GameTableView} from "./game-table-view/game-table-view";
import {GeekGameTableView} from "./geekgame-table-view/geekgame-table-view";
import {TagTableView} from "./tag-table-view/tag-table-view";
import {FormsModule} from "@angular/forms";
import {UserConfigService} from "extstats-angular";

export interface Row {
  bggid: number;
  name: string;
  tags: string[] | undefined;
}

export interface StoredSelector {
  name: string;
  selector: string;
}

@Component({
  selector: 'query-widget',
  imports: [
    FormsModule
  ],
  templateUrl: './app.component.html'
})
export class AppComponent {
  mode = model<ViewMode | undefined>(undefined);
  selector = signal<StoredSelector | undefined>(undefined);
  selectors = signal<StoredSelector[]>([]);
  modes = signal<ViewMode[]>([]);
  viewComponent: any;
  controlsComponent: any;
  outlet = viewChild.required('outlet', { read: ViewContainerRef });
  controls = viewChild.required('controls', { read: ViewContainerRef });

  constructor(gameTableView: GameTableView, geekgameTableView: GeekGameTableView, tagTableView: TagTableView,
              private userService: UserConfigService) {
    this.modes.set([ gameTableView.mode, geekgameTableView.mode, tagTableView.mode ]);

    effect(async () => {
      const s = this.selector();
      const mode = this.mode();
      if (!s || !mode) return;
      document.title = s.name;
      document.getElementById("h1Title")!.textContent = s.name;
      this.outlet().clear();
      this.controls().clear();
      const comp = mode.view?.getComponent();
      const control = mode.view?.getControlsComponent();
      this.viewComponent = this.outlet()?.createComponent(comp).instance;
      this.controlsComponent = control ? this.controls()?.createComponent(control).instance : undefined;
      if (mode.view && this.viewComponent) {
        await mode.view.refresh(s.selector, this.userService.getAGeek(), this.viewComponent, this.controlsComponent);
      }
    });

    const url = URL.parse(window.location.href);
    if (url) {
      const params = url.searchParams;
      const m = params.get('mode');
      for (const mm of this.modes()) {
        if (m === mm.key) {
          this.mode.set(mm);
          break;
        }
      }
      const name = params.get('name') || "Unnamed";
      const s = params.get('selector');
      if (s) {
        const s0 = { selector: s, name };
        this.selector.set(s0);
        const ss = this.selectors();
        if ((ss.filter(x => x.selector === s)).length === 0) {
          this.selectors.set([s0, ...ss]);
        }
      }
    }
    this.userService.get("catalist.store", [])
      .then((stored: StoredSelector[] | undefined) => {
        if (stored) {
          const ss = this.selectors();
          this.selectors.set([...ss, ...stored]);
        }
      })
  }
}
