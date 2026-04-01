import {SELECTOR_TYPES, SelectorType} from "../selector-types.mjs";
import {Component, EventEmitter, Output} from "@angular/core";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'type-chooser',
  imports: [
    FormsModule,
  ],
  templateUrl: './selector-type-chooser.component.html'
})
export class SelectorTypeChooserComponent {
  @Output('choose') choose = new EventEmitter<SelectorType>();

  protected readonly SELECTOR_TYPES = SELECTOR_TYPES;

  onChoose(typ: SelectorType) {
    this.choose.emit(typ);
  }
}
