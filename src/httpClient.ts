import {HttpMethod} from './drivers/default/enums/httpMethod';
import {Orion} from './orion';
import {AxiosInstance, AxiosRequestConfig, AxiosResponse} from 'axios';

export class HttpClient {
	constructor(protected baseUrl: string, protected client: AxiosInstance) {
		this.baseUrl = baseUrl;
		this.client = client;
	}

	public async request<Response extends Record<string, unknown>>(
		url: string,
		method: HttpMethod,
		params?: Record<string, unknown> | null,
		data?: Record<string, unknown>
	): Promise<AxiosResponse<Response>> {
		const config: AxiosRequestConfig = Object.assign(Orion.getHttpClientConfig(), {
			baseURL: this.baseUrl,
			url,
			method,
			params,
		});

		if (method !== HttpMethod.GET) {
			config.data = data;
		}

		return this.client.request<Response>(config);
	}

	public async get<Response extends Record<string, unknown>>(url: string, params?: Record<string, unknown>): Promise<AxiosResponse<Response>> {
		return this.request<Response>(
			url, HttpMethod.GET, params
		)
	}

	public async post<Response extends Record<string, unknown>>(url: string, data: Record<string, unknown>, params?: Record<string, unknown>,): Promise<AxiosResponse<Response>> {
		return this.request<Response>(
			url, HttpMethod.POST, params, data
		)
	}

	public async patch<Response extends Record<string, unknown>>(url: string, data: Record<string, unknown>, params?: Record<string, unknown>, ): Promise<AxiosResponse<Response>> {
		return this.request<Response>(
			url, HttpMethod.PATCH, params, data
		)
	}

	public async delete<Response extends Record<string, unknown>>(url: string, params?: Record<string, unknown>): Promise<AxiosResponse<Response>> {
		return this.request<Response>(
			url, HttpMethod.DELETE, params
		)
	}

	public getAxios(): AxiosInstance {
		return this.client;
	}
}
