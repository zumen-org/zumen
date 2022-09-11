import { Expression, FunCall, String } from "../parser/parser.ts";
import { Node } from "../types.ts";
import { getWorkspaceDefinition, WorkspaceDefinition } from "./utils.ts";

export const evaluate = (definition: FunCall[]): Node => {
	for (const flow of definition) {
		const [nameExpr, ...wsExprs] = flow.arguments as [String, Expression];
		const flowName = nameExpr.value;

		const wsDefinitions: WorkspaceDefinition[] = [];

		for (const wsDef of wsExprs)
			wsDefinitions.push(getWorkspaceDefinition(wsDef));

		console.log(wsDefinitions);
	}

	// todo
	return undefined as any;
};
