import { FunCall, List, Number, String } from "../parser/parser.ts";

export type ValidatedConfig = FunCall<"flow", [String, ...WsCall[]]>;

export type WsCall = FunCall<"ws", [Number, LayoutCall]>;

export type LayoutCall = FunCall<
	"horizontal" | "vertical",
	[List<Number>, ...ExecCall[]]
>;

export type ExecCall = FunCall<"exec", [String, String]>;
