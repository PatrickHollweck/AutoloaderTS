import { Autoloader } from "./Autoloader";
import { AutoloadResult } from "../AutloadResult";
import { prepareGlobPatterns, getFilePathsFromGlobs, getFilePathsOfDirectories } from "../utils";

import * as glob from "fast-glob";

export class DynamicImportAutoloader implements Autoloader {
	protected result: AutoloadResult;

	constructor() {
		this.result = new AutoloadResult();
	}

	public static async make() {
		return new DynamicImportAutoloader();
	}

	public injectCode(customCode: string): this {
		throw new Error("The dynamic-import loader does not support codeInjections!");
	}

	public async fromDirectories(...directories: string[]): Promise<this> {
		await getFilePathsOfDirectories(directories).then(paths => {
			this.evaluatePaths(paths);
		});

		return this;
	}

	public async fromGlob(...patterns: string[]): Promise<this> {
		await getFilePathsFromGlobs(patterns).then(paths => {
			this.evaluatePaths(paths);
		});

		return this;
	}

	public getResult() {
		return this.result;
	}

	protected evaluatePaths(paths: string[]) {
		for (const path of paths) {
			this.evaluate(path);
		}
	}

	protected evaluate(path: string) {
		import(path).then(mod => {
			for (const exported in mod) {
				this.result.exports.push(mod[exported]);
			}
		});
	}
}
