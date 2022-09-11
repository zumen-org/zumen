import { FunCall, String } from "../parser/parser.ts";
import { Node } from "../types.ts";
import { WorkspaceDefinitionCall } from "../validator/functions.ts";
import { getWorkspaceDefinition } from "./utils.ts";

export const evaluate = (definition: FunCall[]): Node[] => {
	const nodes: Node[] = [];

	for (const expression of definition) {
		const [name, args] = expression.arguments as [
			name: String,
			// todo: remove `WorkspaceDefinitionCall` and replace with `Expression`
			args: WorkspaceDefinitionCall,
		];

		const definition = getWorkspaceDefinition(args);

		console.log(name.value);
		console.log(definition);
	}

	return nodes;
};
