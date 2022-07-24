import { Parser, within } from "../../deps.ts";
import { Expression } from "../parser.ts";

/*
	description:
		parses text enclosed between double quotes

	examples:
		"hello"
		"world"
*/
export default Parser.combinator<Expression>(ca => {
	const value = Parser.expect(within('"', '"')(ca));

	return {
		type: "string",
		value,
	};
});
