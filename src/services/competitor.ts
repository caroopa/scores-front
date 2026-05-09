import axios from "axios";
import type { CompetitorScore } from "../types/domain";
import { BASE_URL } from "../types/constant";

const API_URL = BASE_URL + "competitors";

export const getScores = async (
	category: string,
): Promise<CompetitorScore[]> => {
	const response = await axios.get(`${API_URL}/${category}`);

	return response.data;
};
