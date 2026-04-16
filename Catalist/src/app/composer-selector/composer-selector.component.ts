import {Component, input} from "@angular/core";
import {FormsModule} from "@angular/forms";
import {Selector, ValueChange, ValuePosition} from "../selector-types.mjs";
import {ArgEditorComponent} from "../arg-editor/arg-editor.component";
import {CatalistMetadata} from "extstats-api";
import {CatalistComposerComponent} from "../composer/composer.component";

@Component({
  selector: 'composer-selector',
  imports: [
    FormsModule,
    ArgEditorComponent,
  ],
  templateUrl: './composer-selector.component.html'
})
export class ComposerSelectorComponent {
  selector = input<Selector | undefined>();
  metadata = input<CatalistMetadata>({ mechanics: [], categories: [], tags: [] });
  insertionPoint = input<ValuePosition | undefined>();

  constructor(private parent: CatalistComposerComponent) {
  }

  onRemove(argIndex: number, selectorIndex: number) {
    const t = this.selector();
    if (t && t.params && t.id && t.params.length > argIndex) {
      const val = t.params[argIndex].value as Selector[];
      const newSelectors = [...val];
      newSelectors.splice(selectorIndex, 1);
      this.onChange({ selectorId: t.id, argIndex, value: { type: "SELECTOR_ARRAY", value: newSelectors }});
    }
  }

  onWarning(message: string | undefined) {
    this.parent.onWarning(message);
  }

  onChange(event: ValueChange) {
    // really wanted to do this with outputs but it wouldn't work!
    this.parent.onValueChange(event);
  }
}
