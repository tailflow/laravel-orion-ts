import {HttpMethod} from './drivers/default/enums/httpMethod';
import {Orion} from './orion';
import {AxiosInstance, AxiosRequestConfig, AxiosResponse} from 'axios';
import {AuthDriver} from "./drivers/default/enums/authDriver";

export class HttpClient {
	protected static csrfTokenFetched = false;

	constructor(protected baseUrl: string, protected client: AxiosInstance, protected authDriver: AuthDriver) {
		this.baseUrl = baseUrl;
		this.client = client;
		this.authDriver = authDriver;
	}

	public async request<Response extends Record<string, unknown>>(
		url: string,
		method: HttpMethod,
		params: Record<string, unknown> | null = {},
		data: Record<string, unknown> = {}
	): Promise<AxiosResponse<Response>> {
		const config: AxiosRequestConfig = Object.assign(Orion.getHttpClientConfig(), {
			baseURL: this.baseUrl,
			url,
			method,
			params,
		});

		if (method !== HttpMethod.GET) {
			config.data = data;

			if (!HttpClient.csrfTokenFetched && this.authDriver === AuthDriver.Sanctum) {
				await this.fetchCsrfToken();
			}
		}

		return this.client.request<Response>(config);
	}

	public async get<Response extends Record<string, unknown>>(url: string, params: Record<string, unknown>): Promise<AxiosResponse<Response>> {
		return this.request<Response>(
			url, HttpMethod.GET, params
		)
	}

	public async post<Response extends Record<string, unknown>>(url: string, params: Record<string, unknown>, data: Record<string, unknown>): Promise<AxiosResponse<Response>> {
		return this.request<Response>(
			url, HttpMethod.POST, params, data
		)
	}

	public async patch<Response extends Record<string, unknown>>(url: string, params: Record<string, unknown>, data: Record<string, unknown>): Promise<AxiosResponse<Response>> {
		return this.request<Response>(
			url, HttpMethod.PATCH, params, data
		)
	}

	public async delete<Response extends Record<string, unknown>>(url: string, params: Record<string, unknown>): Promise<AxiosResponse<Response>> {
		return this.request<Response>(
			url, HttpMethod.DELETE, params
		)
	}

	public async fetchCsrfToken(): Promise<void> {
		if (this.authDriver !== AuthDriver.Sanctum) {
			throw new Error(
				`Current auth driver is set to "${this.authDriver}". Fetching CSRF cookie can only be used with "sanctum" driver.`
			);
		}

		let response = null;

		try {
			response = await this
				.getAxios()
				.get(`sanctum/csrf-cookie`, {baseURL: Orion.getHost()});
		} catch (error) {
			throw new Error(
				`Unable to retrieve XSRF token cookie due to network error. Please ensure that SANCTUM_STATEFUL_DOMAINS and SESSION_DOMAIN environment variables are configured correctly on the API side.`
			);
		}

		const xsrfTokenPresent =
			document.cookie
				.split(';')
				.filter((cookie: string) =>
					cookie.includes(this.getAxios().defaults.xsrfCookieName || 'XSRF-TOKEN')
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

	public getAxios(): AxiosInstance {
		return this.client;
	}
}
