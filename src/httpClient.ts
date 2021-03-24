import {HttpMethod} from './drivers/default/enums/httpMethod';
import {Orion} from './orion';
import {AuthDriver} from './drivers/default/enums/authDriver';
import {AxiosInstance, AxiosRequestConfig, AxiosResponse} from 'axios';

export class HttpClient {
	protected static xsrfTokenFetched: boolean = false;
	protected baseUrl: string;
	protected client: AxiosInstance;

	constructor(baseUrl: string, client: AxiosInstance) {
		this.baseUrl = baseUrl;
		this.client = client;
	}

	public async request(
		url: string,
		method: HttpMethod,
		params: any = {},
		data: any = {}
	): Promise<AxiosResponse> {
		if (Orion.getAuthDriver() === AuthDriver.Sanctum) {
			await this.prefetchXSRFToken();
		}

		const config: AxiosRequestConfig = Object.assign(Orion.getHttpClientConfig(), {
			baseURL: this.baseUrl,
			url,
			method,
			params
		});

		if (method !== HttpMethod.GET) {
			config.data = data;
		}

		return this.client.request(config);
	}

	public async prefetchXSRFToken(): Promise<void> {
		if (HttpClient.xsrfTokenFetched) {
			return;
		}

		await this.client
			.get(`sanctum/csrf-cookie`, {baseURL: Orion.getHost()})
			.then(() => {
				HttpClient.xsrfTokenFetched = true;
			})
			.catch(() => {
				HttpClient.xsrfTokenFetched = false;
			});
	}

	public getAxios(): AxiosInstance {
		return this.client;
	}
}
