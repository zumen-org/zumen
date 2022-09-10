import { Expression } from "../parser/parser.ts";

type Argument =
	| {
			name: string;
			type: Exclude<Exclude<Expression["type"], "list">, "fun-call">;
			variadic?: boolean;
	  }
	| {
			name: string;
			type: "list";
			variadic?: boolean;
			of: Exclude<Expression["type"], "list">;
	  }
	| {
			name: string;
			type: "fun-call";
			variadic?: boolean;
			function: string | string[];
	  };

// variadic argument must be the last argument in the array
export const Functions: Record<string, Argument[]> = {
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
};
