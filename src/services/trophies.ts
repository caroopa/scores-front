import axios from "axios";

import type { TrophyAdjustment, TrophyCount } from "../types/domain";
import { BASE_URL } from "../types/constant";

const API_URL = `${BASE_URL}trophies`;

export const getTrophies = async (): Promise<TrophyCount[]> => {
	const response = await axios.get(`${API_URL}/all`);

	return response.data;
};

export const adjustTrophy = async (adjustment: TrophyAdjustment) => {
	const response = await axios.put(`${API_URL}/adjustment`, adjustment);

	return response.data;
};
