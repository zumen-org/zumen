import { i3 } from "../deps.ts";
import { Layout } from "../generator/generator.ts";

const LAYOUT_FILE = "/tmp/zumen.ndjson";

export const executor = async (layout: Layout) => {
	const wm = await i3.Connect();

	await Deno.writeTextFile(LAYOUT_FILE, JSON.stringify(layout.node));

	await wm.runCommand(
		`workspace ${layout.workspace}; append_layout ${LAYOUT_FILE}`,
	);
};
