export class SyncResult {
	constructor(
		public attached: Array<number | string>,
		public updated: Array<number | string>,
		public detached: Array<number | string>
	) {
	}
}
