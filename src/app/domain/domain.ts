export interface General {
  id_competitor: number;
  school: string;
  instructor: string;
  name: string;
  age: number;
  belt: string;
  isDan: boolean;
  forms: number ;
  combat: number;
  jump: number;
  total: number;
}

export interface Score {
  forms: number ;
  combat: number;
  jump: number;
}

export interface InstructorScore {
  name: string;
  total: number;
}

export interface CompetitorScore {
  name: string;
  belt: string;
  total: number;
}