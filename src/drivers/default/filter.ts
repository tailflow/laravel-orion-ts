import {FilterOperator} from './enums/filterOperator';
import {FilterType} from './enums/filterType';

export class Filter {
	constructor(
		protected field: string,
		protected operator: FilterOperator,
		protected value: any,
		protected type?: FilterType
	) {
	}

	public getField(): string {
		return this.field;
	}

	public getOperator(): FilterOperator {
		return this.operator;
	}

	public getValue(): any {
		return this.value;
	}

	public getType(): FilterType | undefined {
		return this.type;
	}
}
