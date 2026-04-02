import {
  Component, computed, EventEmitter, Input, Output, signal, Signal, viewChildren, WritableSignal
} from "@angular/core";
import {FormsModule} from "@angular/forms";
import {SelectorType} from "../selector-types.mjs";
import {ArgEditorComponent} from "../arg-editor/arg-editor.component";

@Component({
  selector: 'catalist-composer',
  imports: [
    FormsModule,
    ArgEditorComponent,
  ],
  templateUrl: './composer.component.html'
})
export class CatalistComposerComponent {
  @Input({ required: true }) store!: WritableSignal<string[]>;
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
    const argsHaveValue = this.argEditors().map(ed => ed.hasValue());
    if (argsHaveValue.indexOf(false) >= 0) return "";
    const argTexts = this.argEditors().map(ed => ed.text);
    return `${typ.key}(${argTexts.join(",")})`;
  }));

  setType(typ: SelectorType | undefined) {
    if (!this.needToSave()) {
      this.warning.set("");
      this.typ.set(typ);
    } else {
      this.warning.set("Please save or discard the selector currently in the composer.")
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
