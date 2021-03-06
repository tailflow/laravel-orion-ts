export default class Orion {
	protected static apiUrl: string;
	protected static token: string | null = null;
	protected static useCredentials: boolean = false;

	public static init(apiUrl: string, token?: string, withCredentials: boolean = false): void {
		Orion.setApiUrl(apiUrl);
		if (token) {
			Orion.setToken(token);
		}
		this.useCredentials = withCredentials;
	}

	public static setApiUrl(apiUrl: string): Orion {
		Orion.apiUrl = apiUrl;
		return Orion;
	}

	public static getApiUrl(): string {
		return Orion.apiUrl.endsWith('/') ? Orion.apiUrl : `${Orion.apiUrl}/`;
	}

	public static setToken(token: string): Orion {
		Orion.token = token;
		return Orion;
	}

	public static withoutToken(): Orion {
		Orion.token = null;
		return Orion;
	}

	public static getToken(): string | null {
		return Orion.token;
	}

	public static withCredentials(): Orion {
		Orion.useCredentials = true;
		return Orion;
	}

	public static withoutCredentials(): Orion {
		Orion.useCredentials = false;
		return Orion;
	}

	public static usesCredentials(): boolean {
		return Orion.useCredentials;
	}
}
