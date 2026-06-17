import {Component, effect, ElementRef, input, model, viewChild} from '@angular/core';
import {NgClass} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {TradeItem, TradeModel} from "../geeklist-util/trade-model";

@Component({
  selector: 'trade-cash',
  templateUrl: './cash.component.html',
  styleUrl: './cash.component.css',
  imports: [
    NgClass,
    FormsModule
  ],
  standalone: true
})
export class CashComponent {
  item = input.required<TradeItem>();
  mine = input.required<boolean>();
  model = input.required<TradeModel>();
  amount = model<number>(0);
  editing = model<boolean>(false);
  editAmount = model<string>("");
  editor = viewChild<ElementRef<HTMLInputElement>>('editor');

  constructor() {
    effect(() => {
      const e = this.editor();
      if (e) {
        e.nativeElement.focus();
      }
    });
  }

  onClick() {
    if (this.amount() > 0) {
      this.editAmount.set(this.amount().toString());
    } else {
      this.editAmount.set("");
    }
    this.editing.set(true);
  }

  watchEditorKey(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.stopEditing();
    } else if (event.key === 'Escape') {
      this.undoEditing();
    }
  }

  undoEditing() {
    this.editing.set(false);
  }

  stopEditing() {
    this.editing.set(false);
    if (this.editAmount().length > 0) {
      try {
        const n = parseInt(this.editAmount().trim());
        this.amount.set(n);
        this.model().setCash(this.item(), n);
      } catch (err) {
        this.amount.set(0);
        this.model().setCash(this.item(), undefined);
      }
    } else {
      this.amount.set(0);
      this.model().setCash(this.item(), undefined);
    }
  }
}
