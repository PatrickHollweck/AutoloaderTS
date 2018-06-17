import * as glob from "fast-glob";
import * as path from "path";
import * as fs from "fs";

export function prepareGlobPatterns(patterns: string[]) {
	return patterns.map(pattern => pattern.replace("\\", "/"));
}

export async function getFilePathsFromGlobs(patterns: string[]) {
	patterns = prepareGlobPatterns(patterns);

	const files: string[] = [];

	for (const pattern of patterns) {
		await glob(pattern).then(globFiles => {
			for (const file of globFiles) {
				const filePath = formatPath(process.cwd(), file.toString());
				files.push(filePath);
			}
		});
	}

	return files;
}

export async function getFilePathsOfDirectories(directories: string[]) {
	const files: string[] = [];

	for (const directory of directories) {
		const directoryFiles = await fs.promises.readdir(directory);

		for (const file of directoryFiles) {
			const filePath = formatPath(directory, file);
			files.push(filePath);
		}
	}

	return files;
}

export function formatPath(directory: string, file: string) {
	return path.resolve(directory, file);
}
