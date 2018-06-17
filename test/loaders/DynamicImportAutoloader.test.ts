import { DynamicImportAutoloader } from "../../lib/loaders/DynamicImportAutoloader";

describe("The Dynamic-Import Autoloader", () => {
	let loader: DynamicImportAutoloader;

	beforeEach(async () => {
		loader = await DynamicImportAutoloader.make();
	});

	it("should find all exports from the specified files", async () => {
		await loader.fromGlob("*/**/*.entry.ts");
		expect(loader.getResult().exports.length).toEqual(2);
	});

	it("should handle empty files", async () => {
		await loader.fromDirectories("./test/data/B");
		expect(loader.getResult().exports.length).toEqual(1);
	});
});
