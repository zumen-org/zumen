// deno-lint-ignore-file no-explicit-any

export class ParserResult<T> {
	tag?: string;
	constructor(public content: T) {}
}

export class Number extends ParserResult<number> {
	tag = "Number" as const;
}
export class String extends ParserResult<string> {
	tag = "String" as const;
}
export class Symbol extends ParserResult<string> {
	tag = "Symbol" as const;
}
export class Keyword extends ParserResult<string> {
	tag = "Keyword" as const;
}
export class Quote extends ParserResult<(Parsers | Parsers[])[]> {
	tag = "Quote" as const;
}
export class List extends ParserResult<{ head: String; tail: (Parsers | Parsers[])[] }> {
	tag = "List" as const;
}
export class Comment extends ParserResult<string> {
	tag = "Comment" as const;
}

export type Parsers = Number | String | Symbol | Keyword | Quote | List | Comment;

export const from =
	<D extends new (p: any) => any>(DataType: D) =>
	(content: ConstructorParameters<D>[0]): InstanceType<D> =>
		new DataType(content);
