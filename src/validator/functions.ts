import {
	Expression,
	FunCall,
	FunCallArgument,
	KeywordParameter,
	List,
	Number,
	String,
} from "../parser/parser.ts";
import { DeepReadOnly } from "../utils.ts";

interface GenericArgument<T extends FunCallArgument> {
	name: string;
	type: T["type"];
}

type ExpectedValueArgument = GenericArgument<String | Number>;

interface ExpectedListArgument extends GenericArgument<List> {
	of: (String | Number | FunCall)["type"];
}

interface ExpectedFunCallArgument extends GenericArgument<FunCall> {
	function: string | string[];
}

interface ExpectedKeywordArgument extends GenericArgument<KeywordParameter> {
	keyword: string;
	valueType: Expression["type"];
}

interface Properties {
	// whether the last argument is variadic
	variadic: boolean;
}

type Argument =
	| ExpectedValueArgument
	| ExpectedListArgument
	| ExpectedFunCallArgument;

type Functions = Record<
	string,
	{
		properties: Properties;
		arguments: Argument[];
		taggedArguments: ExpectedKeywordArgument[];
	}
>;

export const makeFunctions = <T extends DeepReadOnly<Functions>>(v: T) => v;

// keyword parameters are always optional
export const Functions = makeFunctions({
	flow: {
		properties: { variadic: true },
		arguments: [
			{
				name: "name of the flow",
				type: "string",
			},
			{
				name: "workspace definitions",
				type: "fun-call",
				function: "ws",
			},
		],
		taggedArguments: [],
	},
	ws: {
		properties: { variadic: true },
		arguments: [
			{ name: "workspace", type: "number" },
			{
				name: "nodes",
				type: "fun-call",
				function: ["horizontal", "vertical"],
			},
		],
		taggedArguments: [
			{
				name: "command to execute before flow execution on this workspace",
				type: "keyword-parameter",
				keyword: "pre",
				valueType: "string",
			},
			{
				name: "command to execute after flow execution on this workspace",
				type: "keyword-parameter",
				keyword: "post",
				valueType: "string",
			},
		],
	},
	horizontal: {
		properties: { variadic: true },
		arguments: [
			{
				name: "percentage ratio",
				type: "list",
				of: "number",
			},
			{
				name: "nodes",
				type: "fun-call",
				function: ["horizontal", "vertical", "exec"],
			},
		],
		taggedArguments: [],
	},
	vertical: {
		properties: { variadic: true },
		arguments: [
			{
				name: "percentage ratio",
				type: "list",
				of: "number",
			},
			{
				name: "nodes",
				type: "fun-call",
				function: ["horizontal", "vertical", "exec"],
			},
		],
		taggedArguments: [],
	},
	exec: {
		properties: { variadic: false },
		arguments: [
			{ name: "program name", type: "string" },
			{ name: "program class", type: "string" },
			{ name: "i3 command to launch program", type: "string" },
		],
		taggedArguments: [],
	},
} as const);
