import {Component, Input, WritableSignal} from "@angular/core";
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

}
