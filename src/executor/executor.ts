import { i3 } from "../deps.ts";
import { Layout } from "../generator/generator.ts";
import { exit } from "../utils.ts";

const LAYOUT_FILE = "/tmp/zumen.json";

export const executor = async (layout: Layout) => {
	const wm = await i3.Connect();

	await Deno.writeTextFile(LAYOUT_FILE, JSON.stringify(layout.node));

	const [{ success }] = await wm.runCommand(
		`workspace ${layout.workspace}; append_layout ${LAYOUT_FILE}`,
	);

	if (!success) exit(`Unable to load the layout file at '${LAYOUT_FILE}'`);

	await wm.subscribe(["WINDOW"]);
	wm.on(i3.Events.WINDOW, ctx => {
		if (ctx.change == "new") {
			// check if a program we want opened
		}
	});
};
