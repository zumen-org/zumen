import {
	FunCall,
	KeywordParameter,
	List,
	Number,
	String,
} from "../parser/parser.ts";

export type ValidatedConfig = FunCall<"flow", [String, ...WsCall[]]>;

export type WsCallKeywordParameters =
	| KeywordParameter<"pre", String>
	| KeywordParameter<"post", String>;

export type WsCall = FunCall<
	"ws",
	(Number | LayoutCall | WsCallKeywordParameters)[]
>;

export type LayoutCall = FunCall<
	"horizontal" | "vertical",
	[List<Number>, ...ExecCall[]]
>;

export type ExecCall = FunCall<"exec", [String, String, String]>;
