import { Arrangement } from "../evaluator/utils.ts";
import { Flow, IndividualNode, LayoutNode } from "../types.ts";

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
			// if this node is a layout
			if ("split" in v) return getNode(v, arrangement.ratio[i]);
			// if this node is an Exec/Individual node
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
				} as IndividualNode;
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
