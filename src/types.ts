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

type LayoutNode = {
	layout: Layout;
	percent: number;
	type: Container;
	nodes: IndependentNode[];
};

type IndependentNode = {
	percent: number;
	name: string;
	type: Container;
	swallows: { class: string; instance: string }[];
};

export type Node = IndependentNode | LayoutNode;

export interface Flow {
	name: string;
	definitions: WorkspaceDefinition[];
}
