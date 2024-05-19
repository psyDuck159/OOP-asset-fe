import { ENDPOINTS } from "../constants/endpoint";
import API from "./API";

const { get, post } = API;

export const getAllAssets = async param => {
	return get(ENDPOINTS.ASSET + "/", param);
};

export const getAssetDetails = async assetCode => {
	return get(`${ENDPOINTS.ASSET}/${assetCode}`);
};

export const createAsset = async payload => {
	return post(ENDPOINTS.ASSET, payload);
};
