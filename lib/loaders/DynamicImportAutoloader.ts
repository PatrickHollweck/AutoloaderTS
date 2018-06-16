import { Autoloader } from "../interfaces/Autoloader";
import { AutoloadResult } from "../AutloadResult";
import { getFilePathsFromGlobs, getFilePathsOfDirectories } from "../utils";

/**
 * A autoloader which uses the "import()" function to load.
 * ! To use this loader you may have to use Typescript 2.9 or higher.
 */
export class DynamicImportAutoloader implements Autoloader {
	protected result: AutoloadResult;

	constructor() {
		this.result = new AutoloadResult();
	}

	/**
	 * Creates a new instance of the DynamicImportAutoloader.
	 * * This method exists just for compatibility with other loaders.
	 * * It does not do anything more that create a instance of the autoloader.
	 */
	public static async make() {
		return new DynamicImportAutoloader();
	}

	/**
	 * Autoloads all files in the specified directories.
	 * @param directories The direcories to load from
	 */
	public async fromDirectories(...directories: string[]): Promise<this> {
		await getFilePathsOfDirectories(directories).then(paths => {
			this.evaluatePaths(paths);
		});

		return this;
	}

	/**
	 * Autoloads all files from the these patterns.
	 * @param patterns The patterns to search with
	 */
	public async fromGlob(...patterns: string[]): Promise<this> {
		await getFilePathsFromGlobs(patterns).then(paths => {
			this.evaluatePaths(paths);
		});

		return this;
	}

	/**
	 * Gets the Result of the autoload.
	 */
	public getResult() {
		return this.result;
	}

	/**
	 * Processes all files in the array.
	 * @param paths Evaluates all paths in a array
	 */
	protected evaluatePaths(paths: string[]) {
		for (const path of paths) {
			this.evaluate(path);
		}
	}

	/**
	 * Evaluates and processes the file.
	 * @param path The path to evaluate
	 */
	protected evaluate(path: string) {
		import(path).then(mod => {
			for (const exported in mod) {
				this.result.exports.push(mod[exported]);
			}
		});
	}
}
