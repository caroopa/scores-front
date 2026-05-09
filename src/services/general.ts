import axios from "axios";

import type { General, TrophyCount } from "../types/domain";

import { BASE_URL } from "../types/constant";

export interface ScorePayload {
	forms: number;
	combat: number;
	jump: number;
}

const API_URL = `${BASE_URL}general`;

export const getCompetitors = async (): Promise<General[]> => {
	const response = await axios.get(API_URL);

	return response.data;
};

export const uploadData = async (file: File): Promise<void> => {
	const formData = new FormData();

	formData.append("file", file);

	await axios.post(`${API_URL}/upload`, formData, {
		headers: {
			"Content-Type": "multipart/form-data",
		},
	});
};

export const calculateTotal = async (
	competitorId: number,
	score: ScorePayload,
): Promise<void> => {
	await axios.put(`${API_URL}/calculate_total/${competitorId}`, score);
};

export const trophiesCounts = async (): Promise<TrophyCount[]> => {
	const response = await axios.get(`${API_URL}/trophies_counts`);

	return response.data;
};
