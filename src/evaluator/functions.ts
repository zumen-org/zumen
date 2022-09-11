import { Atom, FunCall, List, Number, String } from "../parser/parser.ts";
import { DeepReadOnly } from "../utils.ts";

type Argument =
	| {
			name: string;
			type: (Atom | String | Number)["type"];
			variadic?: boolean;
	  }
	| {
			name: string;
			type: List["type"];
			variadic?: boolean;
			of: (Atom | String | Number | FunCall)["type"];
	  }
	| {
			name: string;
			type: FunCall["type"];
			variadic?: boolean;
			function: string | string[];
	  };

const makeFnRecord = <T extends Record<string, DeepReadOnly<Argument[]>>>(
	v: T,
) => v;

// variadic argument must be the last argument in the array
export const Functions = makeFnRecord({
	flow: [
		{
			name: "name of the flow",
			type: "string",
		},
		{
			name: "workspace definitions",
			type: "fun-call",
			function: "ws",
			variadic: true,
		},
	],
	ws: [
		{ name: "workspace", type: "number" },
		{
			name: "nodes",
			type: "fun-call",
			function: ["horizontal", "vertical"],
			variadic: true,
		},
	],
	horizontal: [
		{
			name: "percentage ratio",
			type: "list",
			of: "number",
		},
		{
			name: "nodes",
			type: "fun-call",
			function: ["horizontal", "vertical", "exec"],
			variadic: true,
		},
	],
	vertical: [
		{
			name: "percentage ratio",
			type: "list",
			of: "number",
		},
		{
			name: "nodes",
			type: "fun-call",
			function: ["horizontal", "vertical", "exec"],
			variadic: true,
		},
	],
	exec: [
		{ name: "program name", type: "string" },
		{ name: "program class", type: "string" },
	],
} as const);

interface ExecCall {
	type: FunCall["type"];
	name: "exec";
	arguments: [programName: string, programClass: string];
}

interface ArrangementCall {
	type: FunCall["type"];
	name: "horizontal" | "vertical";
	arguments: [ratio: number[], nodes: ArrangementCall | ExecCall];
}

export interface WorkspaceDefinitionCall {
	type: FunCall["type"];
	name: "ws";
	arguments: [workspace: number, nodes: ArrangementCall];
}
