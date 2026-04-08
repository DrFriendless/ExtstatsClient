import {
  Component,
  computed,
  effect,
  input,
  model, output,
  signal,
  Signal,
  untracked,
  WritableSignal
} from "@angular/core";
import {FormsModule} from "@angular/forms";
import {
  ARG_TYPE,
  hasValidValue,
  ParamType,
  paramTypeToString,
  selectorToString,
  SelectorType,
  USER_TYPE
} from "../selector-types.mjs";
import {
  DesignerComboComponent,
  GeekComboComponent,
  PublisherComboComponent,
  SelectorChipsComponent
} from "extstats-angular";
import {CatalistMetadata, Designer, Publisher} from "extstats-api";

@Component({
  selector: 'arg-editor',
  imports: [
    FormsModule,
    GeekComboComponent,
    DesignerComboComponent,
    PublisherComboComponent,
    SelectorChipsComponent,
  ],
  templateUrl: './arg-editor.component.html',
  styleUrl: './arg-editor.component.css',
  host: {
    style: "display: contents"
  }
})
export class ArgEditorComponent {
  metadata = input<CatalistMetadata>({ categories: [], mechanics: [], tags: [] });
  argType = input<ARG_TYPE | undefined>(undefined);
  init = input<ParamType | undefined>(undefined);
  tags = model<string | undefined>();
  categories = model<string | undefined>();
  mechanics = model<string | undefined>();
  ids = model<string | undefined>();
  warning = output<string | undefined>();
  value: WritableSignal<ParamType | undefined> = signal(undefined);
  hasValue: Signal<boolean> = computed(() => {
    if (!this.argType()) return false;
    const v = this.value();
    if (!v) return false;
    return hasValidValue(v);
  });
  text: Signal<string> = computed(() => {
    if (!this.argType()) return "";
    const v = this.value();
    if (!v) return "";
    return paramTypeToString(v);
  });
  selectors: Signal<SelectorType[]> = computed(() => {
    const at = this.argType();
    if (!at) return [];
    if (at !== "SELECTOR_ARRAY") return [];
    const v = this.value();
    if (!v) return [];
    return v.value as SelectorType[];
  });
  // something provided us with a selector
  chosenSelector: WritableSignal<SelectorType | undefined> = signal(undefined);
  // something provided us with a user
  chosenUser: WritableSignal<USER_TYPE | undefined> = signal(undefined);



  constructor() {
    // initialise value
    effect(() => {
      const v = this.init();
      const t = this.argType();
      if (v) {
        this.value.set(v);
      } else if (!t) {
        this.value.set(undefined);
      } else {
        this.value.set(this.emptyValue(t));
      }
    });
    effect(() => {
      const t = this.tags();
      if (t) this.value.set({ type: "TAG", value: t });
    });
    effect(() => {
      const t = this.categories();
      if (t) this.value.set({ type: "CATEGORY", value: t });
    });
    effect(() => {
      const t = this.mechanics();
      if (t) this.value.set({ type: "MECHANIC", value: t });
    });
    effect(() => {
      // we got a selector
      const selector = this.chosenSelector();
      if (!selector) return;
      const t = untracked(this.argType);
      if (!t) return;
      if (t === "SELECTOR_ARRAY") {
        this.value.update(v => {
          const existing = v!.value as SelectorType[];
          return { type: "SELECTOR_ARRAY", value: [...existing, selector] }
        });
      }
    });
    effect(() => {
      const user = this.chosenUser();
      if (!user) return;
      const t = untracked(this.argType);
      if (!t) return;
      if (t === "USER") {
        this.value.set({ type: "USER", value: user });
      }
    });
  }

  onIdsEntered(event: any) {
    const re = /^\s*(?:([1-9][0-9]*)\s*,\s*)*([1-9][0-9]*)$/
    const s = this.ids();
    if (s && re.test(s)) {
      const noSpaces = s.replaceAll(/\s/g, "");
      const fields = noSpaces.split(',').map(x => parseInt(x));
      this.value.set({ type: "GAME_IDS", value: fields });
      this.warning.emit(undefined);
    } else if (s) {
      this.warning.emit("Please enter numbers separated by commas");
    }
  }

  onDesignerChosen(event: Designer) {
    this.value.set({ type: "DESIGNER", value: event.bggid});
  }

  onPublisherChosen(event: Publisher) {
    this.value.set({ type: "PUBLISHER", value: event.bggid });
  }

  emptyValue(argTpe: ARG_TYPE): ParamType {
    switch (argTpe) {
      case "USER": return { type: "USER", value: undefined };
      case "TAG": return { type: "TAG", value: undefined };
      case "SELECTOR_ARRAY": return { type: "SELECTOR_ARRAY", value: [] };
      case "PUBLISHER": return { type: "PUBLISHER", value: undefined };
      case "DESIGNER": return { type: "DESIGNER", value: undefined };
      case "MECHANIC": return { type: "MECHANIC", value: undefined };
      case "CATEGORY": return { type: "CATEGORY", value: undefined };
      case "GAME_IDS": return { type: "GAME_IDS", value: [] };
    }
  }

  protected readonly selectorToString = selectorToString;
}
