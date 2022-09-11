import { Arrangement } from "../evaluator/utils.ts";
import { Flow, IndividualNode, LayoutNode } from "../types.ts";

export interface Layout {
	workspace: number;
	node: LayoutNode;
}

function getNode(arrangement: Arrangement, percent: number): LayoutNode {
	return {
		layout: arrangement.split == "vertical" ? "splitv" : "splith",
		percent: percent / 100,
		type: "con",
		nodes: arrangement.nodes.map((node, i) => {
			// if this node is a layout
			if ("split" in node) return getNode(node, arrangement.ratio[i]);
			// if this node is an Exec/Individual node
			else
				return {
					name: node.programName,
					type: "con",
					percent: arrangement.ratio[i] / 100,
					swallows: [
						{
							class: node.programClass,
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
			node: getNode(definition.node, 100),
		});
	}

	return nodes;
};
