# AutoloaderTS

> AutoloaderTS is a nodejs autoloader for typescript

### Why and What ?

Importing files written in typescript in a nodejs environment can be rather tricky, Since you not only have
to transpile the code but also have to be extra carefull to not mess up the scope and context. For this reason
Autoloader-ts was born. It transpiles and requires all the selected files, and allow you to continue to use
compiler plugins like `tsconfig-paths`.

## Docs

### RECOMMENDED: Take a look at our samples:

1.  [Loading files](https://github.com/FetzenRndy/AutoloaderTS/tree/master/samples/01-Load_a_directory)
2.  [Injecting Code](https://github.com/FetzenRndy/AutoloaderTS/tree/master/samples/02-Injecting_custom_code)
3.  [Loading from a glob](https://github.com/FetzenRndy/AutoloaderTS/tree/master/samples/03-Load_from_glob)

---

## Loader Types

There are 2 kinds of loaders this lib implements.

1.  DynamicImport-Autoloader (Recommended)

    This Autoloader uses the `import(PATH)` function for import.

    ```ts
    const loader = Autoloader.dynamicImport();
    ```

2.  NodeEval-Autoloader

    This Autoloader uses the "node-eval" lib and uses the fs api to load and dynamically invoke files.

    > The ? after the parameter means "optional"

    ```ts
    const loader = Autoloader.nodeEval(customCompilerOptions?, tsConfigFilePath?);
    ```

You can instantiate one of the other by choosing the correct main `AutoloaderTS` method.
For one or the other you may have to pass some parameters.

### ATTENTION: Schemantics!

What I mean by this is: On the one loader you may need to pass a absolute path and on the other
you can pass both a relative and a absolute path!

Even tho both loader have the `SAME API!` the schemantics may not be the same!
I hope to implement libary level compatability layers in the future, so both can be used
as a "drop-in" replacement.

#### Example

To use the autoloader you first need to create a instance of it. Most of the library is async so make sure to handle it!

```ts
import { Autoloader } from "autoloader-ts";

const loader = await Autoloader.nodeEval();
```

Then you can use the instance methods to load files. There are 2 main ways to load files.

1.  From directories

```ts
await loader.fromDirectories(`${__dirname}/autoload`);
```

2.  From a glob

```ts
await loader.fromGlob("*/**/*.autoload.ts");
```

If you need to inject code into you might want to call this method BEFORE loading the files

> The loader will inject this JS code before evaluating it. You may use it to register compiler plugins like
> tsconfig-paths. DO NOT misuse this. If you are not careful you might override something and create very hard
> to find bugs. Also make sure to include a line-break or a semicolon at the end. The inject code will be concatenated
> with the transpiled code so make sure it is error free!.

```ts
loader.injectCode("require('tsconfig-register/paths'");
```

When you have specified all the files you want to load, access the "result" field.

```ts
console.log(loader.result.exports);
```

This result field contains all the exported classes / fields / functions from the loaded files.
For example take this file:

```ts
export class A {
	public greet() {
		console.log("Hello World");
	}
}
```

If you then load the file with a method from above, the `result.exports` will be: `[ [Function A] ]`
You can then loop through it and access the file.

### Concret Usecase

Take this example: You build a http framework, this framework allows the developer to define Jobs that will be run by the framework

So you create a Job Decorator

```ts
import "reflect-metadata";

export function Job() {
	return Reflect.metadata([KEY], [VAL]);
}
```

Then the user of the framework can define subclasses of that type.

```ts
import { Job } from "lib/Job";

@Job()
export class UpdateUsersJob {
	run() {
		console.log("Updating user...");
	}
}
```

Without autoloading the user of the framework would have to import the class somewhere in the project or register it like this

```ts
Jobs.register(UpdateUserJob);
```

But with autoloading you dont haveto import your Jobs anywhere. Lets say all jobs are stored in `app/jobs`
Then you can just create a loader and load the classes.

```ts
// Create the loader
const loader = await Autoloader.dynamicImport();

// Load and transpile all files from app/jobs
await loader.fromDirectories(`${__dirname}/app/jobs`);

// Iterate ofer the exports
for (const exported of loader.result.exports) {
	// Get the metadata of the export.
	const metadata: string = Reflect.getMetadata(JobMetadataKey, exported);

	// You can then access members of the class dynamically!
	Jobs.register(new exported());
}
```

Tada... Now you have a much more convenient and less boilerplate solution for jobs loading.
