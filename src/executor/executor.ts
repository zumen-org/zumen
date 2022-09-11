import { colors, i3 } from "../deps.ts";
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
	else console.log(`Loaded layout, waiting for template programs to open...`);

	const requiredPrograms = layout.execNodes;
	await wm.subscribe(["WINDOW"]);
	wm.on(i3.Events.WINDOW, ctx => {
		if (ctx.change == "new") {
			const targetIndex = requiredPrograms.findIndex(
				v =>
					ctx.container.name == v.programName &&
					ctx.container.window_properties?.class == v.programClass,
			);

			if (targetIndex >= 0) {
				// this is a program required by our template
				const target = requiredPrograms[targetIndex];
				console.log(
					`${target.programName} (class: '${target.programClass}') was opened`,
				);

				if (targetIndex >= 0) requiredPrograms.splice(targetIndex, 1);
				if (requiredPrograms.length > 0)
					console.log(
						`Waiting for ${requiredPrograms.length} other programs to launch...`,
					);
				else {
					console.log(
						colors.green("success"),
						"All required programs launched, flow execution successful",
					);
					Deno.exit(1);
				}
			}
		}
	});
};
