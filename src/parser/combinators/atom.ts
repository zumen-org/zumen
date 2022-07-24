import { firstIn, Parser, stringl, until } from "../../deps.ts";
import { Expression } from "../parser.ts";
import { delimiters } from "./util.ts";

/*
	description:
		parses lisp atoms (colon then string till a delimiter)

	examples:
		:abcd
		:efgh
*/
export default Parser.combinator<Expression>(ca => {
	stringl(":")(ca);
	const value = firstIn(delimiters.map(v => until(v)))(ca);

	return {
		type: "atom",
		value,
	};
});
