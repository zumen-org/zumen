import { argparse, ParseError, Parser } from "./deps.ts";
import { evaluate } from "./evaluator/evaluator.ts";
import { executor } from "./executor/executor.ts";
import { generator } from "./generator/generator.ts";
import { parse } from "./parser/parser.ts";
import { exit } from "./utils.ts";
import { validate } from "./validator/validator.ts";

function main() {
	const args = argparse(Deno.args);
	const program = Deno.readTextFileSync(args["program"] ?? "test.lisp");

	// parse the lisp config
	const result = parse(program);
	if (result instanceof ParseError) return exit(Parser.format(result));

	// validate the config
	const validation = validate(result);
	if (!validation) return;

	// extract flows from the config
	const flows = evaluate(result);

	// generate i3 json layout for the target flow
	const flowName: string = args["flow"] ?? "main";
	const flow = flows.find(v => v.name == flowName);
	if (!flow)
		return exit(`Unable to find flow '${flowName}' in the file ${program}`);

	const layouts = generator(flow);
	// console.log(Deno.inspect(layouts, { colors: true, depth: 100 }));

	executor(layouts[0]);
}

main();
