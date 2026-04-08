import {
  Component, computed, EventEmitter, input, Output, signal, Signal, viewChildren, WritableSignal
} from "@angular/core";
import {FormsModule} from "@angular/forms";
import {SelectorType} from "../selector-types.mjs";
import {ArgEditorComponent} from "../arg-editor/arg-editor.component";
import {CatalistMetadata} from "extstats-api";

@Component({
  selector: 'catalist-composer',
  imports: [
    FormsModule,
    ArgEditorComponent,
  ],
  templateUrl: './composer.component.html'
})
export class CatalistComposerComponent {
  store = input<string[]>([]);
  metadata = input<CatalistMetadata>({ mechanics: [], categories: [], tags: [] });
  @Output() run = new EventEmitter<string>();
  @Output() save = new EventEmitter<string>();
  argEditors: Signal<readonly ArgEditorComponent[]> = viewChildren(ArgEditorComponent);
  typ: WritableSignal<SelectorType | undefined> = signal(undefined);
  warning: WritableSignal<string> = signal("");
  typeKey = computed(() => this.typ()?.key);
  needToSave: Signal<boolean> = computed(() => this.runnable() && !this.duplicated());
  runnable: Signal<boolean> = computed(() => {
    const typ = this.typ();
    if (!typ) return false;
    const argsHaveValue = this.argEditors().map(ed => ed.hasValue());
    return argsHaveValue.indexOf(false) < 0;
  });
  duplicated: Signal<boolean> = computed(() => {
    const p = this.preview();
    return this.store().indexOf(p) >= 0;
  });
  preview: Signal<string> = computed((() => {
    const typ = this.typ();
    if (!typ) return "";
    const argTexts = this.argEditors().map(ed => ed.text());
    return `${typ.key}(${argTexts.join(",")})`;
  }));

  /**
   * If the selector being composed has an arg slot for a selector, then sending us a selector means to put it in the slot.
   * Otherwise it means to replace the current selector, but don't do that if it might destroy the user's work.
   *
   * @param typ
   */
  setType(typ: SelectorType | undefined) {
    const editing = this.typ();
    const args = (!!editing && editing.args) || undefined;
    if (typ && editing && args && (args.indexOf('SELECTOR_ARRAY') >= 0)) {
      const index = args.indexOf('SELECTOR_ARRAY');
      this.argEditors()[index].chosenSelector.set(typ);
    } else if (!this.needToSave()) {
      this.warning.set("");
      this.typ.set(typ);
    } else {
      this.warning.set("Please save or discard the selector currently in the composer.");
    }
  }

  setWarning(message: string | undefined) {
    if (message) {
      this.warning.set(message);
    } else {
      this.warning.set("");
    }
  }

  onSave() {
    this.save.emit(this.preview());
  }

  onRun() {
    this.run.emit(this.preview());
  }

  onDiscard() {
    this.typ.set(undefined);
    this.warning.set("");
  }
}
