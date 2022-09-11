import { WorkspaceDefinition } from "./evaluator/utils.ts";

type Container =
	| "root"
	| "output"
	| "con"
	| "floating_con"
	| "workspace"
	| "dockarea";

type Layout =
	| "splith"
	| "splitv"
	| "stacked"
	| "tabbed"
	| "dockarea"
	| "output";

export type LayoutNode = {
	layout: Layout;
	percent: number;
	type: Container;
	nodes: Node[];
};

export type IndependentNode = {
	name: string;
	type: Container;
	percent: number;
	swallows: { class: string }[];
};

export type Node = IndependentNode | LayoutNode;

export interface Flow {
	name: string;
	definitions: WorkspaceDefinition[];
}
