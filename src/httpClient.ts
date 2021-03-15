import {HttpMethod} from './drivers/default/enums/httpMethod';
import {Orion} from './orion';
import {AuthDriver} from './drivers/default/enums/authDriver';
import axios, {AxiosInstance, AxiosRequestConfig, AxiosResponse} from 'axios';

export class HttpClient {
	protected static xsrfTokenFetched: boolean = false;
	protected client: AxiosInstance;

	constructor(baseUrl: string, config: AxiosRequestConfig) {
		let clientConfig: AxiosRequestConfig = Object.assign(config, {
			baseURL: baseUrl
		});

		this.client = axios.create(clientConfig);
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

		let config: AxiosRequestConfig = {url, method, params};

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
