import { firstIn, many, oneIn, Parser, stringl, until } from "../../deps.ts";

export const delimiters = ["\n", " ", "\t", "\0"];

export const whitespace = Parser.combinator(ca => {
	return many(oneIn(...delimiters.map(v => stringl(v))))(ca);
});

export const word = Parser.combinator(ca =>
	firstIn([...delimiters, ")"].map(v => until(v)))(ca),
);
