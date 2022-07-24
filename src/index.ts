import { parse } from "./parser/parser.ts";

const program = Deno.readTextFileSync(
	"/home/udit/CodingProjects/zumen/test.lisp",
);

console.log(program);
console.log("\nparse result:");
console.log(parse(program));
