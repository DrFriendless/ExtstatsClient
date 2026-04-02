import {Component, EventEmitter, Input, Output, WritableSignal} from "@angular/core";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'catalist-store',
  imports: [
    FormsModule,
  ],
  templateUrl: './catalist-store-component.html'
})
export class CatalistStoreComponent {
  @Input({ required: true }) data!: WritableSignal<string[]>;
  @Output() choose = new EventEmitter<string>;

  onChoose(s: string) {
    this.choose.emit(s);
  }
}
