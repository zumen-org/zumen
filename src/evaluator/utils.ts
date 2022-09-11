import {
	Arrangement,
	ArrangementCall,
	Exec,
	ExecCall,
	WorkspaceDefinition,
	WorkspaceDefinitionCall,
} from "./functions.ts";

import { Number } from "../parser/parser.ts";

function toNonCall(call: ArrangementCall | ExecCall): Arrangement | Exec {
	if (call.name == "exec") {
		const [programName, programClass] = call.arguments.map(v => v.value);
		return {
			programName,
			programClass,
		};
	} else {
		const [ratioCall, ...nodesCall] = call.arguments;
		return {
			ratio: ratioCall.values.map(v => (v as Number).value),
			nodes: nodesCall.map(toNonCall),
		};
	}
}

export const getWorkspaceDefinition = (
	call: WorkspaceDefinitionCall,
): WorkspaceDefinition => {
	// no validation needed as it's already done before

	// top level layout node
	const [workspace, node] = call.arguments;

	// ratio and internal nodes
	const [ratioCall, ...nodesCall] = node.arguments;

	const ratio = ratioCall.values.map(v => (v as Number).value);
	const nodes = nodesCall.map(toNonCall);

	return {
		workspace: workspace.value,
		node: {
			ratio,
			nodes,
		},
	};
};
