export type ARG_TYPE = "GAME_IDS" | "SELECTOR_ARRAY" | "USER" | "DESIGNER" | "PUBLISHER" | "CATEGORY" | "MECHANIC" | "TAG"

export interface SelectorType {
  key: string;
  args: ARG_TYPE[];
  description: string;
  colour: string;
  disabled?: boolean;
  hints?: string;
}

export const SELECTOR_TYPES: SelectorType[] = [
  {
    key: "ids",
    args: ["GAME_IDS"],
    description: "Select games by explicit BGG ID",
    colour: "orange",
  },
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
    key: "wtp",
    args: ["USER"],
    description: "Games the user has marked as want-to-play",
    colour: "blue"
  },
  {
    key: "expansions",
    args: [],
    description: "All games marked as expansions",
    colour: "black"
  },
  {
    key: "designer",
    args: [ "DESIGNER" ],
    description: "All games by this designer",
    colour: "black"
  },
  // {
  //   key: "publisher",
  //   args: [ "PUBLISHER" ],
  //   description: "All games by this publisher",
  //   colour: "black"
  // },
  {
    key: "books",
    args: [ ],
    description: "All games which BGG says are books",
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
  // {
  //   key: "category",
  //   args: [ "CATEGORY" ],
  //   description: "All games in the given category",
  //   colour: "gray"
  // },
  // {
  //   key: "mechanic",
  //   args: [ "MECHANIC" ],
  //   description: "All games using the given mechanic",
  //   colour: "gray"
  // },
];
