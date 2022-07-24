import { Combinator, many, stringl } from "../../deps.ts";
import { expression, Expression } from "../parser.ts";
import { word } from "./util.ts";

/*
	description:
		parses function calls that look like (abcd ...<expression>)

	examples:
		(say-name "adam")
		(abcd :efgh "ijkl" 2345)
*/
const combinator: Combinator<Expression> = ca => {
	stringl("(")(ca);
	const name = word(ca);
	const args = many(expression)(ca);
	stringl(")")(ca);

	return {
		type: "fun-call",
		name,
		arguments: args,
	};
};

export default combinator;
