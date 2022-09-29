import { Combinator, many, Parser, stringl } from "../../deps.ts";
import {
	expression,
	Expression,
	FunCallArgument,
	KeywordParameter,
} from "../parser.ts";
import { zOneIn } from "../utils.ts";
import { word } from "./util.ts";

/*
	description:
		parses keyword parameters (colon and a word followed by an expression)

	examples:
		:age 20
		:name "Okada"
*/
const keywordParameter = Parser.combinator<KeywordParameter>(ca => {
	stringl(":")(ca);
	const keyword = word(ca);
	const value = expression(ca);

	return {
		type: "keyword-parameter",
		keyword,
		value,
	};
});

/*
	description:
		parses function calls that look like (abcd ...<expression>)

	examples:
		(say-name "adam")
		(calculate-cost :price 200 :quantity 30)
*/
const funCall: Combinator<Expression> = ca => {
	stringl("(")(ca);
	const name = word(ca);
	const args = many(zOneIn<FunCallArgument>(expression, keywordParameter))(ca);
	stringl(")")(ca);

	return {
		type: "fun-call",
		name,
		arguments: args,
	};
};

export default funCall;
