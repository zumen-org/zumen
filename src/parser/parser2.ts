import {
	startOfInput,
	endOfInput,
	sequenceOf,
	char,
	choice,
	possibly,
	digits,
	many,
	many1,
	str,
	anyCharExcept,
	recursiveParser,
	anyOfString,
	whitespace,
	Parser,
} from "https://esm.sh/arcsecond@5.0.0";

import * as Data from "./datatypes.ts";

const { from } = Data;

const join =
	(sep = "") =>
	(xs: string[]) =>
		xs.join(sep);

const quotedStr = (quote: string) =>
	sequenceOf([char(quote), many(choice([escape(quote), except(quote)])).map(join("")), char(quote)])
		// ignore quotes, only get contents
		.map(([, contents]) => contents);

const unquotedStr = many1(anyCharExcept(choice([anyOfString(`()'"\n`), whitespace])) as unknown as Parser<string>).map(
	join(),
);

const plusOrMinus = choice([char("+"), char("-")]);
const orEmpty = (parser: Parser<string>) => possibly(parser).map(x => x || "");

const escape = (c: string, escaper = "\\") => sequenceOf([str(escaper), char(c)]).map(([, char]) => char);
const except = (c: string) => anyCharExcept(char(c)) as unknown as Parser<string>;

const int = sequenceOf([orEmpty(plusOrMinus), digits]).map(join());
const float = sequenceOf([int, char("."), digits]).map(join());

// NUMBER
const number = choice([int, float])
	.map(x => Number(x))
	.map(from(Data.Number));

// STRING
const string = choice([quotedStr("'"), quotedStr('"'), unquotedStr]).map(from(Data.String));

// SYMBOL
const symbol = sequenceOf([char("'"), string])
	.map(([, symbol]) => symbol.content)
	.map(from(Data.Symbol));

// KEYWORD
const keyword = sequenceOf([char(":"), string])
	.map(([, keyword]) => keyword.content)
	.map(from(Data.Keyword));

export const atom = choice([number, symbol, keyword, string]);
export const expr = recursiveParser(() => choice([list, quote, atom]));

// QUOTE
export const quote: Parser<Data.Quote> = sequenceOf([
	char("'"),
	char("("),
	many1(sequenceOf([many(whitespace), expr]).map(([, expr]) => expr)),
	char(")"),
]).map(([, , expr]) => new Data.Quote(expr));

// LIST
export const list: Parser<Data.List> = sequenceOf([
	char("("),
	sequenceOf([many(whitespace), string]).map(([, s]) => s),
	many(sequenceOf([many1(whitespace), expr]).map(([, expr]) => expr)),
	char(")"),
]).map(([, identifier, expr]) => new Data.List({ head: identifier, tail: expr }));

// COMMENT
export const comment = sequenceOf([char(";"), many(except("\n"))])
	.map(([, comment]) => comment)
	.map(join())
	.map(from(Data.Comment));

// PROGRAM
export const program = sequenceOf([startOfInput, many1(choice([list, comment, whitespace])), endOfInput]).map(
	([, stuff]) => stuff,
);
