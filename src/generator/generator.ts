import { Arrangement, Exec } from "../evaluator/utils.ts";
import { Flow, IndividualNode, LayoutNode } from "../types.ts";

export interface Layout {
	workspace: number;
	pre: string | undefined;
	post: string | undefined;
	node: LayoutNode;
	execNodes: Exec[];
}

function getNodeAndExecNodes(
	arrangement: Arrangement,
	percent: number,
): { node: LayoutNode; execNodes: Exec[] } {
	const execNodes: Exec[] = [];

	const node: LayoutNode = {
		layout: arrangement.split == "vertical" ? "splitv" : "splith",
		percent: percent / 100,
		type: "con",
		nodes: arrangement.nodes.map((node, i) => {
			// if this node is a layout
			if ("split" in node) {
				const { node: nestedNode, execNodes: nestedExecNodes } =
					getNodeAndExecNodes(node, arrangement.ratio[i]);
				execNodes.push(...nestedExecNodes);
				return nestedNode;
			}
			// if this node is an Exec/Individual node
			else {
				execNodes.push(node);
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
			}
		}),
	};

	return {
		node,
		execNodes,
	};
}

export const generator = (flow: Flow): Layout[] => {
	const nodes: Layout[] = [];

	for (const definition of flow.definitions) {
		// root node always covers the screen
		const { node, execNodes } = getNodeAndExecNodes(definition.node, 100);

		nodes.push({
			workspace: definition.workspace,
			pre: definition.pre,
			post: definition.post,
			node,
			execNodes,
		});
	}

	return nodes;
};
