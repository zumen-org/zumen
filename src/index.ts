import { ParseError, Parser } from "./deps.ts";
import { parse } from "./parser/parser.ts";

const program = Deno.readTextFileSync(
	"/home/udit/CodingProjects/zumen/test.lisp",
);

console.log(program);
console.log("\n---------------------------------\n");

const result = parse(program);

if (result instanceof ParseError) console.log(Parser.format(result));
else if (result instanceof Error) console.log(result.message);
else
	console.log(
		Deno.inspect(result, {
			colors: true,
			depth: 30,
			sorted: true,
		}),
	);
