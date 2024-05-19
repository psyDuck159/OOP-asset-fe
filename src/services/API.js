import Axios from "axios";
import { CONFIG } from "../constants/config";
import { ENDPOINTS } from "../constants/endpoint";

const PUBLIC_URLS = [ENDPOINTS.LOGIN];

const axios = Axios.create({
	timeout: 30000
});

axios.interceptors.request.use(
	function (config) {
		//don't add auth header if url match ignore list
		if (PUBLIC_URLS.indexOf(config.url) >= 0 || config.url.indexOf("public") >= 0) {
			return config;
		}
		//if token is passed in server side
		if (config && config.token) {
			//modify header here to include token
			Object.assign(config.headers, {
				Authorization: `Bearer ${config.token}`
			});
		} else {
			const token = localStorage.getItem(CONFIG.AUTH_TOKEN_KEY);
			if (token) {
				Object.assign(config.headers, { Authorization: `Bearer ${token}` });
			}
		}
		return config;
	},
	function (error) {
		// Do something with request error
		return Promise.reject(error);
	}
);

axios.interceptors.response.use(
	function (response) {
		// Any status code that lie within the range of 2xx cause this function to trigger
		// Do something with response data
		if (response?.config?.url === ENDPOINTS.LOGIN) {
			localStorage.setItem(CONFIG.AUTH_TOKEN_KEY, response?.data?.data?.accessToken);
			localStorage.setItem("user", JSON.stringify(response?.data?.data?.userDto));
		}
		return response;
	},
	function (error) {
		// Any status codes that falls outside the range of 2xx cause this function to trigger
		// Do something with response error
		const status = error.response?.status ?? "";
		if (status === 401) {
			localStorage.clear();
		}
		return Promise.reject(error);
	}
);

const API = {
	get: (endpoint, params = {}) => axios.get(endpoint, { params }),
	post: (endpoint, data = {}) => axios.post(endpoint, data),
	put: (endpoint, data = {}) => axios.put(endpoint, data),
	del: (endpoint, params = {}) => axios.delete(endpoint, { params }),
	patch: (endpoint, data = {}) => axios.patch(endpoint, data)
};

export default API;
