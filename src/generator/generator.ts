import { Arrangement, Exec } from "../evaluator/utils.ts";
import { Flow, IndependentNode, LayoutNode, Node } from "../types.ts";

interface Layout {
	workspace: number;
	node: LayoutNode;
}

function getNode(arrangement: Arrangement, percent: number): LayoutNode {
	return {
		layout: arrangement.split == "vertical" ? "splith" : "splitv",
		percent: percent,
		type: "con",
		nodes: arrangement.nodes.map((v, i) => {
			if ("split" in v) return getNode(v, arrangement.ratio[i]);
			else
				return {
					name: v.programName,
					type: "con",
					percent: arrangement.ratio[i],
					swallows: [
						{
							class: v.programClass,
						},
					],
				} as IndependentNode;
		}),
	};
}

export const generator = (flow: Flow): Layout[] => {
	const nodes: Layout[] = [];

	for (const definition of flow.definitions) {
		nodes.push({
			workspace: definition.workspace,
			// root node always covers the screen
			node: getNode(definition.node, 1),
		});
	}

	return nodes;
};
