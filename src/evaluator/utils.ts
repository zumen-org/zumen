import { FunCall, KeywordParameter, Number, String } from "../parser/parser.ts";
import { exit, partition } from "../utils.ts";
import {
	ExecCall,
	LayoutCall,
	WsCall,
	WsCallKeywordParameters,
} from "../validator/types.ts";

export interface Exec {
	programName: string | undefined;
	programClass: string;
	programCmd: string;
}

export interface Arrangement {
	split: "horizontal" | "vertical";
	ratio: number[];
	nodes: (Arrangement | Exec)[];
}

export interface WorkspaceDefinition {
	workspace: number;
	pre: string | undefined;
	post: string | undefined;
	node: Arrangement;
}

function getInfoFromArgs(args: LayoutCall["arguments"]) {
	const [ratioExpr, ...nodeExprs] = args;
	const ratio = ratioExpr.values.map(v => v.value);
	const nodes = nodeExprs.map(toArrangementOrExec);

	const sum = ratio.reduce((a, b) => a + b);
	if (sum != 100)
		return exit(
			`Sum of ratio entries must be 100! Found: ${sum}, ratios: ${ratio.join(
				", ",
			)}`,
		);

	if (ratio.length != nodes.length)
		return exit(
			`Different number of ratios and layouts provided! ratios: ${ratio.length}, nodes: ${nodes.length}`,
		);

	return {
		ratio,
		nodes,
	};
}

function toArrangementOrExec(call: LayoutCall | ExecCall): Arrangement | Exec {
	if (call.name == "exec") {
		const [[programCmd], keywordParameters] = partition<
			typeof call["arguments"][number]
		>(call.arguments, v => v.type == "string") as [
			[String],
			KeywordParameter[],
		];

		type ClassKeywordParameter = KeywordParameter<"class", String> | undefined;
		type NameKeywordParameter = KeywordParameter<"name", String> | undefined;

		const programClass = (
			keywordParameters.find(v => v.keyword == "class") as ClassKeywordParameter
		)?.value?.value;

		const programName = (
			keywordParameters.find(v => v.keyword == "name") as NameKeywordParameter
		)?.value?.value;

		// class is required, since otherwise i3 doesn't
		// know what program a template needs to swallow
		if (!programClass) {
			return exit(
				`Invalid config, no class specified for '${programCmd.value}'`,
			);
		}

		return {
			programName,
			programClass,
			programCmd: `exec '${programCmd.value}'`,
		};
	} else {
		const { ratio, nodes } = getInfoFromArgs(call.arguments);
		return {
			split: (call as FunCall).name as "horizontal" | "vertical",
			ratio,
			nodes,
		};
	}
}

export const getWorkspaceDefinition = (wsCall: WsCall): WorkspaceDefinition => {
	// top level layout node
	// the cast is required because a keyword parameter might occur
	// at any position in the arguments. however, the positional
	// integrity of the other arguments has been verified in the
	// validator, so this is safe to do
	const [keywordParams, otherParams] = partition(
		wsCall.arguments,
		v => v.type === "keyword-parameter",
	) as [WsCallKeywordParameters[], [Number, LayoutCall]];

	const [workspace, node] = otherParams;

	// this is for the root layout of a workspace file
	const { ratio, nodes } = getInfoFromArgs(node.arguments);

	type PreKeywordParameter = KeywordParameter<"pre", String> | undefined;
	type PostKeywordParameter = KeywordParameter<"post", String> | undefined;

	return {
		workspace: workspace.value,
		pre: (keywordParams.find(v => v.keyword == "pre") as PreKeywordParameter)
			?.value?.value,
		post: (keywordParams.find(v => v.keyword == "post") as PostKeywordParameter)
			?.value?.value,
		node: {
			split: node.name,
			ratio,
			nodes,
		},
	};
};
