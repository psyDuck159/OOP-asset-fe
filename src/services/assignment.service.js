import { ENDPOINTS } from "../constants/endpoint";
import API from "./API";

const { get, post, patch } = API;

export const getAssignments = async param => {
	return get(`${ENDPOINTS.ASSIGNMENT}/`, param);
};

export const getAssignmentDetails = async id => {
	return get(`${ENDPOINTS.ASSIGNMENT}/${id}`);
};

export const createAssignment = async data => {
	return post(ENDPOINTS.ASSIGNMENT, data);
};

export const respondAssignment = async (id, data) => {
	return patch(`${ENDPOINTS.ASSIGNMENT}/${id}`, data);
};
