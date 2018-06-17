import * as utils from "../lib/utils";

describe("The file functions", () => {
	it("should load all filed in directory", () => {
		return utils.getFilePathsOfDirectories(["./test/data/A"]).then(paths => {
			expect(paths.length).toEqual(2);
		});
	});

	it("should load multiple directories", () => {
		return utils.getFilePathsOfDirectories(["./test/data/A", "./test/data/B"]).then(paths => {
			expect(paths.length).toEqual(4);
		});
	});
});

describe("The glob functions", () => {
	it("should load all files matching the patterns", () => {
		return utils.getFilePathsFromGlobs(["*/**/*.entry.ts"]).then(paths => {
			expect(paths.length).toEqual(2);
		});
	});
});
