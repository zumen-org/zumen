import { Combinator, combinatorWithin, many, stringl } from "../../deps.ts";
import { expression, Expression } from "../parser.ts";

/*
	description:
		parses expressions within brackets with a quote at the start

	examples:
		'(24 "hi" :what)
		'(:abcd :efgh "ijkl")
*/
const combinator: Combinator<Expression> = ca => {
	stringl("'")(ca);
	const exprs = combinatorWithin("(", many(expression), ")")(ca);

	return {
		type: "list",
		values: exprs,
	};
};

export default combinator;
