import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {DesignerResult, ExtstatsApi} from "extstats-api";
import {
  BoardGameDesignerLinkComponent,
  BoardGameLinkComponent,
  LoaderComponent,
  SelectorComboComponent,
  UserConfigService
} from "extstats-angular";
import {NgClass} from "@angular/common";

@Component({
  selector: 'designers-widget',
  imports: [
    LoaderComponent,
    BoardGameLinkComponent,
    NgClass,
    BoardGameDesignerLinkComponent,
  ],
  templateUrl: './app.component.html'
})
export class DesignersWidget implements AfterViewInit {
  @ViewChild(SelectorComboComponent) selectorCombo: SelectorComboComponent | undefined;
  loading: boolean = false;
  data: DesignerResult[] = [];
  expanded: Set<number> = new Set<number>();

  constructor(private api: ExtstatsApi, public userService: UserConfigService) {
    this.userService.get("bob", 1);
  }

  async ngAfterViewInit(): Promise<void> {
    await this.refresh();
  }

  async refresh(): Promise<void> {
    const geek = this.userService.getAGeek();
    if (geek) {
      this.loading = true;
      this.data = await this.api.getDesignerInfo(geek);
      this.data.forEach(designer => {
        if (designer.games && designer.games.length > 1) {
          designer.games.sort((g1, g2) => g1.bggid - g2.bggid);
        }
        if (designer.games) {
          designer.games.forEach(g => g.bggRating = Math.floor(g.bggRating * 100) / 100)
        }
      })
      this.loading = false;
    }
  }

  expand(designer: DesignerResult) {
    if (this.isExpanded(designer)) {
      this.expanded.delete(designer.bggid);
    } else {
      this.expanded.add(designer.bggid);
    }
  }

  isExpanded(designer: DesignerResult): boolean {
    return this.expanded.has(designer.bggid);
  }
}
