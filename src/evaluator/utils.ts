import { FunCall, Number } from "../parser/parser.ts";
import { exit } from "../utils.ts";
import { ExecCall, LayoutCall, WsCall } from "../validator/types.ts";

export interface Exec {
	programName: string;
	programClass: string;
	programCmd: string;
}

export interface Arrangement {
	split: "horizontal" | "vertical";
	ratio: number[];
	nodes: (Arrangement | Exec)[];
}

export interface WorkspaceDefinition {
	workspace: number;
	node: Arrangement;
}

function toArrangementOrExec(call: LayoutCall | ExecCall): Arrangement | Exec {
	if (call.name == "exec") {
		const [programName, programClass, programCmd] = call.arguments.map(
			v => v.value,
		);
		return {
			programName,
			programClass,
			programCmd,
		};
	} else {
		const [ratioExpr, ...nodeExprs] = call.arguments;
		const ratio = ratioExpr.values.map(v => (v as Number).value);
		const nodes = nodeExprs.map(toArrangementOrExec);

		if (ratio.reduce((a, b) => a + b) != 100)
			exit(`Sum of ratio entries must be 100!`);

		if (ratio.length != nodes.length)
			exit(`Different number of ratios and layouts provided!`);

		return {
			split: (call as FunCall).name as "horizontal" | "vertical",
			ratio,
			nodes,
		};
	}
}

export const getWorkspaceDefinition = (wsCall: WsCall): WorkspaceDefinition => {
	// top level layout node
	const [workspace, node] = wsCall.arguments;

	// ratio and internal nodes
	const [ratioExpr, ...nodeExprs] = node.arguments;

	const ratio = ratioExpr.values.map(v => v.value);
	const nodes = nodeExprs.map(toArrangementOrExec);

	return {
		workspace: workspace.value,
		node: {
			split: node.name,
			ratio,
			nodes,
		},
	};
};
