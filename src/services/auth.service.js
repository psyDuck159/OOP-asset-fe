import { ENDPOINTS } from "../constants/endpoint";
import API from "./API";

const { post, patch } = API;

export const login = async auth => {
	return post(ENDPOINTS.LOGIN, auth);
};

export const changePassword = async data => {
	return patch(ENDPOINTS.CHANGE_PASSWORD, data);
};
