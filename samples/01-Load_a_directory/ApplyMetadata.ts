import "reflect-metadata";

export const MetdataKey = Symbol("ApplayMetadataKey");

export function ApplyMetadata(value: string) {
	return Reflect.metadata(MetdataKey, value);
}
