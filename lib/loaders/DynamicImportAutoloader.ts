import { Autoloader } from "./Autoloader";
import { AutoloadResult } from "../AutloadResult";

export class DynamicImportAutoloader implements Autoloader {
	protected result: AutoloadResult;

	constructor() {
		this.result = new AutoloadResult();
	}

	public static async make() {
		return new DynamicImportAutoloader();
	}

	public injectCode(customCode: string): this {
		throw new Error("Method not implemented.");
	}

	public fromDirectories(...directories: string[]): Promise<this> {
		throw new Error("Method not implemented.");
	}

	public fromGlob(...patterns: string[]): Promise<this> {
		throw new Error("Method not implemented.");
	}

	public getResult() {
		return this.result;
	}
}
