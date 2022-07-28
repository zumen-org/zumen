import { colors, ParseError, Parser } from "./deps.ts";
import { parse } from "./parser/parser.ts";

function main() {
	const program = Deno.readTextFileSync("test.lisp");
	const result = parse(program);

	if (result instanceof ParseError)
		return console.log(colors.red("fatal"), Parser.format(result));

	console.log(result);
}

main();
