import { colors } from "./deps.ts";

export const exit = (...messages: unknown[]) => {
	console.log(colors.red("fatal"), ...messages);
	console.log(colors.bold(colors.red("\nexiting...")));
	Deno.exit(1);
};

export type DeepReadOnly<T> = {
	readonly [P in keyof T]: DeepReadOnly<T[P]>;
};
