import { ApplyMetadata } from "../ApplyMetadata";

@ApplyMetadata("I am autoloaded from class A!")
export class A {
	public static greet(name: string) {
		console.log(`Hello, ${name}`);
	}
}
