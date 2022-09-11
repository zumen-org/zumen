import { ParseError, Parser } from "./deps.ts";
import { evaluate } from "./evaluator/evaluator.ts";
import { generator } from "./generator/generator.ts";
import { parse } from "./parser/parser.ts";
import { exit } from "./utils.ts";
import { validate } from "./validator/validator.ts";

function main() {
	const program = Deno.readTextFileSync("test.lisp");

	// parse the lisp config
	const result = parse(program);
	if (result instanceof ParseError) return exit(Parser.format(result));

	// validate the config
	const validation = validate(result);
	if (!validation) return;

	// extract flows from the config
	const flows = evaluate(result);

	// generate i3 json layout per flow
	for (const flow of flows) {
		const i3json = generator(flow);
		console.log(`flow: ${flow.name}`);
		console.log(Deno.inspect(i3json, { colors: true, depth: 100 }));
	}
}

main();
