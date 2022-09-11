import { Expression, FunCall, List, Number, String } from "../parser/parser.ts";

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
		return {
			ratio: (ratioExpr as List).values.map(v => (v as Number).value),
			nodes: (nodeExprs as FunCall[]).map(toArrangementOrExec),
		};
	}
}

export const getWorkspaceDefinition = (
	call: Expression,
): WorkspaceDefinition => {
	// no validation needed as it's already done before

	// top level layout node
	const [workspace, node] = (call as FunCall).arguments;

	// ratio and internal nodes
	const [ratioExpr, ...nodeExprs] = (node as FunCall).arguments;

	const ratio = (ratioExpr as List).values.map(v => (v as Number).value);
	const nodes = (nodeExprs as FunCall[]).map(toArrangementOrExec);

	return {
		workspace: (workspace as Number).value,
		node: {
			ratio,
			nodes,
		},
	};
};
