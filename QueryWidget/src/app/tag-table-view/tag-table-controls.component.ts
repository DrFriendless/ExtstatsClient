import {ViewComponent} from "../view-mode";
import {Component, effect, model, signal} from "@angular/core";
import {TagGroup} from "extstats-angular";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'tag-controls',
  templateUrl: './tag-table-controls.component.html',
  imports: [
    FormsModule
  ],
  host: {
    style: "display: contents"
  }
})
export class TagTableControlsComponent implements ViewComponent {
  tagGroups = signal<TagGroup[]>([]);
  tagGroup = model<TagGroup | undefined>();
  callback: ((tagGroup: TagGroup) => void) | undefined;

  constructor() {
    effect(() => {
      const tg = this.tagGroup();
      if (tg && this.callback) this.callback(tg);
    });
  }

  setData(data: { tagsByGame: Record<string, string[]>, tagGroups: TagGroup[], callback: (tagGroup: TagGroup) => void }): void {
    this.callback = data.callback;
    this.tagGroups.set(data.tagGroups);
    if (data.tagGroups.length === 0) {
      this.tagGroup.set(undefined);
    } else {
      this.tagGroup.set(data.tagGroups[0]);
    }
  }

  setLoading(loading: boolean): void {
  }
}
