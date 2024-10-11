import { doc, getDoc, onSnapshot, setDoc } from "@firebase/firestore";
import { db, col, storage } from "./config";
import { Mode, Panelist, PlayData, Score, Topic } from "../helpers/types";
import { getDownloadURL, ref } from "firebase/storage";

export const getConfigData = async () => {
  let topics: Topic[] = [];
  let panelists: Panelist[] = [];

  const ref = doc(db, col, "config");

  const snap = await getDoc(ref);

  if (snap.exists()) {
    const data = snap.data();

    topics = data.topics;
    panelists = data.panelists;
  }

  const panelistsWithImageUrls = await Promise.all(
    panelists.map(async (panelist) => ({
      ...panelist,
      imgUrl: await getImage(panelist.img),
    }))
  );

  return { topics, panelists: panelistsWithImageUrls };
};

export const configDataRef = doc(db, col, "config");
export const playDataRef = doc(db, col, "play");
export const scoresDataRef = doc(db, col, "scores");

export const subPlayData = () => {
  let response: PlayData = {
    currentTopicId: "",
    currentMode: Mode.INSTRUCTION,
    scores: [],
  };
  onSnapshot(playDataRef, (snap) => {
    if (snap.exists()) {
      console.log("Data changed", snap.data());
      const data = snap.data();
      response = {
        currentTopicId: data.currentTopicId,
        currentMode: data.currentMode,
        scores: Object.keys(data.scores).map((key) => ({
          id: key,
          value: data.scores[key],
        })),
      };
    }
  });

  return response;
};

export const getPlayData = async () => {
  let scores: Score[] = [];
  let currentTopicId = "";
  let currentMode = Mode.INSTRUCTION;

  const ref = doc(db, col, "play");

  const snap = await getDoc(ref);

  if (snap.exists()) {
    const data = snap.data();
    scores = Object.keys(data.scores).map((key) => ({
      id: key,
      value: data.scores[key],
    }));
    currentTopicId = data.currentTopicId;
    currentMode = data.currentMode;
  }

  return {
    currentTopicId,
    currentMode,
    scores,
  };
};

export const updateScore = async (id: string, value: number) => {
  const ref = doc(db, col, "play");

  const snap = await getDoc(ref);

  // TODO: Not good because this replaces. Needs to update.
  if (snap.exists()) {
    const data = snap.data();
    data.scores[id] = value;

    await setDoc(ref, data);
  }
};

export const getImage = async (filename: string) => {
  const imageRef = ref(storage, `panelists/${filename}`);
  try {
    const downloadUrl = await getDownloadURL(imageRef);
    return downloadUrl;
  } catch (error) {
    return "";
  }
};

export const setMode = async (mode: string) => {
  const ref = doc(db, col, "play");

  const snap = await getDoc(ref);

  if (snap.exists()) {
    const data = snap.data();
    data.currentMode = mode;

    await setDoc(ref, data);
  }
};

export const setCurrentTopic = async (topicId: string | null) => {
  const ref = doc(db, col, "play");

  const snap = await getDoc(ref);

  if (snap.exists()) {
    const data = snap.data();
    data.currentTopicId = topicId;

    await setDoc(ref, data);
  }
};

export const updateTopics = async (topics: Topic[]) => {
  const ref = doc(db, col, "config");

  const snap = await getDoc(ref);

  if (snap.exists()) {
    const data = snap.data();
    data.topics = topics;

    await setDoc(ref, data);
  }
};
