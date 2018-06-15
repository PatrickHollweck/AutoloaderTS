import { Autoloader } from "./Autoloader";
import { AutoloadResult } from "../AutloadResult";

import * as fs from "fs-extra";
import * as path from "path";
import * as glob from "fast-glob";
import * as typescript from "typescript";

import nodeEval = require("node-eval");

export class NodeEvalAutoLoader implements Autoloader {
	protected result: AutoloadResult;

	protected tsConfig: typescript.TranspileOptions;
	protected codeToInject: string;

	protected constructor(
		private tsConfigContent: string,
		customOptions?: typescript.TranspileOptions
	) {
		this.codeToInject = "";
		this.result = new AutoloadResult();
		this.tsConfig = { ...JSON.parse(tsConfigContent), ...customOptions };
	}

	/**
	 * Creates a new instance of the Autloader.
	 * The tsconfig is loaded autmatically if a path to it is no given!
	 * @param customOptions Optional additional typescript transpilation options
	 * @param tsConfigPath Override to the default tsconfig path
	 */
	public static async make(customOptions?: typescript.TranspileOptions, tsConfigPath?: string) {
		if (!tsConfigPath) {
			const foundPath = typescript.findConfigFile(process.cwd(), typescript.sys.fileExists);
			if (!foundPath) throw new Error("Could not find the tsconfig file!");
			tsConfigPath = foundPath;
		}

		const content = await fs.readFile(tsConfigPath);
		return new NodeEvalAutoLoader(content.toString(), customOptions);
	}

	/**
	 * Define the custom code that can be injected before the evaluation - Must be valid js code!
	 * @param customCode The code that should be injected
	 */
	public injectCode(customCode: string) {
		this.codeToInject = customCode;
		return this;
	}

	/**
	 * Autoload file from directories
	 * @param directories The directories that should be loaded
	 */
	public async fromDirectories(...directories: string[]) {
		for (const directory of directories) {
			const files = await fs.readdir(directory);

			for (const file of files) {
				const filePath = this.formatPath(directory, file);
				await this.evaluate(filePath);
			}
		}

		return this;
	}

	/**
	 * Autoload all files in glob.
	 * @param pattern The glob pattern
	 * @param options Custom glob options
	 */
	public async fromGlob(...patterns: string[]) {
		patterns = patterns.map(pattern => {
			return pattern.replace("\\", "/");
		});

		await glob(patterns).then(async files => {
			for (const file of files) {
				await this.evaluate(file.toString());
			}
		});

		return this;
	}

	public getResult() {
		return this.result;
	}

	protected async evaluate(filePath: string) {
		const jsCode = await this.getJsFromTsFile(filePath);

		if (!jsCode) {
			return;
		}

		/*
		 * Sometimes code needs things to run corretly, for example
		 * in the typescript world it is very common to use a typescript plugin
		 * called tsconfig-paths which lets you use absolute imports based on
		 * the tsconfig configuration. This "feature" requires a "hook", which must
		 * be injected inorder to make the code run correctly.
		 * Here we are injecting this hook
		 */
		const codeToEval = `${this.codeToInject}${jsCode}`;

		let evalResult: any;
		try {
			evalResult = nodeEval(codeToEval, filePath);
		} catch (e) {
			throw new Error(`Could not evaluate autoloaded file ${filePath} - ERROR: \n ${e}`);
		}

		for (const exported in evalResult) {
			if (typeof evalResult[exported] === "string") {
				continue;
			}

			this.result.exports.push(evalResult[exported]);
		}
	}

	protected async getJsFromTsFile(filePath: string) {
		// Ensure that the path is valid.
		if (!this.shouldEvaluateFile(filePath)) {
			return null;
		}

		// Make sure the filePath is absolute.
		if (!path.isAbsolute(filePath)) {
			filePath = path.join(process.cwd(), filePath);
		}

		const tsCode = await fs.readFile(filePath);
		return await this.transpileTypescript(tsCode.toString());
	}

	protected async transpileTypescript(tsCode: string) {
		const transpilationResult = typescript.transpileModule(tsCode, this.tsConfig);
		if (transpilationResult.diagnostics && transpilationResult.diagnostics.length > 0) {
			throw new Error(
				`Could not compile autoloaded code! - ${transpilationResult.diagnostics}`
			);
		}

		return transpilationResult.outputText;
	}

	protected formatPath(directory: string, file: string) {
		return `${directory}/${file}`;
	}

	protected shouldEvaluateFile(filePath: string) {
		const fileExtension = path.extname(filePath);

		if (fileExtension === "" || fileExtension !== ".ts") {
			return false;
		}

		return true;
	}
}
