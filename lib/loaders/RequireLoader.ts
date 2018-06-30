import { Autoloader } from "../interfaces/Autoloader";
import { AutoloadResult } from "../AutloadResult";

import * as utils from "../utils";

export class RequireLoader implements Autoloader {
	protected result: AutoloadResult;

	constructor() {
		this.result = new AutoloadResult();
	}

	public static async make() {
		return new RequireLoader();
	}

	public async fromDirectories(...directories: string[]) {
		await utils.getFilePathsOfDirectories(directories).then(async paths => {
			for (const path of paths) {
				await this.evaluate(path);
			}
		});

		return this;
	}

	public async fromGlob(...patterns: string[]) {
		await utils.getFilePathsFromGlobs(patterns).then(async paths => {
			for (const path of paths) {
				await this.evaluate(path);
			}
		});

		return this;
	}

	public getResult() {
		return this.result;
	}

	protected async evaluate(path: string) {
		const exported = require(path);
		for (const mod in exported) {
			this.result.exports.push(exported[mod]);
		}
	}
}
