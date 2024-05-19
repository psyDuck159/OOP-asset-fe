import { ENDPOINTS } from "../constants/endpoint";
import API from "./API";

const { get, post, patch } = API;

export const createReturningRequest = async returningRequest => {
	return post(ENDPOINTS.RETURN, returningRequest);
};

export const getAllReturningRequest = async params => {
	return get(ENDPOINTS.RETURN + "/", params);
};


export const respondRequestReturning = async (id, data) => {
	return patch(`${ENDPOINTS.RETURN}/${id}`, data)
}