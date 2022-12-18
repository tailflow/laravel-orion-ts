import {AuthDriver} from './drivers/default/enums/authDriver';
import {HttpClient} from './httpClient';
import axios, {AxiosInstance, AxiosRequestConfig} from 'axios';

export class Orion {
	protected static baseUrl: string;
	protected static prefix: string;
	protected static authDriver: AuthDriver;
	protected static token: string | null = null;

	protected static httpClientConfig: AxiosRequestConfig;
	protected static makeHttpClientCallback: (() => AxiosInstance) | null = null;

	public static init(
		baseUrl: string,
		prefix: string = 'api',
		authDriver: AuthDriver = AuthDriver.Default,
		token?: string
	): void {
		Orion.setBaseUrl(baseUrl);
		if (token) {
			Orion.setToken(token);
		}
		this.prefix = prefix;
		this.authDriver = authDriver;

		this.httpClientConfig = Orion.buildHttpClientConfig();
	}

	public static setBaseUrl(baseUrl: string): Orion {
		Orion.baseUrl = baseUrl;
		return Orion;
	}

	public static getBaseUrl(): string {
		return Orion.baseUrl.endsWith('/') ? Orion.baseUrl : `${Orion.baseUrl}/`;
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
		return Orion.getBaseUrl() + Orion.getPrefix();
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

	public static makeHttpClient(baseUrl?: string, withPrefix = true): HttpClient {
		const client: AxiosInstance = this.makeHttpClientCallback
			? this.makeHttpClientCallback()
			: axios.create();

		if (!baseUrl) {
			baseUrl = withPrefix ? Orion.getApiUrl() : Orion.getBaseUrl()
		}

		return new HttpClient(baseUrl, client, this.getAuthDriver());
	}

	public static makeHttpClientUsing(callback: () => AxiosInstance): Orion {
		this.makeHttpClientCallback = callback;

		return this;
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
