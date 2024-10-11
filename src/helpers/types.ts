export interface Topic {
  order: number;
  id: string;
  slug: string;
  content: string;
}

export interface Panelist {
  order: number;
  id: string;
  img: string;
  name: string;
  imgUrl?: string;
}

export interface Score {
  id: string;
  value: number;
}

export interface ConfigData {
  topics: Topic[];
  panelists: Panelist[];
}

export enum Mode {
  PLAY = "play",
  PAUSE = "pause",
  INSTRUCTION = "instruction",
}

export interface PlayData {
  currentTopicId: string;
  scores: Score[];
  currentMode: Mode;
}
