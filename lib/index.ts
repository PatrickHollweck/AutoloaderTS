import { NodeEvalAutoLoader } from "./loaders/NodeEvalLoader";
import { DynamicImportAutoloader } from "./loaders/DynamicImportAutoloader";
import { RequireLoader } from "./loaders/RequireLoader";

export { AutoloadResult } from "./AutloadResult";
export { DynamicImportAutoloader, NodeEvalAutoLoader, RequireLoader };

export class Autoloader {
	static nodeEval = NodeEvalAutoLoader.make;
	static dynamicImport = DynamicImportAutoloader.make;
	static requireLoader = RequireLoader.make;
}
