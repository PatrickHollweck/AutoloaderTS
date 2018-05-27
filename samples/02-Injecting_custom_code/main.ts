import { Autoloader } from "../../lib";

(async () => {
	/*
	* In this example code injection is demonstrated.
	*
	* By using the "injectCode" method on the autloader
	* you can inject custom pieces of code into each autloaded file
	*
	* This is neccessary somethimes. For example in the typescript world
	* a "compiler hook/plugin" named "tsconfig-paths" may be used. This
	* plugin lets you use absolute imports aka "lib/Job" instead of "../lib/Job"
	*
	* After the typescript is compiled the import path will still be "lib/Job". But the
	* nodejs runtime will have no clue how to resolve this path, so you can use
	* the provided tsconfig-paths register to tell nodejs how to resolve this kind
	* of paths.
	*
	* But you will need to include a require statement in every file which may seem
	* very boilderplaty to reduce this unessesary boilerplate you can tell the autoloader
	* to inject the require call at the start of every file.
	*
	* IMPORTANT:
	* This feature should only be used to make you code free of unwanted boilerplate, or
	* provide features like discussed above! DO NOT over use this!
	*
	* Also the code in the injectCode call is transported via a string -> Meaning there could
	* be errors in it that wont be spotted by the compiler!
	* Also make sure to include a semicolon or a line-break since this code will just be
	* concatenated with the js code, Also make sure you dont override something!
	*/

	const loader = await Autoloader.make({}, `${__dirname}/tsconfig.json`);

	const evaluated = await loader
		.injectCode(
			`
				const pathsTsPlugin = require("tsconfig-paths");
				pathsTsPlugin.register({
					baseUrl: "/",
					paths: []
				});
			`
		)
		.fromDirectories(`${__dirname}/autoload`);

	evaluated.result.exports.forEach(exported => {
		new exported().doRun();
	});
})();
