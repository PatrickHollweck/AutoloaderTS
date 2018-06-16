import { AutoloadResult } from "../AutloadResult";

export interface Autoloader {
	getResult(): AutoloadResult;

	fromDirectories(...directories: string[]): Promise<this>;
	fromGlob(...patterns: string[]): Promise<this>;
}
