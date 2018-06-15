import { Autoloader } from "../../lib";

/*
 * To mix things up, in this example we use the dynamicImport loader.
 *
 * This loader is one of the two loader, which you can choose.
 * They both have the same api. But the schemantics may be diffrent!
 */

(async () => {
	const loader = await Autoloader.dynamicImport();
	await loader.fromGlob("*/**/*.autoload.ts");

	console.log(loader.getResult());
})();
