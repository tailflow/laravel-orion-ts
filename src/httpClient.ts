import { HttpMethod } from './drivers/default/enums/httpMethod';
import { Orion } from './orion';
import { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

export class HttpClient {
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
		const {headers, ...configParams} = params;

		const config: AxiosRequestConfig = Object.assign(Orion.getHttpClientConfig(), {
			baseURL: this.baseUrl,
			url,
			method,
			params: configParams,
		});

		if (method !== HttpMethod.GET) {
			config.data = data;
		}

		if(headers) {
			config.headers = headers;
		}

		return this.client.request(config);
	}

	public getAxios(): AxiosInstance {
		return this.client;
	}
}
