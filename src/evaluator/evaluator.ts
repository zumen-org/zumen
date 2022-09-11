import { Expression, FunCall, String } from "../parser/parser.ts";
import { Flow } from "../types.ts";
import { getWorkspaceDefinition, WorkspaceDefinition } from "./utils.ts";

export const evaluate = (definition: FunCall[]): Flow[] => {
	const flows: Flow[] = [];

	for (const flow of definition) {
		const [nameExpr, ...wsExprs] = flow.arguments as [String, Expression];
		const flowName = nameExpr.value;

		const wsDefinitions: WorkspaceDefinition[] = [];

		for (const wsDef of wsExprs)
			wsDefinitions.push(getWorkspaceDefinition(wsDef));

		flows.push({ name: flowName, definitions: wsDefinitions });
	}

	return flows;
};
