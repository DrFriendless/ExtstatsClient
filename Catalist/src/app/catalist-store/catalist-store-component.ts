import {Component, input, output} from "@angular/core";
import {FormsModule} from "@angular/forms";
import {StoredSelector} from "../app.component";

@Component({
  selector: 'catalist-store',
  imports: [
    FormsModule,
  ],
  templateUrl: './catalist-store-component.html'
})
export class CatalistStoreComponent {
  data = input<StoredSelector[]>([]);
  choose = output<StoredSelector>();
  remove = output<StoredSelector>();

  onChoose(s: StoredSelector) {
    this.choose.emit(s);
  }

  onRemove(s: StoredSelector) {
    this.remove.emit(s);
  }
}
