import { colors } from "../deps.ts";
import { Expression } from "../parser/parser.ts";
import { Node } from "../types.ts";
import { exit } from "../utils.ts";
import { Functions } from "./functions.ts";

const checkFunctionArgs = (name: string, args: Expression[]) => {
	const expectedArgs = Functions[name];

	// check if the function exists
	if (!args) return exit(`Call to unknown function '${name}'`);

	const expectedArgLength = expectedArgs.length;
	const lastExpectedArg = expectedArgs[expectedArgLength - 1];
	const variadic = lastExpectedArg.variadic;

	// check if the number of arguments is correct
	if (!variadic && args.length != expectedArgs.length)
		return exit(
			`Function '${name}' takes ${expectedArgs.length} arguments, ${args.length} given`,
		);

	const errorPreface = `In call to function '${name}'`;
	for (let i = 0; i < args.length; i++) {
		const arg = args[i];
		const expectedArg =
			variadic && i >= expectedArgLength ? lastExpectedArg : expectedArgs[i];

		// check if the argument is of the proper type
		if (arg.type != expectedArg.type)
			return exit(
				`${errorPreface}, in argument ${i + 1}, expected ${
					expectedArg.type
				}, got ${arg.type}'`,
			);

		// if the argument is a function call, perform checks for that function
		if (arg.type == "fun-call") checkFunctionArgs(arg.name, arg.arguments);

		// if the argument is a list, check if all elements are of expected type
		if (arg.type == "list" && expectedArg.type == "list")
			for (const element of arg.values)
				if (element.type != expectedArg.of)
					return exit(
						`${errorPreface}, in argument ${
							i + 1
						}, expected list to contain elements of type ${
							expectedArg.of
						}, found element of type ${element.type}`,
					);
	}
};

export const evaluate = (definition: Expression[]): Node[] => {
	const nodes: Node[] = [];

	for (const expression of definition) {
		if (expression.type == "fun-call" && expression.name == "flow") {
			checkFunctionArgs("flow", expression.arguments);
		} else
			console.log(
				colors.red("fatal"),
				`definition files must only contain 'flow' function calls, found:\n`,
				expression,
			);
	}

	return nodes;
};
