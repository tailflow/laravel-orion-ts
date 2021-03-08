import {AuthDriver} from './drivers/default/enums/authDriver';
import HttpClient from './httpClient';
import {AxiosRequestConfig} from 'axios';

export default class Orion {
	protected static host: string;
	protected static prefix: string;
	protected static authDriver: AuthDriver;
	protected static token: string | null = null;

	protected static httpClientConfig: AxiosRequestConfig;

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
		return new HttpClient(baseUrl || Orion.getApiUrl(), Orion.getHttpClientConfig());
	}

	protected static buildHttpClientConfig(): AxiosRequestConfig {
		let config: AxiosRequestConfig = {
			withCredentials: Orion.getAuthDriver() === AuthDriver.Sanctum
		};

		if (Orion.getToken()) {
			config.headers = {
				Authorization: `Bearer ${Orion.getToken()}`
			};
		}

		return config;
	}
}
