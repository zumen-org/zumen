import { Flow } from "../types.ts";
import { ValidatedConfig } from "../validator/validator.ts";
import { getWorkspaceDefinition, WorkspaceDefinition } from "./utils.ts";

export const evaluate = (definition: ValidatedConfig[]): Flow[] => {
	const flows: Flow[] = [];

	for (const flow of definition) {
		const [nameExpr, ...wsExprs] = flow.arguments;
		const flowName = nameExpr.value;

		const wsDefinitions: WorkspaceDefinition[] = [];

		for (const wsDef of wsExprs)
			wsDefinitions.push(getWorkspaceDefinition(wsDef));

		flows.push({ name: flowName, definitions: wsDefinitions });
	}

	return flows;
};
