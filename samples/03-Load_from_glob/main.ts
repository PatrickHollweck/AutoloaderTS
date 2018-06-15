import { Autoloader } from "../../lib";

(async () => {
	const loader = await Autoloader.nodeEval();
	await loader.fromGlob("*/**/*.autoload.ts");

	console.log(loader.getResult());
})();
