export default class Orion {
	private static apiUrl: string;

	public static setApiUrl(apiUrl: string): Orion {
		Orion.apiUrl = apiUrl;
		return Orion;
	}

	public static getApiUrl(): string {
		return Orion.apiUrl.endsWith('/') ? Orion.apiUrl : `${Orion.apiUrl}/`;
	}
}
