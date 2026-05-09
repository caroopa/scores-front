import axios from "axios";
import type { SchoolScore } from "../types/domain";
import { BASE_URL } from "../types/constant";

const API_URL = BASE_URL + "schools";

export const getSchoolScores = async (): Promise<SchoolScore[]> => {
	const response = await axios.get(API_URL);

	return response.data;
};

export const adjustSchoolScore = async (schoolId: number, value: number) => {
	await axios.put(`${API_URL}/adjust/${schoolId}`, null, {
		params: { value },
	});
};
