import { Atom, FunCall, List, Number, String } from "../parser/parser.ts";

type ExpectedArgument =
	| {
			name: string;
			type: (Atom | String | Number)["type"];
			variadic?: boolean;
	  }
	| {
			name: string;
			type: List["type"];
			of: (Atom | String | Number | FunCall)["type"];
			variadic?: boolean;
	  }
	| {
			name: string;
			type: FunCall["type"];
			function: string | string[];
			variadic?: boolean;
	  };

// variadic argument must be the last argument in the array
export const Functions: Record<string, ExpectedArgument[]> = {
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
		{ name: "i3 command to launch program", type: "string" },
	],
};
