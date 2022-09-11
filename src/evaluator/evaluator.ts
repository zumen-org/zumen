import { Expression } from "../parser/parser.ts";
import { Node } from "../types.ts";
import { exit } from "../utils.ts";
import { Functions } from "./functions.ts";

const checkFunctionArgs = (name: string, args: Expression[]): args is any[] => {
	const expectedArgs = Functions[name as keyof typeof Functions];

	// check if the function exists
	if (!args) return exit(`Call to unknown function '${name}'`);

	const expectedArgLength = expectedArgs.length;
	const lastExpectedArg = expectedArgs[expectedArgLength - 1];

	// @ts-expect-error only the last element needs variadic
	const variadic = lastExpectedArg.variadic ?? false;

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

		const argErrorPreface = `${errorPreface}, in argument ${i + 1}`;

		// check if the argument is of the proper type
		if (arg.type != expectedArg.type)
			return exit(
				`${argErrorPreface}, expected ${expectedArg.type}, got ${arg.type}'`,
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
			for (let i = 0; i < arg.values.length; i++)
				if (arg.values[i].type != expectedArg.of)
					return exit(
						`${argErrorPreface}, expected list to contain elements of type ${expectedArg.of}, found element of type ${arg.values[i].type} at list index ${i}`,
					);
	}

	return true;
};

export const evaluate = (definition: Expression[]): Node[] => {
	const nodes: Node[] = [];

	for (const expression of definition) {
		if (expression.type == "fun-call" && expression.name == "flow") {
			const flowArgs = expression.arguments;
			checkFunctionArgs(expression.name, flowArgs);
		} else
			exit(
				`definition files must only contain 'flow' function calls, found:\n`,
				expression,
			);
	}

	return nodes;
};
