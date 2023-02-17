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

export interface ExpectedKeywordArgument
	extends GenericArgument<KeywordParameter> {
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
		// TODO: temporary hack to support keyword parameters
		// since otherwise it's an argument count check failure
		// since required params are always 1 and any more will
		// cause the expected param count to mismatch
		properties: { variadic: true },
		arguments: [{ name: "i3 command to launch program", type: "string" }],
		taggedArguments: [
			{
				name: "class of the program you want to launch",
				type: "keyword-parameter",
				keyword: "class",
				valueType: "string",
			},
			{
				name: "name of the program you want to launch",
				type: "keyword-parameter",
				keyword: "name",
				valueType: "string",
			},
		],
	},
} as const);
