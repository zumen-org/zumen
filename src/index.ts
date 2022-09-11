import { ParseError, Parser } from "./deps.ts";
import { evaluate } from "./evaluator/evaluator.ts";
import { parse } from "./parser/parser.ts";
import { exit } from "./utils.ts";
import { validate } from "./validator/validator.ts";

function main() {
	const program = Deno.readTextFileSync("test.lisp");
	const result = parse(program);

	if (result instanceof ParseError) return exit(Parser.format(result));

	validate(result);

	console.log(evaluate(result));
}

main();
