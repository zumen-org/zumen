import { Expression, FunCall, List, Number, String } from "../parser/parser.ts";
import { exit } from "../utils.ts";

export interface Exec {
	programName: string;
	programClass: string;
}

interface Arrangement {
	ratio: number[];
	nodes: (Arrangement | Exec)[];
}

export interface WorkspaceDefinition {
	workspace: number;
	node: Arrangement;
}

function toArrangementOrExec(call: FunCall): Arrangement | Exec {
	if (call.name == "exec") {
		const [programName, programClass] = call.arguments.map(
			v => (v as String).value,
		);
		return {
			programName,
			programClass,
		};
	} else {
		const [ratioExpr, ...nodeExprs] = (call as FunCall).arguments;
		const ratio = (ratioExpr as List).values.map(v => (v as Number).value);
		const nodes = (nodeExprs as FunCall[]).map(toArrangementOrExec);

		if (ratio.reduce((a, b) => a + b) != 100)
			exit(`Sum of ratio entries must be 100!`);

		if (ratio.length != nodes.length)
			exit(`Different number of ratios and layouts provided!`);

		return {
			ratio,
			nodes,
		};
	}
}

export const getWorkspaceDefinition = (
	call: Expression,
): WorkspaceDefinition => {
	// top level layout node
	const [workspace, node] = (call as FunCall).arguments;

	// ratio and internal nodes
	const [ratioExpr, ...nodeExprs] = (node as FunCall).arguments;

	const ratio = (ratioExpr as List).values.map(v => (v as Number).value);
	const nodes = (nodeExprs as FunCall[]).map(toArrangementOrExec);

	if (ratio.length != nodes.length)
		exit(`Different number of ratios and layouts provided!`);

	if (ratio.reduce((a, b) => a + b) != 100)
		exit(`Sum of ratio entries must be 100!`);

	return {
		workspace: (workspace as Number).value,
		node: {
			ratio,
			nodes,
		},
	};
};
