import { ENDPOINTS } from "../constants/endpoint";
import API from "./API";

const { get, post } = API;

export const getAllCategories = async () => {
	return get(ENDPOINTS.CATEGORY);
};

export const checkExistByPrefix = async prefix => {
	return get(ENDPOINTS.CATEGORY + "/exist-prefix/" + prefix);
};

export const checkExistByCategory = async category => {
	return get(ENDPOINTS.CATEGORY + "/exist-category/" + category);
};

export const createCategory = async payload => {
	return post(ENDPOINTS.CATEGORY, payload);
};
