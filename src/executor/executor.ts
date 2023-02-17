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

	// run the pre command
	if (layout.pre) {
		console.log("Running the pre-run command...");
		const [{ success }] = await wm.runCommand(layout.pre);
		console.log(
			`Pre-run command execution ${
				success ? "succeeded" : "failed, exiting..."
			}!`,
		);
	}

	console.log(`${requiredPrograms.length} programs expected to launch...`);

	await wm.subscribe(["WINDOW"]);
	// start a listener that waits for the programs to open
	const programOpenPromise = new Promise<void>(resolve => {
		wm.on(i3.Events.WINDOW, ctx => {
			if (ctx.change == "new") {
				const targetIndex = requiredPrograms.findIndex(v => {
					const containerName = ctx.container.name;
					if (v.programName && containerName) {
						if (!new RegExp(v.programName).exec(containerName)) return false;
					}

					const windowProperties = ctx.container.window_properties;
					if (windowProperties) {
						if (!new RegExp(v.programClass).exec(windowProperties.class))
							return false;
					}

					return true;
				});

				if (targetIndex >= 0) {
					// this is a program required by our template
					const target = requiredPrograms[targetIndex];
					if (target.programName) {
						console.log(
							`${target.programName} (class: '${target.programClass}') opened up`,
						);
					} else {
						console.log(`'${target.programClass}' opened up`);
					}

					if (targetIndex >= 0) requiredPrograms.splice(targetIndex, 1);
					if (requiredPrograms.length > 0)
						console.log(
							`Waiting for ${requiredPrograms.length} other programs to launch...`,
						);
					else {
						console.log(
							colors.green("success"),
							"All required programs launched, flow execution successful!",
						);

						if (layout.post) {
							// run the post command
							console.log("Running the post command...");
							wm.runCommand(layout.post).then(([{ success }]) => {
								console.log(
									success
										? "Post-run command execution successful!"
										: "Failed to run the post-run command",
								);
								resolve();
							});
						} else resolve();
					}
				}
			}
		});
	});

	// attempt to launch the programs
	for (const program of requiredPrograms) {
		console.log(
			colors.yellow("info"),
			`attempting to launch ${program.programName} using '${program.programCmd}'`,
		);

		const [{ success, parse_error }] = await wm.runCommand(program.programCmd);
		console.log(
			` ${
				success
					? colors.green("command execution succeeded")
					: `${colors.red("failed")}${
							parse_error ? " due to a parse error" : ""
					  }`
			}`,
		);
	}

	await programOpenPromise;
};
