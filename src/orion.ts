export default class Orion {
	protected static host: string;
	protected static prefix: string;
	protected static token: string | null = null;
	protected static useCredentials: boolean = false;

	public static init(
		host: string,
		prefix: string = 'api',
		token?: string,
		withCredentials: boolean = false
	): void {
		Orion.setHost(host);
		if (token) {
			Orion.setToken(token);
		}
		this.prefix = prefix;
		this.useCredentials = withCredentials;
	}

	public static setHost(apiUrl: string): Orion {
		Orion.host = apiUrl;
		return Orion;
	}

	public static getHost(): string {
		return Orion.host.endsWith('/') ? Orion.host : `${Orion.host}/`;
	}

	public static setPrefix(prefix: string): Orion {
		Orion.prefix = prefix;
		return Orion;
	}

	public static getPrefix(): string {
		return Orion.prefix.startsWith('/') ? Orion.prefix : `${Orion.prefix}/`;
	}

	public static getApiUrl(): string {
		return Orion.getHost() + Orion.getPrefix();
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
