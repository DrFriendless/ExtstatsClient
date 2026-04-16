import {Injectable} from '@angular/core';
import {Selector} from "./selector-types.mjs";

@Injectable({providedIn: 'root'})
export class IdService {
  private nextId: number = 1;
  private index: Record<string, Selector> = {};

  getId() {
    return this.nextId++;
  }

  assignIds(selector: Selector, clear = true) {
    if (clear) {
      this.index = {};
    }
    selector.id = this.getId();
    this.index[selector.id.toString()] = selector;
    for (const p of selector.params) {
      if (p.type === "SELECTOR_ARRAY") {
        for (const s of p.value) this.assignIds(s, false);
      }
    }
  }

  getSelector(id: number): Selector | undefined {
    return this.index[id.toString()];
  }
}
