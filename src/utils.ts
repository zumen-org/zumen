import { colors } from "./deps.ts";

export const exit = (message: string) => {
	console.log(colors.red("fatal"), message);
	console.log("exiting...");
	Deno.exit(1);
};
