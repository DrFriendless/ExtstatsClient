import { Component, computed, effect, input, InputSignal, output, signal } from "@angular/core";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'year-picker',
  imports: [
    FormsModule
  ],
  templateUrl: './year-picker.component.html',
  styleUrls: ['./year-picker.component.scss'],
  standalone: true
})
export class YearPickerComponent {
  thisYear = (new Date()).getFullYear();
  ys = Array(this.thisYear - 1899);
  // I agree, this seems weirdly complicated.
  allYears = [0, ...[...this.ys.keys()].map(i => i + 1900)];
  inputs = signal("");
  placeholder: InputSignal<string> = input('Year');
  yearChosen = output<number>();
  isListVisible = false;
  focusedItemIndex: number | undefined;

  constructor() {
    effect(() => {
      const fi = this.filteredItems().length;
      this.isListVisible = (fi > 1) && fi < this.allYears.length;
    });
  }

  // this is what shows in the list
  filteredItems = computed(() => {
    const s = this.inputs();
    return this.allYears.filter(n => n.toString().startsWith(s));
  });

  private emit(y: number) {
    this.yearChosen.emit(y);
    this.inputs.set(y.toString());
    this.isListVisible = false;
  }

  selectionEntered(event: Event): void {
    if (this.focusedItemIndex !== undefined) {
      console.log("selectionEntered A");
      this.emit(this.filteredItems()[this.focusedItemIndex]);
    } else if (this.filteredItems().length === 1) {
      console.log("selectionEntered B");
      this.emit(this.filteredItems()[0]);
    }
  }

  select(item: number): void {
    console.log(`select ${item}`);
    this.emit(item);
  }

  focusOn(index: number) {
    this.focusedItemIndex = index;
  }

  navigateDownToListItem(event: Event): void {
    event.stopPropagation();
    if (!this.isListVisible) {
      this.isListVisible = true;
      if (this.focusedItemIndex === undefined && this.filteredItems().length > 0) {
        this.focusedItemIndex = 0;
      }
      return;
    }
    if (!this.filteredItems().length) {
      this.focusedItemIndex = undefined;
      return;
    }
    if (this.focusedItemIndex === undefined) {
      this.focusedItemIndex = 0;
      return;
    }
    if (this.focusedItemIndex === this.filteredItems().length - 1) {
      return;
    }
    this.focusedItemIndex++;
  }

  navigateUpToListItem(event: Event): void {
    event.stopPropagation();
    if (!this.isListVisible || this.focusedItemIndex === 0) {
      return;
    }
    if (this.filteredItems().length && this.focusedItemIndex === undefined) {
      this.focusedItemIndex = this.filteredItems().length - 1;
      return;
    }
    if (this.focusedItemIndex) this.focusedItemIndex--;
  }

  reset() {
    this.focusedItemIndex = undefined;
    this.isListVisible = false;
  }
}
