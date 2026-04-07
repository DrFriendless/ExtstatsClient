import {ARG_TYPE, ParamType, SELECTOR_TYPES, SelectorType} from "./selector-types.mjs";
// @ts-ignore
import {compile} from "./moo.js";

export function parseSelector(selector: string): SelectorType | undefined {
  const expr = parse(selector);
  return expressionToSelectorType(expr);
}

function expressionToSelectorType(expr: Expression): SelectorType | undefined {
  const matches = SELECTOR_TYPES.filter(t => t.key === expr.func);
  if (matches.length === 0) {
    console.log(`No selector type for key ${expr.func}`);
    return undefined;
  }
  const typ = matches[0];
  if (typ.args.length === 0) return typ;
  const params = zip(typ.args, expr.args).map(argToParamType);
  if (params.indexOf(undefined) >= 0) {
    console.log("Could not parse all arguments");
    return undefined;
  }
  typ.params = params as ParamType[];
  return typ;
}

function argToParamType(arg: { 0: ARG_TYPE, 1: Arg}): ParamType | undefined {
  switch (arg[1].kind) {
    case Argument.Expression:
      const selector = expressionToSelectorType((arg[1] as Expression));
      if (!selector) {
        console.log("Cannot find selector");
        return undefined;
      }
      switch (arg[0]) {
        case "SELECTOR_ARRAY":
          return { type: arg[0], value: [selector] };
      }
      console.log(`Type error expected ${arg[0]} got selector`);
      return undefined;
    case Argument.Integer:
      switch (arg[0]) {
        case "DESIGNER":
        case "PUBLISHER":
          return { type: arg[0], value: (arg[1] as Integer).value };
      }
      console.log(`Type error expected ${arg[0]} got ${arg[1].kind}`);
      return undefined;
    case Argument.Keyword:
      if (arg[0] === "USER" && (arg[1] as Keyword).keyword === "ME") {
        return { type: "USER", value: "ME" }
      }
      console.log(`Type error expected ${arg[0]} got ${(arg[1] as Keyword).keyword}`);
      return undefined;
    case Argument.StringValue:
      switch (arg[0]) {
        case "CATEGORY":
        case "MECHANIC":
        case "TAG":
          return { type: arg[0], value: (arg[1] as StringValue).value }
        case "USER":
          const u = (arg[1] as StringValue).value;
          const noQuotes = u.slice(1, u.length - 1);
          return { type: "USER", value: { user: noQuotes } };
      }
      console.log(`Type error expected ${arg[0]} got ${arg[1].kind}`);
      return undefined;
  }
}

const tokens = {
  whitespace: /[ \t]+/,
  identifier: /[a-z][a-zA-Z0-9]*/,
  int:        /0|[1-9][0-9]*/,
  str:        /"(?:\\["\\]|[^\n"\\])*"/,
  lparen:     '(',
  rparen:     ')',
  comma:      ',',
  keyword:    /[A-Z][A-Z0-9]*/,
};

export enum Argument {
  Keyword, Integer, StringValue, Expression
}

export interface Arg {
  kind: Argument;
}

export interface Keyword extends Arg {
  kind: Argument.Keyword;
  keyword: string;
}

export interface Integer extends Arg {
  kind: Argument.Integer;
  value: number;
}

export interface StringValue extends Arg {
  kind: Argument.StringValue;
  value: string;
}

export interface Expression extends Arg {
  kind: Argument.Expression;
  func: string;
  args: Arg[];
}

interface Token {
  type: string;
  value: string;
  offset: number;
  lineBreaks: number;
  line: number;
  col: number;
}

class ParseState {
  private pointer: number;

  constructor(private tokens: Token[]) {
    this.pointer = 0;
  }

  peek(): Token {
    return this.tokens[this.pointer];
  }

  next(): Token {
    return this.tokens[this.pointer++];
  }

  consume(type: string) {
    const t = this.next();
    if (t.type != type) throw new Error("Expected " + type + " got " + t.type);
  }

  pushback() {
    this.pointer--;
  }
}

function parse(input: string): Expression {
  const lexer = compile(tokens);
  lexer.reset(input);
  lexer.reset(input);
  return parseExpression(new ParseState((Array.from(lexer) as Token[]).filter(tok => tok.type !== 'whitespace')));
}

function parseExpression(state: ParseState): Expression {
  const func = state.next().value;
  state.consume("lparen");
  const args = parseArgs(state);
  state.consume("rparen");
  return { kind: Argument.Expression, func, args } as Expression;
}

function parseArgs(state: ParseState): Arg[] {
  const result: Arg[] = [];
  while (true) {
    const peek = state.peek();
    if (peek.type === "rparen") return result;
    const arg = parseArg(state);
    result.push(arg);
    const after = state.peek();
    if (after.type != "comma") return result;
    state.consume("comma");
  }
}

function parseArg(state: ParseState): Arg {
  const next = state.next();
  if (next.type === "keyword") {
    return { kind: Argument.Keyword, keyword: next.value } as Keyword;
  } else if (next.type === "int") {
    return { kind: Argument.Integer, value: parseInt(next.value) } as Integer;
  } else if (next.type === "str") {
    const v = next.value.replaceAll('\\"', "");
    return { kind: Argument.StringValue, value: v } as StringValue;
  } else {
    state.pushback();
    return parseExpression(state);
  }
}

function zip<A, B>(left: A[], right: B[]): { 0: A, 1: B }[] {
  return left.map((a,i: number)=> { return { 0: a, 1: right[i] }; } );
}
