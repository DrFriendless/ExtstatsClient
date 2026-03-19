import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {DesignerResult, ExtstatsApi} from "extstats-api";
import {LoaderComponent, SelectorComboComponent, UserConfigService} from "extstats-angular";
import {BoardGameLinkComponent} from "./board-game-link/board-game-link.component";
import {NgClass} from "@angular/common";
import {BoardGameDesignerLinkComponent} from "./board-game-designer-link/board-game-designer-link.component";

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

  constructor(private api: ExtstatsApi, private userService: UserConfigService) {
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

  rowspan(designer: DesignerResult): number {
    if (this.isExpanded(designer)) {
      if (designer.games) {
        return 1 + designer.games.length;
      } else {
        return 1;
      }
    } else {
      return 1;
    }
  }
}
