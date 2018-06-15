import { NodeEvalAutoLoader } from "./loaders/NodeEvalLoader";
import { DynamicImportAutoloader } from "./loaders/DynamicImportAutoloader";

export class Autoloader {
	static nodeEval = NodeEvalAutoLoader.make;
	static dynamicImport = DynamicImportAutoloader.make;
}
