export default class Scope {
	constructor(protected name: string, protected parameters: Array<any> = []) {}

	public getName(): string {
		return this.name;
	}

	public getParameters(): Array<any> {
		return this.parameters;
	}
}
