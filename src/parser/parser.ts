import { many, Parser } from "../deps.ts";
import atom from "./combinators/atom.ts";
import funCall from "./combinators/fun-call.ts";
import list from "./combinators/list.ts";
import number from "./combinators/number.ts";
import string from "./combinators/string.ts";
import { whitespace } from "./combinators/util.ts";
import { zOneIn } from "./utils.ts";

export type Expression =
	| {
			type: "atom";
			value: string;
	  }
	| {
			type: "string";
			value: string;
	  }
	| {
			type: "number";
			value: number;
	  }
	| {
			type: "list";
			values: Expression[];
	  }
	| {
			type: "fun-call";
			name: string;
			arguments: Expression[];
	  };

export const expression = Parser.combinator(ca => {
	whitespace(ca);
	const r = zOneIn(funCall, list, number, string, atom)(ca);
	whitespace(ca);

	return r;
});

export const parse = (program: string) => {
	const parser = new Parser();
	return parser.parse(program, many(expression, false));
};
