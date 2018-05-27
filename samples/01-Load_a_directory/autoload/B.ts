import { ApplyMetadata } from "../ApplyMetadata";

@ApplyMetadata("I am autoloaded from class B")
export class B {
	public luckyNumber = 1337;
}
