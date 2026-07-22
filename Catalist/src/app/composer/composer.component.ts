import {
  Component, computed, input, model, output, signal, Signal, WritableSignal
} from "@angular/core";
import {FormsModule} from "@angular/forms";
import {Selector, ValueChange, ValuePosition} from "../selector-types.mjs";
import {CatalistMetadata} from "extstats-api";
import {StoredSelector} from "../app.component";
import {ComposerSelectorComponent} from "../composer-selector/composer-selector.component";
import {IdService} from "../id.service";

@Component({
  selector: 'catalist-composer',
  imports: [
    FormsModule,
    ComposerSelectorComponent,
  ],
  templateUrl: './composer.component.html'
})
export class CatalistComposerComponent {
  name = model<string>("");
  store = input<StoredSelector[]>([]);
  metadata = input<CatalistMetadata>({ mechanics: [], categories: [], tags: [], taggroups: [] });
  run = output<string>();
  save = output<StoredSelector>();
  runnable = computed(() => {
    const s = this.selector();
    if (s) return s.isValid();
    return false;
  });
  // the current value of the widget
  selector: WritableSignal<Selector | undefined> = signal(undefined);
  warning: WritableSignal<string> = signal("");
  needToSave: Signal<boolean> = computed(() => this.runnable() && !this.duplicated());
  canSave: Signal<boolean> = computed(() => this.runnable() && this.name().length > 0);
  duplicated: Signal<boolean> = computed(() => {
    const p = this.selector()?.toString();
    const n = this.name();
    return this.store().filter(ss => ss.selector === p && ss.name === n).length > 0;
  });
  insertionPoint = computed(() => this.selector()?.findSelectorInsertionPoint());

  constructor(private idService: IdService) {
  }

  /**
   * If the selector being composed has an arg slot for a selector, then sending us a selector means to put it in the slot.
   * Otherwise it means to replace the current selector, but don't do that if it might destroy the user's work.
   *
   * @param selector
   */
  insertSelector(selector: Selector | undefined) {
    if (!selector) return;
    const insertionPoint = this.insertionPoint();
    if (selector.needsSelectors() && insertionPoint) {
      this.warning.set("You can't add that now as the composer can't cope with two places to add selectors.");
      return;
    }
    if (insertionPoint) {
      this.onInsertSelector(insertionPoint, selector);
    } else {
      // trying to replace top level
      if (this.needToSave()) {
        this.warning.set("Please save or discard the selector currently in the composer.");
        return;
      } else {
        this.selector.set(selector);
        if (selector.name) this.name.set(selector.name);
      }
    }
  }

  onWarning(message: string | undefined) {
    if (message) {
      this.warning.set(message);
    } else {
      this.warning.set("");
    }
  }

  onSave() {
    const n = this.name();
    const p = this.selector()?.toString();
    if (p && n) this.save.emit({ name: n, selector: p });
  }

  onRun() {
    const p = this.selector()?.toString();
    if (p) this.run.emit(p);
  }

  onRunInNewWindow() {
    const s = this.selector()?.toString();
    const n = this.name() || "Unnamed";
    if (s) window.open(`/query.html?selector=${encodeURIComponent(s)}&mode=geekgames&name=${encodeURIComponent(n)}`, "_blank");
  }

  onDiscard() {
    this.selector.set(undefined);
    this.name.set("");
    this.warning.set("");
  }

  onInsertSelector(position: ValuePosition, selector: Selector) {
    const st = this.idService.getSelector(position.selectorId);
    if (!st) {
      console.log("selector not found");
      return;
    }
    const newValue = [...(st.params[position.argIndex].value as Selector[]), selector];
    this.onValueChange({...position, value: { type: "SELECTOR_ARRAY", value: newValue }});
  }

  onValueChange(event: ValueChange) {
    const current = this.selector()!.toString();
    const st = this.idService.getSelector(event.selectorId);
    if (!st) {
      console.log("selector not found");
      return;
    }
    const s = this.selector()!.cloneWithChange(event);
    const newText = s.toString();
    if (current !== newText) {
      this.idService.assignIds(s, true);
      this.selector.set(s);
    }
  }
}
