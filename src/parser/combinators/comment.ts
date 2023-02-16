import { Parser, stringl, until } from "../../deps.ts";

/*
	description:
		parses comments (anything starting with ;; till a newline)

	examples:
		;; hi, I am a comment
		;; hello
*/
export default Parser.combinator(ca => {
	stringl(";;")(ca);
	until("\n")(ca);

	// since the `until` combinator backtracks after finding \n
	// we need to move on
	ca.cursor.set(ca.cursor.get() + 1);
});
