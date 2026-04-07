import {Component, input, output} from "@angular/core";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'catalist-store',
  imports: [
    FormsModule,
  ],
  templateUrl: './catalist-store-component.html'
})
export class CatalistStoreComponent {
  data = input<string[]>([]);
  choose = output<string>();

  onChoose(s: string) {
    this.choose.emit(s);
  }
}
