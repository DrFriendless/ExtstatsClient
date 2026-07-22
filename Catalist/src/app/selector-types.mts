export type ARG_TYPE = "GAME_IDS" | "SELECTOR_ARRAY" | "USER" | "DESIGNER" | "PUBLISHER" | "CATEGORY" | "MECHANIC" | "TAG" | "YEAR" | "TAGGROUP";

export type USER_TYPE = "ME" | { user: string } | undefined;

export type ParamType =
  { type: "GAME_IDS"; value: number[] } |
  { type: "SELECTOR_ARRAY"; value: Selector[] } |
  { type: "USER"; value: USER_TYPE } |
  { type: "DESIGNER"; value: number | undefined } |
  { type: "YEAR"; value: number | undefined } |
  { type: "PUBLISHER"; value: number | undefined } |
  { type: "CATEGORY"; value: string | undefined } |
  { type: "MECHANIC"; value: string | undefined } |
  { type: "TAG"; value: string | undefined } |
  { type: "TAGGROUP", value: string | undefined };

export function paramTypeToString(p: ParamType | undefined): string {
  if (!p) return "";
  switch (p.type) {
    case "CATEGORY": return `"${p.value || '??'}"`;
    case "DESIGNER": return p?.value?.toString() || "??";
    case "YEAR": return p?.value?.toString() || "??";
    case "GAME_IDS": return p.value.join(",");
    case "MECHANIC": return `"${p.value || '??'}"`;
    case "PUBLISHER": return p?.value?.toString() || "??";
    case "SELECTOR_ARRAY": return p.value.map(s => s.toString()).join(",");
    case "TAG": return `"${p.value || '??'}"`;
    case "TAGGROUP": return `"${p.value || '??'}"`;
    case "USER": {
      const v = p.value;
      if (!v) return "??";
      if (v === "ME") return v;
      return `"${v.user}"`;
    }
  }
}

export function isValid(p: ParamType): boolean {
  switch (p.type) {
    case "CATEGORY": return !!p.value;
    case "DESIGNER": return !!p.value;
    case "GAME_IDS": return p.value.length > 0;
    case "MECHANIC": return !!p.value;
    case "PUBLISHER": return !!p.value;
    case "YEAR": return (!!p.value && p.value.toString().length === 4) || p.value === 0;
    case "SELECTOR_ARRAY": return (p.value.map(s => s.isValid())).indexOf(false) < 0;
    case "TAG": return !!p.value;
    case "TAGGROUP": return !!p.value;
    case "USER": return !!p.value;
  }
}

export class Selector {
  key: string;
  params: ParamType[];
  typeDescription: string;
  typeHints: string;
  // used for indexing a complex selector
  id?: number;
  // name in the store
  name?: string;

  constructor(typ: SelectorType) {
    this.key = typ.key;
    this.params = typ.args.map(a => emptyValue(a));
    this.typeDescription = typ.description;
    this.typeHints = typ.hints || "";
  }

  cloneWithChange(change: ValueChange): Selector {
    const args = this.params.map(p => p.type);
    const s = new Selector({ key: this.key, args: args, description: this.typeDescription, hints: this.typeHints } as SelectorType);
    s.name = this.name;
    for (let i=0; i<args.length; i++) {
      if (change.selectorId === this.id && change.argIndex === i) {
        s.params[i] = change.value;
      } else {
        s.params[i].value = this.cloneValueWithChange(change, this.params[i].value);
      }
    }
    return s;
  }

  clone(): Selector {
    const args = this.params.map(p => p.type);
    const s = new Selector({ key: this.key, args: args, description: this.typeDescription, hints: this.typeHints } as SelectorType);
    s.name = this.name;
    for (let i=0; i<args.length; i++) {
      s.params[i].value = this.cloneValue(this.params[i].value);
    }
    return s;
  }

  cloneValue(v: string | number | number[] | Selector[] | { user: string} | undefined): string | number | number[] | Selector[] | { user: string} | undefined {
    if (typeof v === "string" || typeof v === "number" || typeof v === "undefined") return v;
    if ('user' in v) return v;
    const ts = v.map(t => typeof t);
    if (ts.length === 0) return [];
    if (ts.indexOf('number') >= 0) return [...v] as number[];
    return v.map(s => (s as Selector).clone());
  }

  cloneValueWithChange(change: ValueChange, v: string | number | number[] | Selector[] | { user: string} | undefined): string | number | number[] | Selector[] | { user: string} | undefined {
    if (typeof v === "string" || typeof v === "number" || typeof v === "undefined") return v;
    if ('user' in v) return v;
    const ts = v.map(t => typeof t);
    if (ts.length === 0) return [];
    if (ts.indexOf('number') >= 0) return [...v] as number[];
    return v.map(s => (s as Selector).cloneWithChange(change));
  }

  toString(): string {
    if (this.params.length === 0) {
      return `${this.key}()`;
    } else {
      return `${this.key}(${this.params.map(paramTypeToString).join(",")})`;
    }
  }

  // would this be meaningful if turned into a string?
  isValid(): boolean {
    for (const p of this.params) {
      if (!isValid(p)) return false;
    }
    return true;
  }

