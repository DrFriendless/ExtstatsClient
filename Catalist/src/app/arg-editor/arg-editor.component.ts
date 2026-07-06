import {
  Component,
  computed,
  effect, forwardRef,
  input, model, output,
  signal,
  Signal,
  untracked, viewChild,
  WritableSignal
} from "@angular/core";
import {FormsModule} from "@angular/forms";
import {
  ParamType, Selector,
  USER_TYPE, ValueChange, ValuePosition
} from "../selector-types.mjs";
import {
  DesignerComboComponent,
  GeekComboComponent,
  PublisherComboComponent, SelectorChipComponent,
} from "extstats-angular";
import {CatalistMetadata, Designer, ExtstatsApi, Publisher} from "extstats-api";
import {ComposerSelectorComponent} from "../composer-selector/composer-selector.component";
import {YearPickerComponent} from "../year-picker/year-picker.component";

@Component({
  selector: 'arg-editor',
  imports: [
    FormsModule,
    GeekComboComponent,
    DesignerComboComponent,
    PublisherComboComponent,
    SelectorChipComponent,
    forwardRef(() => ComposerSelectorComponent),
    YearPickerComponent,
  ],
  templateUrl: './arg-editor.component.html',
  styleUrl: './arg-editor.component.css',
  host: {
    style: "display: contents"
  }
})
export class ArgEditorComponent {
  position = input<ValuePosition | undefined>(undefined);
  remove = output<number>();
  geek: Signal<GeekComboComponent | undefined> = viewChild('geek');
  designer: Signal<DesignerComboComponent | undefined> = viewChild('designer');
  year: Signal<YearPickerComponent | undefined> = viewChild('year');
  publisher: Signal<PublisherComboComponent | undefined> = viewChild('publisher');
  metadata = input<CatalistMetadata>({ categories: [], mechanics: [], tags: [] });
  value = input<ParamType | undefined>(undefined);
  tags = model<string | undefined>();
  categories = model<string | undefined>();
  mechanics = model<string | undefined>();
  ids = model<string | undefined>();
  warning = output<string | undefined>();
  changes = output<ValueChange>();
  selectors: Signal<Selector[]> = computed(() => {
    const v = this.value();
    if (!v) return [];
    return v.value as Selector[];
  });
  // something provided us with a user
  chosenUser: WritableSignal<USER_TYPE | undefined> = signal(undefined);
  insertionPoint = input<ValuePosition | undefined>();
  iAmTheInsertionPoint: Signal<boolean> = computed(() => {
    const ip = this.insertionPoint();
    const p = this.position();
    return (ip && p && (ip.selectorId === p.selectorId) && (ip.argIndex === p.argIndex)) || false;
  });

  constructor(api: ExtstatsApi) {
    effect(async () => {
      // populate editor fields from existing values
      const v = this.value();
      if (v) {
        switch (v.type) {
          case "YEAR": {
            const y = this.year();
            if (v.value !== undefined && y) y.select(v.value);
            break;
          }
          case "MECHANIC": {
            if (v.value) this.mechanics.set(v.value);
            break;
          }
          case "CATEGORY": {
            if (v.value) this.categories.set(v.value);
            break;
          }
          case "TAG": {
            if (v.value) this.tags.set(v.value);
            break;
          }
          case "GAME_IDS": {
            if (v.value) this.ids.set(v.value.join(","));
            break;
          }
          case "USER": {
            const g = this.geek();
            if (g && v.value && v.value !== "ME" && (g.selectedItem !== v.value.user)) {
              g.select(v.value.user);
            }
            break;
          }
          case "DESIGNER": {
            const d = this.designer();
            if (!d) break;
            if (v.value) {
              const des = await api.findDesigner(v.value as number);
              const selected = d.selectedItem;
              if (selected && des && selected.bggid === des.bggid) return;
              if (des) d.select(des);
            }
            break;
          }
          case "PUBLISHER": {
            const p = this.publisher();
            if (!p) break;
            if (v.value) {
              const pub = await api.findPublisher(v.value as number);
              const selected = p.selectedItem;
              if (selected && pub && selected.bggid === pub.bggid) return;
              if (pub) p.select(pub);
            }
            break;
          }
        }
      }
    });
    effect(() => {
      const t = this.tags();
      const p = untracked(this.position);
      if (t && p) this.changes.emit({...p, value: { type: "TAG", value: t }});
    });
    effect(() => {
      const t = this.categories();
      const p = untracked(this.position);
      if (t && p) this.changes.emit({...p, value: { type: "CATEGORY", value: t }});
    });
    effect(() => {
      const t = this.mechanics();
      const p = untracked(this.position);
      if (t && p) this.changes.emit({...p, value: { type: "MECHANIC", value: t }});
    });
    effect(() => {
      const user = this.chosenUser();
      const p = untracked(this.position);
      if (user && p) this.changes.emit({...p, value: { type: "USER", value: user }});
    });
  }

  onIdsEntered() {
    const re = /^\s*(?:([1-9][0-9]*)\s*,\s*)*([1-9][0-9]*)$/
    const s = this.ids();
    if (s && re.test(s)) {
      const noSpaces = s.replaceAll(/\s/g, "");
      const fields = noSpaces.split(',').map(x => parseInt(x));
      const p = this.position();
      if (p) this.changes.emit({...p, value: { type: "GAME_IDS", value: fields }});
      this.warning.emit(undefined);
    } else if (s) {
      this.warning.emit("Please enter numbers separated by commas");
    }
  }

  onDesignerChosen(event: Designer) {
    const p = this.position();
    if (p) this.changes.emit({...p, value: { type: "DESIGNER", value: event.bggid}});
  }

  onYearChosen(event: number) {
    const p = this.position();
    if (p) this.changes.emit({...p, value: { type: "YEAR", value: event}});
  }

  onPublisherChosen(event: Publisher) {
    const p = this.position();
    if (p) this.changes.emit({...p, value: { type: "PUBLISHER", value: event.bggid }});
  }

  onRemove(index: number) {
    this.remove.emit(index);
  }
}
