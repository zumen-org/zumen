import { argparse, colors, ParseError, Parser } from "./deps.ts";
import { evaluate } from "./evaluator/evaluator.ts";
import { executor } from "./executor/executor.ts";
import { generator } from "./generator/generator.ts";
import { parse } from "./parser/parser.ts";
import { exit } from "./utils.ts";
import { validate } from "./validator/validator.ts";

async function main() {
	const args = argparse(Deno.args);

	if (args["help"] | args["h"]) {
		console.log(`${colors.yellow("-h, --help")}\tshow this help message`);
		console.log(
			`${colors.yellow(
				"--config",
			)}  \tpath to lisp config file (default test.lisp)`,
		);
		console.log(
			`${colors.yellow("--flow")}    \tname of flow to run (default main)`,
		);
		Deno.exit(0);
	}

	const config = await Deno.readTextFile(args["config"] ?? "test.lisp");

	// parse the lisp config
	const result = parse(config);
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
		return exit(`Unable to find flow '${flowName}' in the file ${config}`);

	const layouts = generator(flow);

	// executing only one layout for testing
	for (const layout of layouts) {
		console.log(colors.blue("*"), ` workspace ${layout.workspace}`);
		await executor(layout);
	}
}

main();
