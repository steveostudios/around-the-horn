import { Panelist, Score, Topic } from "./types";

export const topics: Topic[] = [
  {
    order: 1,
    id: "1",
    slug: "topic-1",
    content: "Topic 1",
  },
  {
    order: 2,
    id: "2",
    slug: "topic-2",
    content: "Topic 2",
  },
  {
    order: 3,
    id: "3",
    slug: "topic-3",
    content: "Topic 3",
  },
];

export const panelists: Panelist[] = [
  {
    order: 1,
    id: "1",
    name: "Panelist 1",
    img: "https://via.placeholder.com/150",
  },
  {
    order: 2,
    id: "2",
    name: "Panelist 2",
    img: "https://via.placeholder.com/150",
  },
  {
    order: 3,
    id: "3",
    name: "Panelist 3",
    img: "https://via.placeholder.com/150",
  },
];

export const scores: Score[] = [
  {
    id: "1",
    value: 20,
  },
  {
    id: "2",
    value: 49,
  },
  {
    id: "3",
    value: 100000,
  },
];
