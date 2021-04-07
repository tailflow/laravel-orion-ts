import { AuthDriver } from './drivers/default/enums/authDriver';
import { HttpClient } from './httpClient';
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

export class Orion {
	protected static host: string;
	protected static prefix: string;
	protected static authDriver: AuthDriver;
	protected static token: string | null = null;

	protected static httpClientConfig: AxiosRequestConfig;
	protected static makeHttpClientCallback: (() => AxiosInstance) | null = null;

	public static init(
		host: string,
		prefix: string = 'api',
		authDriver: AuthDriver = AuthDriver.Default,
		token?: string
	): void {
		Orion.setHost(host);
		if (token) {
			Orion.setToken(token);
		}
		this.prefix = prefix;
		this.authDriver = authDriver;

		this.httpClientConfig = Orion.buildHttpClientConfig();
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
		return Orion.prefix;
	}

	public static setAuthDriver(authDriver: AuthDriver): Orion {
		this.authDriver = authDriver;
		Orion.httpClientConfig = Orion.buildHttpClientConfig();

		return Orion;
	}

	public static getAuthDriver(): AuthDriver {
		return this.authDriver;
	}

	public static getApiUrl(): string {
		return Orion.getHost() + Orion.getPrefix();
	}

	public static setToken(token: string): Orion {
		Orion.token = token;
		Orion.httpClientConfig = Orion.buildHttpClientConfig();
		return Orion;
	}

	public static withoutToken(): Orion {
		Orion.token = null;
		Orion.httpClientConfig = Orion.buildHttpClientConfig();
		return Orion;
	}

	public static getToken(): string | null {
		return Orion.token;
	}

	public static getHttpClientConfig(): AxiosRequestConfig {
		return this.httpClientConfig;
	}

	public static setHttpClientConfig(config: AxiosRequestConfig): Orion {
		this.httpClientConfig = config;
		return Orion;
	}

	public static makeHttpClient(baseUrl?: string): HttpClient {
		const client: AxiosInstance = this.makeHttpClientCallback
			? this.makeHttpClientCallback()
			: axios.create();

		return new HttpClient(baseUrl || Orion.getApiUrl(), client);
	}

	public static makeHttpClientUsing(callback: () => AxiosInstance): Orion {
		this.makeHttpClientCallback = callback;

		return this;
	}

	public static async csrf(): Promise<void> {
		if (this.authDriver !== AuthDriver.Sanctum) {
			throw new Error(
				`Current auth driver is set to "${this.authDriver}". Fetching CSRF cookie can only be used with "sanctum" driver.`
			);
		}

		const httpClient = Orion.makeHttpClient();
		let response = null;

		try {
			response = await httpClient
				.getAxios()
				.get(`sanctum/csrf-cookie`, { baseURL: Orion.getHost() });
		} catch (error) {
			throw new Error(
				`Unable to retrieve XSRF token cookie due to network error. Please ensure that SANCTUM_STATEFUL_DOMAINS and SESSION_DOMAIN environment variables are configured correctly on the API side.`
			);
		}

		const xsrfTokenPresent =
			document.cookie
				.split(';')
				.filter((cookie: string) =>
					cookie.includes(httpClient.getAxios().defaults.xsrfCookieName || 'XSRF-TOKEN')
				).length > 0;

		if (!xsrfTokenPresent) {
			console.log(`Response status: ${response.status}`);
			console.log(`Response headers:`);
			console.log(response.headers);
			console.log(`Cookies: ${document.cookie}`);

			throw new Error(
				`XSRF token cookie is missing in the response. Please ensure that SANCTUM_STATEFUL_DOMAINS and SESSION_DOMAIN environment variables are configured correctly on the API side.`
			);
		}
	}

	protected static buildHttpClientConfig(): AxiosRequestConfig {
		const config: AxiosRequestConfig = {
			withCredentials: Orion.getAuthDriver() === AuthDriver.Sanctum,
		};

		if (Orion.getToken()) {
			config.headers = {
				Authorization: `Bearer ${Orion.getToken()}`,
			};
		}

		return config;
	}
}
