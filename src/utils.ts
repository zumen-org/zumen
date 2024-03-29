import { colors } from "./deps.ts";

export type DeepReadOnly<T> = {
	readonly [P in keyof T]: DeepReadOnly<T[P]>;
};

export function partition<T>(arr: T[], condition: (v: T) => boolean) {
	const matching: T[] = [];
	const otherwise: T[] = [];

	arr.forEach(v => (condition(v) ? matching.push(v) : otherwise.push(v)));

	return [matching, otherwise];
}

export function objectIf<T extends boolean, U extends Record<string, unknown>>(
	cond: T,
	v: U,
) {
	if (cond) return v;
	else return {};
}

export const exit = (...messages: unknown[]) => {
	console.log(colors.red("fatal"), ...messages);
	console.log(colors.bold(colors.red("\nexiting...")));
	Deno.exit(1);
};