  // indicate where a selector will be inserted if one comes along.
  findSelectorInsertionPoint(): ValuePosition | undefined {
    if (!this.id) {
      console.log("Selector has not been assigned IDs so we can't create value positions");
      return undefined;
    }
    for (let i=0; i<this.params.length; i++) {
      const p = this.params[i];
      if (p.type === "SELECTOR_ARRAY") return { selectorId: this.id, argIndex: i }
    }
    for (const p of this.params) {
      if (p.type === "SELECTOR_ARRAY") {
        for (const s of p.value) {
          const pos = s.findSelectorInsertionPoint();
          if (pos) return pos;
        }
      }
    }
    // could be something like "books()"
    return undefined;
  }

  // does this selector need selectors added to it to become valid, e.g. "all()"
  needsSelectors(): boolean {
    for (let i=0; i<this.params.length; i++) {
      const p = this.params[i];
      if (p.type === "SELECTOR_ARRAY" && p.value.length === 0) return true;
    }
    for (const p of this.params) {
      if (p.type === "SELECTOR_ARRAY") {
        for (const s of p.value) {
          const needs = s.needsSelectors();
          if (needs) return true;
        }
      }
    }
    return false;
  }
}

export function emptyValue(argType: ARG_TYPE): ParamType {
  switch (argType) {
    case "USER": return { type: "USER", value: undefined };
    case "TAG": return { type: "TAG", value: undefined };
    case "TAGGROUP": return { type: "TAGGROUP", value: undefined };
    case "SELECTOR_ARRAY": return { type: "SELECTOR_ARRAY", value: [] };
    case "PUBLISHER": return { type: "PUBLISHER", value: undefined };
    case "DESIGNER": return { type: "DESIGNER", value: undefined };
    case "YEAR": return { type: "YEAR", value: undefined };
    case "MECHANIC": return { type: "MECHANIC", value: undefined };
    case "CATEGORY": return { type: "CATEGORY", value: undefined };
    case "GAME_IDS": return { type: "GAME_IDS", value: [] };
  }
}

export interface SelectorType {
  key: string;
  // formal parameter types
  args: ARG_TYPE[];
  description: string;
  colour: string;
  hints?: string;
}

export interface ValuePosition {
  selectorId: number;
  argIndex: number;
}

export interface ValueChange extends ValuePosition {
  value: ParamType;
}

export const SELECTOR_TYPES: SelectorType[] = [
  {
    key: "all",
    args: ["SELECTOR_ARRAY"],
    description: "Intersection of one or more selectors",
    colour: "fuchsia",
    hints: "Any game in every of the selectors will be in the result."
  },
  {
    key: "minus",
    args: ["SELECTOR_ARRAY"],
    description: "One selector with a set of others removed",
    colour: "fuchsia",
    hints: "The first selector must be the one whose games you want in the list, subsequent selectors are those whose games will not be in the result."
  },
  {
    key: "any",
    args: ["SELECTOR_ARRAY"],
    description: "Union of a number of selectors",
    colour: "fuchsia",
    hints: "Any game in any of the selectors will be in the result."
  },
  {
    key: "rated",
    args: ["USER"],
    description: "Games rated by the user",
    colour: "blue"
  },
  {
    key: "played",
    args: ["USER"],
    description: "Games played by the user",
    colour: "blue"
  },
  {
    key: "piy",
    args: ["USER","YEAR"],
    description: "Games played by the user in the specified year",
    colour: "blue"
  },
  {
    key: "owned",
    args: ["USER"],
    description: "Games owned by the user",
    colour: "blue"
  },
  {
    key: "wtb",
    args: ["USER"],
    description: "Games the user has marked as want-to-buy",
    colour: "blue"
  },
  {
    key: "wit",
    args: ["USER"],
    description: "Games the user has marked as want-in-trade",
    colour: "blue"
  },
  {
    key: "trade",
    args: ["USER"],
    description: "Games the user has marked as for-trade",
    colour: "blue"
  },
  {
    key: "wtp",
    args: ["USER"],
    description: "Games the user has marked as want-to-play",
    colour: "blue"
  },
  {
    key: "ids",
    args: ["GAME_IDS"],
    description: "Select games by explicit BGG ID",
    colour: "black",
  },
  {
    key: "expansions",
    args: [],
    description: "All games marked as expansions",
    colour: "black"
  },
  {
    key: "books",
    args: [ ],
    description: "All games which BGG says are books",
    colour: "black"
  },
  {
    key: "ranked",
    args: [ ],
    description: "All games which have a BGG ranking",
    colour: "black"
  },
  {
    key: "designer",
    args: [ "DESIGNER" ],
    description: "All games by this designer",
    colour: "black"
  },
  {
    key: "publisher",
    args: [ "PUBLISHER" ],
    description: "All games by this publisher",
    colour: "black"
  },
  {
    key: "category",
    args: [ "CATEGORY" ],
    description: "All games in the given category",
    colour: "black"
  },
  {
    key: "mechanic",
    args: [ "MECHANIC" ],
    description: "All games using the given mechanic",
    colour: "black"
  },
  {
    key: "tagged",
    args: [ ],
    description: "All games tagged by the logged-in user",
    colour: "green"
  },
  {
    key: "tag",
    args: [ "TAG" ],
    description: "All games given the tag by the logged-in user",
    colour: "green"
  },
  {
    key: "taggroup",
    args: [ "TAGGROUP" ],
    description: "All games given a tag in the tag group by the logged-in user",
    colour: "green"
  }
];
