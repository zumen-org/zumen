import { Combinator, ParseError, Parser } from "../deps.ts";

const zTry =
	<T>(
		c: Combinator<T>,
	): Combinator<
		| { status: "success"; value: T }
		| { status: "failure"; err: ParseError; pos: number }
	> =>
	ca => {
		const start = ca.cursor.get();
		try {
			return {
				status: "success",
				value: c(ca),
			};
		} catch (err) {
			if (err instanceof ParseError) {
				const pos = ca.cursor.get();
				ca.cursor.set(start);
				return {
					status: "failure",
					err,
					pos,
				};
			} else throw err;
		}
	};

export const zOneIn = <T>(...combinators: Combinator<T>[]) =>
	Parser.combinator(ca => {
		const results = [] as { err: ParseError; pos: number }[];

		for (const c of combinators) {
			const result = zTry(c)(ca);
			if (result.status == "success") return result.value;
			else results.push(result);
		}

		// throw the error for the combinator that got the farthest
		const positions = results.map(v => v.pos);
		const farthestPosIndex = positions.indexOf(Math.max(...positions));
		throw results[farthestPosIndex].err;
	});
