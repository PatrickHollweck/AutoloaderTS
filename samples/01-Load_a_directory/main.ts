/*
 * In this sample we are going to import a directory.
 * The directory that will be loaded is under ./autoload
 *
 * Autoloading is mainly used in addition to decorators / metadata
 * Because to get the metadata of a object the file needs to be imported.
 *
 * This sample demostrates that use case.
 *
 * You will loose all type-safety by using autloading - But that is not the point of autloading
 * The point is to import file and then make them availiable for reflection.
 *
 * So you should use this in a framework-like context. Also, Autloading only works on the server
 * You can NOT use this for client-side javascript since it imports files dynamically!
 */

// To use the metadata api we need to import this package
import "reflect-metadata";

// Import the Autloader
import { Autoloader } from "../../lib";
import { MetdataKey } from "./ApplyMetadata";
import { isExportDeclaration } from "typescript";

// Make a async iife
(async () => {
	// Initialize the loader
	const loader = await Autoloader.requireLoader();

	// Load the directory - Returns the exports of the file
	await loader.fromDirectories(`${__dirname}/autoload`);

	// Get the result of the loader
	const result = loader.getResult();
	console.log("Autoload Result --- ", result);

	// Demonstrate that all files are loaded, by checking their metadata value
	for (const exported of result.exports) {
		// Get and log the metadata
		const metadata: string = Reflect.getMetadata(MetdataKey, exported);
		console.log("Metadata of module --- ", metadata);

		// You can then access members of the class dynamically!
		if (metadata.includes("A")) {
			exported.greet("[YOUR_NAME]");
		}
	}
})();
