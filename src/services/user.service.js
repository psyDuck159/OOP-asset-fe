import { ENDPOINTS } from "../constants/endpoint";
import { PATHS } from "../constants/paths";
import API from "./API";

const { get, post, put } = API;

export const getAll = async param => {
	return get(ENDPOINTS.USER + "/", param);
};

export const getUserDetails = async username => {
	return get(`${ENDPOINTS.USER}/${username}`);
};

export const getMyAssignments = async (username, param) => {
	return get(`${ENDPOINTS.USER}/${username}${PATHS.ASSIGNMENT}`, param);
};

export const createUser = async userData => {
	return post(ENDPOINTS.USER, userData);
};

export const updateUser = async (username, userData) => {
	return put(`${ENDPOINTS.USER}/${username}`, userData);
};
