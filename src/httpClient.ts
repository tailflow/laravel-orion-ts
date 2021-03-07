import { HttpMethod } from './drivers/default/enums/httpMethod';
import Orion from './orion';
import { AuthDriver } from './drivers/default/enums/authDriver';
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

export default class HttpClient {
	protected client: AxiosInstance;
	protected static xsrfTokenFetched: boolean = false;

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

		return this.client.request({ url, method, params, data });
	}

	public async prefetchXSRFToken(): Promise<void> {
		if (HttpClient.xsrfTokenFetched) {
			return;
		}

		await this.client
			.get(`sanctum/csrf-cookie`, { baseURL: Orion.getHost() })
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
