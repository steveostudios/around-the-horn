import { doc, getDoc } from "@firebase/firestore";
import { db, col, storage } from "./config";
import { Panelist, Topic } from "../helpers/types";
import { getDownloadURL, ref } from "firebase/storage";

export const configDataRef = doc(db, col, "config");
export const playDataRef = doc(db, col, "play");
export const scoresDataRef = doc(db, col, "scores");
export const moderatorScoresDataRef = doc(db, col, "moderatorScores");

// fetch config data
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

export const getImage = async (filename: string) => {
  const imageRef = ref(storage, `panelists/${filename}`);
  try {
    const downloadUrl = await getDownloadURL(imageRef);
    return downloadUrl;
  } catch (error) {
    return "";
  }
};
