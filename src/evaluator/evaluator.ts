import { Flow } from "../types.ts";
import { ValidatedConfig } from "../validator/types.ts";
import { getWorkspaceDefinition, WorkspaceDefinition } from "./utils.ts";

export const evaluate = (definition: ValidatedConfig[]): Flow[] => {
	const flows: Flow[] = [];

	for (const flowDefinition of definition) {
		const [nameExpr, ...wsExprs] = flowDefinition.arguments;
		const flowName = nameExpr.value;

		const wsDefinitions: WorkspaceDefinition[] = [];

		for (const wsDef of wsExprs)
			wsDefinitions.push(getWorkspaceDefinition(wsDef));

		flows.push({ name: flowName, definitions: wsDefinitions });
	}

	return flows;
};
