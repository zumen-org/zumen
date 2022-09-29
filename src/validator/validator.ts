import {
	Expression,
	FunCallArgument,
	KeywordParameter,
} from "../parser/parser.ts";
import { exit, partition } from "../utils.ts";
import { Functions } from "./functions.ts";
import { ValidatedConfig } from "./types.ts";

const validateArgs = (name: string, args: FunCallArgument[]) => {
	const fn = Functions[name as keyof typeof Functions];

	// check if the function exists
	if (!args) return exit(`Call to unknown function '${name}'`);

	const expectedArgLength = fn.arguments.length;

	// check if the number of arguments is correct
	if (fn.properties.variadic) {
		if (args.length < expectedArgLength)
			return exit(
				`Function '${name}' takes at least ${expectedArgLength} arguments, ${args.length} given`,
			);
	} else {
		if (args.length != expectedArgLength)
			return exit(
				`Function '${name}' takes ${expectedArgLength} arguments, ${args.length} given`,
			);
	}

	const errorPreface = `In call to function '${name}'`;

	const [keywordArgs, regularArgs] = partition(
		args,
		v => v.type == "keyword-parameter",
	);

	for (let i = 0; i < keywordArgs.length; i++) {
		const arg = keywordArgs[i] as KeywordParameter;
		const argErrorPreface = `${errorPreface}, in an argument`;
		const match = fn.taggedArguments.find(v => v.keyword == arg.keyword);

		if (!match)
			return exit(
				`${argErrorPreface}, found invalid keyword parameter with keyword '${arg.keyword}'`,
			);

		if (arg.value.type != match.valueType)
			return exit(
				`${argErrorPreface}, found ${arg.value.type} with keyword '${arg.keyword}', expected ${match.valueType}`,
			);
	}

	// loop over the regular (non-keyword) args and compare them with expected args
	for (let i = 0; i < regularArgs.length; i++) {
		const arg = regularArgs[i];

		const argErrorPreface = `${errorPreface}, in an argument`;

		const expectedArg =
			fn.properties.variadic && i >= expectedArgLength
				? fn.arguments.at(-1)
				: fn.arguments[i];

		if (!expectedArg)
			return exit(
				`${argErrorPreface}, unable to obtain expected argument for validation`,
			);

		// check if the argument is of the expected type
		if (arg.type != expectedArg.type)
			return exit(
				`${argErrorPreface}, expected ${expectedArg.type}, got ${arg.type}'`,
			);

		// if the argument is a function call, perform respective checks for that function
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

			validateArgs(arg.name, arg.arguments);
		}

		// if the argument is a list, check if all elements are of expected type
		if (arg.type == "list" && expectedArg.type == "list")
			for (let i = 0; i < arg.values.length; i++)
				if (arg.values[i].type != expectedArg.of)
					return exit(
						`${argErrorPreface}, expected list to contain elements of type ${expectedArg.of}, found element of type ${arg.values[i].type} at list index ${i}`,
					);
	}
};

export const validate = (
	definition: Expression[],
): definition is ValidatedConfig[] => {
	for (const expression of definition) {
		if (expression.type == "fun-call" && expression.name == "flow") {
			validateArgs(expression.name, expression.arguments);
		} else
			exit(
				`definition files must only contain 'flow' function calls, found:\n`,
				expression,
			);
	}

	return true;
};
