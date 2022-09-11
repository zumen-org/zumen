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
		if (arg.type == "fun-call" && expectedArg.type == "fun-call") {
			if (
				Array.isArray(expectedArg.function)
					? !expectedArg.function.some(v => v === arg.name)
					: expectedArg.function != arg.name
			)
				exit(
					`${errorPreface}, expected only call to ${
						Array.isArray(expectedArg.function)
							? expectedArg.function.map(v => `'${v}'`).join(" or ")
							: `'${expectedArg.function}'`
					}, found call to '${arg.name}'`,
				);
			checkFunctionArgs(arg.name, arg.arguments);
		}

		// if the argument is a list, check if all elements are of expected type
		if (arg.type == "list" && expectedArg.type == "list")
			for (let j = 0; j < arg.values.length; j++)
				if (arg.values[j].type != expectedArg.of)
					return exit(
						`${errorPreface}, in argument ${
							i + 1
						}, expected list to contain elements of type ${
							expectedArg.of
						}, found element of type ${arg.values[j].type} at list index ${j}`,
					);
	}
};

export const evaluate = (definition: Expression[]): Node[] => {
	const nodes: Node[] = [];

	for (const expression of definition) {
		if (expression.type == "fun-call" && expression.name == "flow") {
			checkFunctionArgs(expression.name, expression.arguments);
		} else
			console.log(
				colors.red("fatal"),
				`definition files must only contain 'flow' function calls, found:\n`,
				expression,
			);
	}

	return nodes;
};
