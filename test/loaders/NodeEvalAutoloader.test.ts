import { NodeEvalAutoLoader } from "../../lib/loaders/NodeEvalLoader";

describe("The NodeEval Autoloader", () => {
	let loader: NodeEvalAutoLoader;

	beforeEach(async () => {
		loader = await NodeEvalAutoLoader.make();
	});

	it("should find all exports from the loaded files", async () => {
		await loader.fromDirectories("./test/data/A");
		expect(loader.getResult().exports.length).toEqual(2);
	});

	it("should handle empty files", async () => {
		await loader.fromDirectories("./test/data/B");
		expect(loader.getResult().exports.length).toEqual(1);
	});
});
