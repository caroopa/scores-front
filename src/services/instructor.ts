import axios from "axios";
import type { InstructorScore } from "../types/domain";
import { BASE_URL } from "../types/constant";

const API_URL = BASE_URL + "instructors";

export const getInstructorScores = async (): Promise<InstructorScore[]> => {
	const response = await axios.get(API_URL);

	return response.data;
};
