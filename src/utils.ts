import { colors } from "./deps.ts";

export const exit = (message: string) => {
	console.log(colors.red("fatal"), message);
	Deno.exit(1);
};
