export interface General {
	id_competitor: number;
	school: string;
	instructor: string;
	name: string;
	age: number;
	genre: string;
	belt: string;
	is_dan: boolean;
	forms: number;
	combat: number;
	jump: number;
	total: number;
}

export interface Score {
	forms: number;
	combat: number;
	jump: number;
}

export interface SchoolScore {
	id_school: number;
	name: string;
	total: number;
}

export interface CompetitorScore {
	name: string;
	belt: string;
	school: string;
	age: number;
	instructor: string;
	total: number;
}

export interface ScorePayload {
	forms: number;
	combat: number;
	jump: number;
}

export interface TrophyCount {
	place: string;
	count: number;
	color: string;
}

export type MedalType = "gold" | "silver" | "bronze";

export interface TrophyAdjustment {
	medal_type: MedalType;
	value: number;
}
