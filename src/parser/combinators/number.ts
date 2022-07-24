import { Parser } from "../../deps.ts";
import { Expression } from "../parser.ts";
import { word } from "./util.ts";

/*
	description:
		parses whole numbers without any decimals

	examples:
		25
		64
*/
export default Parser.combinator<Expression>(ca => {
	const value = word(ca);
	const numberValue = parseInt(value);

	if (isNaN(numberValue))
		throw ca.error({
			expected: "parseable number",
			found: value,
		});

	return {
		type: "number",
		value: numberValue,
	};
});
