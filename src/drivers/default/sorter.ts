import {SortDirection} from './enums/sortDirection';

export default class Sorter {
	constructor(protected field: string, protected direction: SortDirection = SortDirection.Asc) {
	}

	public getField(): string {
		return this.field;
	}

	public getDirection(): SortDirection {
		return this.direction;
	}
}
