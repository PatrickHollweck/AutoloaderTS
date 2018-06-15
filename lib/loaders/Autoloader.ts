import { AutoloadResult } from "../AutloadResult";

export interface Autoloader {
	getResult(): AutoloadResult;
	injectCode(customCode: string): this;

	fromDirectories(...directories: string[]): Promise<this>;
	fromGlob(...patterns: string[]): Promise<this>;
}
