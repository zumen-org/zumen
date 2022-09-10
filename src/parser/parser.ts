import { many, Parser } from "../deps.ts";
import atom from "./combinators/atom.ts";
import funCall from "./combinators/fun-call.ts";
import list from "./combinators/list.ts";
import number from "./combinators/number.ts";
import string from "./combinators/string.ts";
import { whitespace } from "./combinators/util.ts";
import { zOneIn } from "./utils.ts";

export interface Atom {
	type: "atom";
	value: string;
}

export interface String {
	type: "string";
	value: string;
}

export interface Number {
	type: "number";
	value: number;
}

export interface List {
	type: "list";
	values: Expression[];
}

export interface FunCall {
	type: "fun-call";
	name: string;
	arguments: Expression[];
}

export type Expression = Atom | String | Number | List | FunCall;

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
