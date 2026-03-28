import {Component, EventEmitter, Input, Output} from '@angular/core';
import {NgClass} from "@angular/common";

@Component({
  selector: 'tagchip',
  imports: [
    NgClass
  ],
  templateUrl: './tagchip.component.html',
  styleUrl: './tagchip.component.css',
  host: {
    '[style.display]' : "'inline'"
  }
})
export class TagChip {
  @Input({ required: true, alias: "value" }) value!: string;
  @Input({ required: false, alias: "present" }) present = true;
  @Input('removable') removable = false;
  @Output('remove') remove = new EventEmitter<string>();
  @Output('click') click = new EventEmitter<string>();

  onRemove() {
    this.remove.next(this.value);
  }

  onClick() {
    this.click.next(this.value);
  }
}
