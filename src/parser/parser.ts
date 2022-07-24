import { oneIn, Parser, many } from "../deps.ts";
import atom from "./combinators/atom.ts";
import number from "./combinators/number.ts";
import string from "./combinators/string.ts";
import { whitespace } from "./combinators/util.ts";

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
			arguments: Expression[];
	  };

export const parse = (program: string) => {
	const parser = new Parser();

	const expression = Parser.combinator(ca => {
		whitespace(ca);
		const r = oneIn(atom, string, number)(ca);
		whitespace(ca);

		return r;
	});

	return parser.parse(
		'25 53 52 23 :hi :hello "what" :hi 35 "bye"',
		many(expression),
	);
};
