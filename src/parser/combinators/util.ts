import { many, oneIn, Parser, stringl } from "../../deps.ts";

export const delimiters = ["\n", " ", "\t", "\0"] as const;

export const whitespace = Parser.combinator(ca => {
	return many(oneIn(...delimiters.map(v => stringl(v))))(ca);
});
