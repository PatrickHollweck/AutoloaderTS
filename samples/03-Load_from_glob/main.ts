import { Autoloader } from "../../lib";

(async () => {
	const loader = await Autoloader.make();
	await loader.fromGlob("*/**/*.autoload.ts");

	console.log(loader.result);
})();
